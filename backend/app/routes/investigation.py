from fastapi import APIRouter, HTTPException, status
from app.models import (
    InvestigationRequest, InvestigationResponse, BatchSummary, 
    AffectedKitchen, AffectedDish, AffectedOrder, AffectedCustomer, ImpactSummary,
    RecallRequest, RecallResponse,
    TraceOriginRequest, TraceOriginResponse, TracePathNode, SupplierSummary,
    SimulateContainmentRequest, SimulateContainmentResponse, SimulationScope
)
from app.database import get_driver, settings
from neo4j.exceptions import ServiceUnavailable

router = APIRouter()

INVESTIGATION_CYPHER = """
MATCH (b:Batch {id: $batch_id})
-[:DELIVERED_TO]->(k:Kitchen)
-[:USED_IN]->(d:Dish)
<-[:ORDERED_AS]-(o:Order)
-[:PLACED_BY]->(c:Customer)
RETURN b, k, d, o, c
"""

BATCH_PROFILE_CYPHER = """
MATCH (b:Batch {id: $batch_id})
RETURN b
"""

@router.post("/api/investigate/batch", response_model=InvestigationResponse)
def investigate_batch(request: InvestigationRequest):
    driver = get_driver()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="Database connection unavailable"
        )
    
    if not request.batch_id or not request.batch_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="batch_id is required"
        )

    batch_id = request.batch_id.strip()

    try:
        with driver.session(database=settings.neo4j_database) as session:
            # 1. Fetch batch profile to check existence
            batch_result = session.run(BATCH_PROFILE_CYPHER, batch_id=batch_id)
            batch_record = batch_result.single()
            
            if not batch_record:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"Batch {batch_id} not found"
                )
            
            b_node = batch_record["b"]
            batch_summary = BatchSummary(
                id=b_node["id"],
                ingredient=b_node["ingredient"],
                quantity=b_node["quantity"],
                received_date=b_node["received_date"],
                expiry_date=b_node["expiry_date"],
                status=b_node["status"]
            )
            
            # 2. Perform traversal
            traversal_result = session.run(INVESTIGATION_CYPHER, batch_id=batch_id)
            
            kitchens_dict = {}
            dishes_dict = {}
            orders_dict = {}
            customers_dict = {}
            
            for record in traversal_result:
                k = record["k"]
                if k["id"] not in kitchens_dict:
                    kitchens_dict[k["id"]] = AffectedKitchen(
                        id=k["id"], name=k["name"], city=k["city"], 
                        location=k["location"], status=k["status"]
                    )
                
                d = record["d"]
                if d["id"] not in dishes_dict:
                    dishes_dict[d["id"]] = AffectedDish(
                        id=d["id"], name=d["name"], category=d["category"], 
                        price=d["price"], status=d["status"]
                    )
                    
                o = record["o"]
                if o["id"] not in orders_dict:
                    orders_dict[o["id"]] = AffectedOrder(
                        id=o["id"], timestamp=o["timestamp"], status=o["status"]
                    )
                    
                c = record["c"]
                if c["id"] not in customers_dict:
                    customers_dict[c["id"]] = AffectedCustomer(
                        id=c["id"], name=c["name"], city=c["city"]
                    )
            
            # 3. Build response
            return InvestigationResponse(
                success=True,
                investigation_type="batch",
                entity_id=batch_id,
                batch=batch_summary,
                kitchens=list(kitchens_dict.values()),
                dishes=list(dishes_dict.values()),
                orders=list(orders_dict.values()),
                customers=list(customers_dict.values()),
                impact=ImpactSummary(
                    kitchens=len(kitchens_dict),
                    dishes=len(dishes_dict),
                    orders=len(orders_dict),
                    customers=len(customers_dict)
                ),
                cypher=INVESTIGATION_CYPHER.strip(),
                parameters={"batch_id": batch_id}
            )
            
    except ServiceUnavailable:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="Failed to communicate with Neo4j database"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An unexpected error occurred during investigation."
        )

RECALL_CYPHER = """
MATCH (b:Batch {id: $batch_id})
SET b.status = "CONTAMINATED"
RETURN b
"""

@router.post("/api/recall/batch", response_model=RecallResponse)
def recall_batch(request: RecallRequest):
    driver = get_driver()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="Database connection unavailable"
        )
    
    if not request.batch_id or not request.batch_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="batch_id is required"
        )

    batch_id = request.batch_id.strip()

    try:
        with driver.session(database=settings.neo4j_database) as session:
            result = session.run(RECALL_CYPHER, batch_id=batch_id)
            record = result.single()
            
            if not record:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"Batch {batch_id} not found"
                )
            
            b_node = record["b"]
            batch_summary = BatchSummary(
                id=b_node["id"],
                ingredient=b_node["ingredient"],
                quantity=b_node["quantity"],
                received_date=b_node["received_date"],
                expiry_date=b_node["expiry_date"],
                status=b_node["status"]
            )
            
            return RecallResponse(
                success=True,
                batch=batch_summary,
                cypher=RECALL_CYPHER.strip(),
                parameters={"batch_id": batch_id}
            )
            
    except ServiceUnavailable:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="Failed to communicate with Neo4j database"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An unexpected error occurred during recall."
        )

TRACE_ORDER_CYPHER = """
MATCH (o:Order {id: $entity_id})
OPTIONAL MATCH (o)-[:ORDERED_AS]->(d:Dish)
OPTIONAL MATCH (d)<-[:USED_IN]-(k:Kitchen)
OPTIONAL MATCH (k)<-[:DELIVERED_TO]-(b:Batch)
OPTIONAL MATCH (b)<-[:SUPPLIES]-(s:Supplier)
RETURN o, d, k, b, s
"""

TRACE_CUSTOMER_CYPHER = """
MATCH (c:Customer {id: $entity_id})
OPTIONAL MATCH (c)<-[:PLACED_BY]-(o:Order)
OPTIONAL MATCH (o)-[:ORDERED_AS]->(d:Dish)
OPTIONAL MATCH (d)<-[:USED_IN]-(k:Kitchen)
OPTIONAL MATCH (k)<-[:DELIVERED_TO]-(b:Batch)
OPTIONAL MATCH (b)<-[:SUPPLIES]-(s:Supplier)
RETURN c, o, d, k, b, s
"""

@router.post("/api/trace/origin", response_model=TraceOriginResponse)
def trace_origin(request: TraceOriginRequest):
    driver = get_driver()
    if not driver:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
    
    e_type = request.entity_type.strip()
    e_id = request.entity_id.strip()
    
    if e_type not in ["Order", "Customer"]:
        raise HTTPException(status_code=400, detail="Invalid entity_type for trace")
        
    cypher = TRACE_ORDER_CYPHER if e_type == "Order" else TRACE_CUSTOMER_CYPHER
    
    with driver.session(database=settings.neo4j_database) as session:
        result = session.run(cypher, entity_id=e_id)
        records = list(result)
        
        if not records:
            raise HTTPException(status_code=404, detail=f"{e_type} {e_id} not found")
            
        record = records[0] # The upstream path is guaranteed to be a single linear path in our current model schema, or at least we take the primary path. Actually multiple dishes could be in an order, but for simplicity of this trace demo we expect one root cause.
        
        # Build path and entities
        path = []
        c_node = record.get("c")
        o_node = record.get("o")
        d_node = record.get("d")
        k_node = record.get("k")
        b_node = record.get("b")
        s_node = record.get("s")
        
        customer, order, dish, kitchen, batch, supplier = None, None, None, None, None, None
        
        if c_node:
            customer = AffectedCustomer(id=c_node["id"], name=c_node.get("name",""), city=c_node.get("city",""))
            path.append(TracePathNode(label="Customer", id=c_node["id"], name=c_node.get("name","")))
        if o_node:
            order = AffectedOrder(id=o_node["id"], timestamp=o_node.get("timestamp",""), status=o_node.get("status",""))
            path.append(TracePathNode(label="Order", id=o_node["id"]))
        if d_node:
            dish = AffectedDish(id=d_node["id"], name=d_node.get("name",""), category=d_node.get("category",""), price=d_node.get("price",0), status=d_node.get("status",""))
            path.append(TracePathNode(label="Dish", id=d_node["id"], name=d_node.get("name","")))
        if k_node:
            kitchen = AffectedKitchen(id=k_node["id"], name=k_node.get("name",""), city=k_node.get("city",""), location=k_node.get("location",""), status=k_node.get("status",""))
            path.append(TracePathNode(label="Kitchen", id=k_node["id"], name=k_node.get("name","")))
        if b_node:
            batch = BatchSummary(id=b_node["id"], ingredient=b_node.get("ingredient",""), quantity=b_node.get("quantity",0), received_date=b_node.get("received_date",""), expiry_date=b_node.get("expiry_date",""), status=b_node.get("status",""))
            path.append(TracePathNode(label="Batch", id=b_node["id"], name=b_node.get("ingredient","")))
        if s_node:
            supplier = SupplierSummary(id=s_node["id"], name=s_node.get("name",""), location=s_node.get("location",""))
            path.append(TracePathNode(label="Supplier", id=s_node["id"], name=s_node.get("name","")))
            
        return TraceOriginResponse(
            success=True,
            source_entity_type=e_type,
            source_entity_id=e_id,
            path=path,
            supplier=supplier,
            batch=batch,
            kitchen=kitchen,
            dish=dish,
            order=order,
            customer=customer,
            cypher=cypher.strip(),
            parameters={"entity_id": e_id}
        )

SIMULATE_REMAINING_CYPHER = """
MATCH (b:Batch {id: $batch_id})-[:DELIVERED_TO]->(k:Kitchen)
WHERE k.id <> $kitchen_id
OPTIONAL MATCH (k)-[:USED_IN]->(d:Dish)<-[:ORDERED_AS]-(o:Order)-[:PLACED_BY]->(c:Customer)
RETURN k, d, o, c
"""

SIMULATE_CONTAINED_CYPHER = """
MATCH (b:Batch {id: $batch_id})-[:DELIVERED_TO]->(k:Kitchen {id: $kitchen_id})
OPTIONAL MATCH (k)-[:USED_IN]->(d:Dish)<-[:ORDERED_AS]-(o:Order)-[:PLACED_BY]->(c:Customer)
RETURN k, d, o, c
"""

def extract_scope(records):
    k_dict, d_dict, o_dict, c_dict = {}, {}, {}, {}
    for record in records:
        k = record.get("k")
        d = record.get("d")
        o = record.get("o")
        c = record.get("c")
        
        if k and k["id"] not in k_dict:
            k_dict[k["id"]] = AffectedKitchen(id=k["id"], name=k.get("name",""), city=k.get("city",""), location=k.get("location",""), status=k.get("status",""))
        if d and d["id"] not in d_dict:
            d_dict[d["id"]] = AffectedDish(id=d["id"], name=d.get("name",""), category=d.get("category",""), price=d.get("price",0), status=d.get("status",""))
        if o and o["id"] not in o_dict:
            o_dict[o["id"]] = AffectedOrder(id=o["id"], timestamp=o.get("timestamp",""), status=o.get("status",""))
        if c and c["id"] not in c_dict:
            c_dict[c["id"]] = AffectedCustomer(id=c["id"], name=c.get("name",""), city=c.get("city",""))
            
    return SimulationScope(
        kitchens=list(k_dict.values()),
        dishes=list(d_dict.values()),
        orders=list(o_dict.values()),
        customers=list(c_dict.values()),
        counts=ImpactSummary(
            kitchens=len(k_dict), dishes=len(d_dict), orders=len(o_dict), customers=len(c_dict)
        )
    )

@router.post("/api/simulate/containment", response_model=SimulateContainmentResponse)
def simulate_containment(request: SimulateContainmentRequest):
    driver = get_driver()
    if not driver:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
        
    b_id = request.batch_id.strip()
    k_id = request.kitchen_id.strip()
    
    with driver.session(database=settings.neo4j_database) as session:
        # Verify connection exists
        check_cypher = "MATCH (b:Batch {id: $b_id})-[:DELIVERED_TO]->(k:Kitchen {id: $k_id}) RETURN b"
        if not session.run(check_cypher, b_id=b_id, k_id=k_id).single():
            raise HTTPException(status_code=404, detail="Kitchen is not affected by this batch")
            
        remaining_records = list(session.run(SIMULATE_REMAINING_CYPHER, batch_id=b_id, kitchen_id=k_id))
        contained_records = list(session.run(SIMULATE_CONTAINED_CYPHER, batch_id=b_id, kitchen_id=k_id))
        
        remaining_scope = extract_scope(remaining_records)
        contained_scope = extract_scope(contained_records)
        
        # Combine Cypher for display
        combined_cypher = f"// REMAINING SCOPE\n{SIMULATE_REMAINING_CYPHER.strip()}\n\n// CONTAINED SCOPE\n{SIMULATE_CONTAINED_CYPHER.strip()}"
        
        return SimulateContainmentResponse(
            success=True,
            batch_id=b_id,
            containment_kitchen_id=k_id,
            remaining=remaining_scope,
            contained=contained_scope,
            cypher=combined_cypher,
            parameters={"batch_id": b_id, "kitchen_id": k_id}
        )

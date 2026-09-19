from fastapi import APIRouter, HTTPException, status
from app.models import (
    InvestigationRequest, InvestigationResponse, BatchSummary, 
    AffectedKitchen, AffectedDish, AffectedOrder, AffectedCustomer, ImpactSummary,
    RecallRequest, RecallResponse
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

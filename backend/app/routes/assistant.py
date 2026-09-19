from fastapi import APIRouter, HTTPException
import json
from google import genai
from google.genai import types
from app.models import TraceAssistRequest, TraceAssistResponse
from app.database import get_driver, settings
from app.routes.investigation import (
    TRACE_ORDER_CYPHER, 
    TRACE_CUSTOMER_CYPHER,
    SIMULATE_REMAINING_CYPHER,
    extract_scope
)

router = APIRouter()

SYSTEM_PROMPT = """You are Trace Assist, the investigation assistant for TraceVeritas.

You answer questions ONLY from the structured investigation context supplied by the TraceVeritas backend.

The structured context comes from the live Neo4j graph.

Never invent:
* entities
* relationships
* counts
* dates
* contamination status
* recall status
* simulation results

If the supplied context does not contain enough information to answer, say so.

Do not claim an action occurred unless the live Neo4j context confirms it.

Do not provide generic supply-chain facts when the user is asking about the current investigation.

Explain graph relationships clearly and concisely.

Prefer concise operational answers over generic prose."""

DOWNSTREAM_CYPHER = """
MATCH (b:Batch {id: $batch_id})
OPTIONAL MATCH (b)-[:DELIVERED_TO]->(k:Kitchen)
OPTIONAL MATCH (k)-[:USED_IN]->(d:Dish)
OPTIONAL MATCH (d)<-[:ORDERED_AS]-(o:Order)
OPTIONAL MATCH (o)-[:PLACED_BY]->(c:Customer)
RETURN b, k, d, o, c
"""

@router.post("/api/assistant/chat", response_model=TraceAssistResponse)
def trace_assist_chat(request: TraceAssistRequest):
    driver = get_driver()
    if not driver:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
        
    e_type = request.entity_type.strip()
    e_id = request.entity_id.strip()
    
    context = {
        "investigation_type": e_type,
        "investigation_id": e_id,
        "root_cause_path": [],
        "impact_counts": {},
        "recall": {},
        "simulation": None
    }
    
    with driver.session(database=settings.neo4j_database) as session:
        batch_id = None
        
        # 1. Reverse Trace Context
        if e_type in ["Order", "Customer"]:
            cypher = TRACE_ORDER_CYPHER if e_type == "Order" else TRACE_CUSTOMER_CYPHER
            result = session.run(cypher, entity_id=e_id)
            records = list(result)
            if records:
                record = records[0]
                b_node = record.get("b")
                
                path_labels = []
                if record.get("c"): path_labels.append(f"Customer {record['c']['id']}")
                if record.get("o"): path_labels.append(f"Order {record['o']['id']}")
                if record.get("d"): path_labels.append(f"Dish {record['d']['id']}")
                if record.get("k"): path_labels.append(f"Kitchen {record['k']['id']}")
                if b_node: 
                    path_labels.append(f"Batch {b_node['id']}")
                    batch_id = b_node["id"]
                if record.get("s"): path_labels.append(f"Supplier {record['s']['id']}")
                
                context["root_cause_path"] = path_labels
                
        elif e_type == "Batch":
            batch_id = e_id
            
        # 2. Downstream Context & Recall
        if batch_id:
            batch_result = session.run("MATCH (b:Batch {id: $b_id}) RETURN b", b_id=batch_id).single()
            if batch_result:
                b_status = batch_result["b"].get("status")
                context["recall"] = {
                    "status": b_status,
                    "verified_from_live_graph": True
                }
            
            downstream = list(session.run(DOWNSTREAM_CYPHER, batch_id=batch_id))
            if downstream:
                k_dict, d_dict, o_dict, c_dict = {}, {}, {}, {}
                for rec in downstream:
                    k, d, o, c = rec.get("k"), rec.get("d"), rec.get("o"), rec.get("c")
                    if k: k_dict[k["id"]] = k["id"]
                    if d: d_dict[d["id"]] = d["id"]
                    if o: o_dict[o["id"]] = o["id"]
                    if c: c_dict[c["id"]] = c["id"]
                
                context["impact_counts"] = {
                    "kitchens": len(k_dict),
                    "dishes": len(d_dict),
                    "orders": len(o_dict),
                    "customers": len(c_dict)
                }
                
        # 3. Simulation Context
        if batch_id and request.containment_kitchen_id:
            k_id = request.containment_kitchen_id.strip()
            check_cypher = "MATCH (b:Batch {id: $b_id})-[:DELIVERED_TO]->(k:Kitchen {id: $k_id}) RETURN b"
            if session.run(check_cypher, b_id=batch_id, k_id=k_id).single():
                remaining = extract_scope(list(session.run(SIMULATE_REMAINING_CYPHER, batch_id=batch_id, kitchen_id=k_id)))
                context["simulation"] = {
                    "containment_point": f"Kitchen {k_id}",
                    "remaining_impact_counts": {
                        "kitchens": remaining.counts.kitchens,
                        "dishes": remaining.counts.dishes,
                        "orders": remaining.counts.orders,
                        "customers": remaining.counts.customers
                    }
                }

    if not settings.gemini_api_key:
        return TraceAssistResponse(answer="Trace Assist is temporarily unavailable. The live investigation graph remains available.")
        
    try:
        client = genai.Client(api_key=settings.gemini_api_key)
        contents = f"CONTEXT:\n{json.dumps(context, indent=2)}\n\nUSER QUESTION:\n{request.question}"
        
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.2
            )
        )
        return TraceAssistResponse(answer=response.text.strip())
    except Exception as e:
        print(f"Gemini error: {e}")
        return TraceAssistResponse(answer="Trace Assist is temporarily unavailable. The live investigation graph remains available.")

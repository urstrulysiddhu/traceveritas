from pydantic import BaseModel
from typing import List, Optional

class InvestigationRequest(BaseModel):
    batch_id: str

class BatchSummary(BaseModel):
    id: str
    ingredient: str
    quantity: int
    received_date: str
    expiry_date: str
    status: str

class AffectedKitchen(BaseModel):
    id: str
    name: str
    city: str
    location: str
    status: str

class AffectedDish(BaseModel):
    id: str
    name: str
    category: str
    price: int
    status: str

class AffectedOrder(BaseModel):
    id: str
    timestamp: str
    status: str

class AffectedCustomer(BaseModel):
    id: str
    name: str
    city: str

class ImpactSummary(BaseModel):
    kitchens: int
    dishes: int
    orders: int
    customers: int

class InvestigationResponse(BaseModel):
    success: bool
    investigation_type: str
    entity_id: str
    batch: Optional[BatchSummary] = None
    kitchens: List[AffectedKitchen]
    dishes: List[AffectedDish]
    orders: List[AffectedOrder]
    customers: List[AffectedCustomer]
    impact: ImpactSummary
    cypher: str
    parameters: dict

class RecallRequest(BaseModel):
    batch_id: str

class RecallResponse(BaseModel):
    success: bool
    batch: BatchSummary
    cypher: str
    parameters: dict

class TraceOriginRequest(BaseModel):
    entity_type: str
    entity_id: str

class SupplierSummary(BaseModel):
    id: str
    name: str
    location: str

class TracePathNode(BaseModel):
    label: str
    id: str
    name: Optional[str] = None

class TraceOriginResponse(BaseModel):
    success: bool
    source_entity_type: str
    source_entity_id: str
    path: List[TracePathNode]
    supplier: Optional[SupplierSummary] = None
    batch: Optional[BatchSummary] = None
    kitchen: Optional[AffectedKitchen] = None
    dish: Optional[AffectedDish] = None
    order: Optional[AffectedOrder] = None
    customer: Optional[AffectedCustomer] = None
    cypher: str
    parameters: dict

class SimulateContainmentRequest(BaseModel):
    batch_id: str
    kitchen_id: str

class SimulationScope(BaseModel):
    kitchens: List[AffectedKitchen]
    dishes: List[AffectedDish]
    orders: List[AffectedOrder]
    customers: List[AffectedCustomer]
    counts: ImpactSummary

class TraceAssistRequest(BaseModel):
    question: str
    entity_type: str
    entity_id: str
    containment_kitchen_id: Optional[str] = None

class SimulateContainmentResponse(BaseModel):
    success: bool
    batch_id: str
    containment_kitchen_id: str
    remaining: SimulationScope
    contained: SimulationScope
    cypher: str
    parameters: dict

class TraceAssistRequest(BaseModel):
    question: str
    entity_type: str
    entity_id: str
    containment_kitchen_id: Optional[str] = None

class TraceAssistResponse(BaseModel):
    answer: str

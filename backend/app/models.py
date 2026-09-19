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

export interface InvestigationRequest {
  batch_id: string;
}

export interface BatchSummary {
  id: string;
  ingredient: string;
  quantity: number;
  received_date: string;
  expiry_date: string;
  status: string;
}

export interface AffectedKitchen {
  id: string;
  name: string;
  city: string;
  location: string;
  status: string;
}

export interface AffectedDish {
  id: string;
  name: string;
  category: string;
  price: number;
  status: string;
}

export interface AffectedOrder {
  id: string;
  timestamp: string;
  status: string;
}

export interface AffectedCustomer {
  id: string;
  name: string;
  city: string;
}

export interface ImpactSummary {
  kitchens: number;
  dishes: number;
  orders: number;
  customers: number;
}

export interface InvestigationResponse {
  success: boolean;
  investigation_type: string;
  entity_id: string;
  batch?: BatchSummary;
  kitchens: AffectedKitchen[];
  dishes: AffectedDish[];
  orders: AffectedOrder[];
  customers: AffectedCustomer[];
  impact: ImpactSummary;
  cypher: string;
  parameters: Record<string, any>;
}

export interface RecallRequest {
  batch_id: string;
}

export interface RecallResponse {
  success: boolean;
  batch: BatchSummary;
  cypher: string;
  parameters: Record<string, any>;
}

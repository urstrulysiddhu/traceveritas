// ============================================================
// TRACEVERITAS - NEO4J SCHEMA
// ============================================================
// Purpose: Defines uniqueness constraints and ensures data 
// integrity for the core TraceVeritas entities. 
// Uses Neo4j 5 / Aura compatible idempotent syntax.
// ============================================================

// ------------------------------------------------------------
// Supplier
// ------------------------------------------------------------
// Ensures every Supplier has a unique 'id' identifier.
CREATE CONSTRAINT supplier_id_unique IF NOT EXISTS 
FOR (s:Supplier) REQUIRE s.id IS UNIQUE;

// ------------------------------------------------------------
// Batch
// ------------------------------------------------------------
// Ensures every Batch has a unique 'id' identifier.
CREATE CONSTRAINT batch_id_unique IF NOT EXISTS 
FOR (b:Batch) REQUIRE b.id IS UNIQUE;

// ------------------------------------------------------------
// Kitchen
// ------------------------------------------------------------
// Ensures every Kitchen has a unique 'id' identifier.
CREATE CONSTRAINT kitchen_id_unique IF NOT EXISTS 
FOR (k:Kitchen) REQUIRE k.id IS UNIQUE;

// ------------------------------------------------------------
// Dish
// ------------------------------------------------------------
// Ensures every Dish has a unique 'id' identifier.
CREATE CONSTRAINT dish_id_unique IF NOT EXISTS 
FOR (d:Dish) REQUIRE d.id IS UNIQUE;

// ------------------------------------------------------------
// Order
// ------------------------------------------------------------
// Ensures every Order has a unique 'id' identifier.
CREATE CONSTRAINT order_id_unique IF NOT EXISTS 
FOR (o:Order) REQUIRE o.id IS UNIQUE;

// ------------------------------------------------------------
// Customer
// ------------------------------------------------------------
// Ensures every Customer has a unique 'id' identifier.
CREATE CONSTRAINT customer_id_unique IF NOT EXISTS 
FOR (c:Customer) REQUIRE c.id IS UNIQUE;

// ============================================================
// TRACEVERITAS - DEMO SEED DATA
// ============================================================
// Deterministic graph dataset for recall simulation and
// impact analysis scenarios. Safe to run multiple times.
// ============================================================

// ------------------------------------------------------------
// 1. Suppliers (3)
// ------------------------------------------------------------
MERGE (s1:Supplier {id: 'S001'}) ON CREATE SET s1.name = 'FreshFarm Organics', s1.location = 'Haryana', s1.certification = 'FSSAI-A', s1.status = 'ACTIVE';
MERGE (s2:Supplier {id: 'S002'}) ON CREATE SET s2.name = 'Delhi Dairy Co.', s2.location = 'Delhi', s2.certification = 'FSSAI-B', s2.status = 'ACTIVE';
MERGE (s3:Supplier {id: 'S003'}) ON CREATE SET s3.name = 'Noida Greens', s3.location = 'UP', s3.certification = 'FSSAI-A', s3.status = 'ACTIVE';

// ------------------------------------------------------------
// 2. Batches (6)
// ------------------------------------------------------------
MERGE (b1:Batch {id: 'B001'}) ON CREATE SET b1.ingredient = 'Organic Tomatoes', b1.quantity = 500, b1.received_date = '2026-09-01', b1.expiry_date = '2026-09-15', b1.status = 'SAFE';
MERGE (b2:Batch {id: 'B002'}) ON CREATE SET b2.ingredient = 'Paneer Block', b2.quantity = 200, b2.received_date = '2026-09-05', b2.expiry_date = '2026-09-12', b2.status = 'SAFE';
MERGE (b3:Batch {id: 'B003'}) ON CREATE SET b3.ingredient = 'Wheat Flour', b3.quantity = 1000, b3.received_date = '2026-08-25', b3.expiry_date = '2026-11-25', b3.status = 'SAFE';
MERGE (b4:Batch {id: 'B004'}) ON CREATE SET b4.ingredient = 'Full Cream Milk', b4.quantity = 300, b4.received_date = '2026-09-06', b4.expiry_date = '2026-09-14', b4.status = 'SAFE';
MERGE (b5:Batch {id: 'B005'}) ON CREATE SET b5.ingredient = 'Butter', b5.quantity = 150, b5.received_date = '2026-09-01', b5.expiry_date = '2026-10-01', b5.status = 'SAFE';
MERGE (b6:Batch {id: 'B006'}) ON CREATE SET b6.ingredient = 'Spinach', b6.quantity = 100, b6.received_date = '2026-09-07', b6.expiry_date = '2026-09-17', b6.status = 'SAFE';

// ------------------------------------------------------------
// 3. Kitchens (4)
// ------------------------------------------------------------
MERGE (k1:Kitchen {id: 'K01'}) ON CREATE SET k1.name = 'Gurugram Central Kitchen', k1.city = 'Gurugram', k1.location = 'Cyber Hub', k1.status = 'ACTIVE';
MERGE (k2:Kitchen {id: 'K02'}) ON CREATE SET k2.name = 'South Delhi Hub', k2.city = 'Delhi', k2.location = 'Saket', k2.status = 'ACTIVE';
MERGE (k3:Kitchen {id: 'K03'}) ON CREATE SET k3.name = 'Noida Extension Kitchen', k3.city = 'Noida', k3.location = 'Sector 62', k3.status = 'ACTIVE';
MERGE (k4:Kitchen {id: 'K04'}) ON CREATE SET k4.name = 'Vasant Kunj Cloud', k4.city = 'Delhi', k4.location = 'Vasant Kunj', k4.status = 'ACTIVE';

// ------------------------------------------------------------
// 4. Dishes (8)
// ------------------------------------------------------------
MERGE (d1:Dish {id: 'D01'}) ON CREATE SET d1.name = 'Tomato Soup', d1.category = 'Starter', d1.price = 150, d1.status = 'AVAILABLE';
MERGE (d2:Dish {id: 'D02'}) ON CREATE SET d2.name = 'Margherita Pizza', d2.category = 'Main', d2.price = 400, d2.status = 'AVAILABLE';
MERGE (d3:Dish {id: 'D03'}) ON CREATE SET d3.name = 'Paneer Tikka', d3.category = 'Starter', d3.price = 250, d3.status = 'AVAILABLE';
MERGE (d4:Dish {id: 'D04'}) ON CREATE SET d4.name = 'Kadai Paneer', d4.category = 'Main', d4.price = 350, d4.status = 'AVAILABLE';
MERGE (d5:Dish {id: 'D05'}) ON CREATE SET d5.name = 'Paneer Butter Masala', d5.category = 'Main', d5.price = 380, d5.status = 'AVAILABLE';
MERGE (d6:Dish {id: 'D06'}) ON CREATE SET d6.name = 'Tandoori Roti', d6.category = 'Bread', d6.price = 40, d6.status = 'AVAILABLE';
MERGE (d7:Dish {id: 'D07'}) ON CREATE SET d7.name = 'Dal Makhani', d7.category = 'Main', d7.price = 280, d7.status = 'AVAILABLE';
MERGE (d8:Dish {id: 'D08'}) ON CREATE SET d8.name = 'Palak Paneer', d8.category = 'Main', d8.price = 320, d8.status = 'AVAILABLE';

// ------------------------------------------------------------
// 5. Customers (10)
// ------------------------------------------------------------
MERGE (c1:Customer {id: 'C01'}) ON CREATE SET c1.name = 'Rahul Sharma', c1.city = 'Gurugram';
MERGE (c2:Customer {id: 'C02'}) ON CREATE SET c2.name = 'Priya Singh', c2.city = 'Delhi';
MERGE (c3:Customer {id: 'C03'}) ON CREATE SET c3.name = 'Amit Kumar', c3.city = 'Noida';
MERGE (c4:Customer {id: 'C04'}) ON CREATE SET c4.name = 'Neha Gupta', c4.city = 'Gurugram';
MERGE (c5:Customer {id: 'C05'}) ON CREATE SET c5.name = 'Vikram Malhotra', c5.city = 'Delhi';
MERGE (c6:Customer {id: 'C06'}) ON CREATE SET c6.name = 'Sanya Verma', c6.city = 'Noida';
MERGE (c7:Customer {id: 'C07'}) ON CREATE SET c7.name = 'Arjun Das', c7.city = 'Delhi';
MERGE (c8:Customer {id: 'C08'}) ON CREATE SET c8.name = 'Kavita Reddy', c8.city = 'Gurugram';
MERGE (c9:Customer {id: 'C09'}) ON CREATE SET c9.name = 'Rohan Mehta', c9.city = 'Delhi';
MERGE (c10:Customer {id: 'C10'}) ON CREATE SET c10.name = 'Aditi Rao', c10.city = 'Noida';

// ------------------------------------------------------------
// 6. Orders (12)
// ------------------------------------------------------------
MERGE (o1:Order {id: 'O01'}) ON CREATE SET o1.timestamp = '2026-09-10T12:30:00Z', o1.status = 'COMPLETED';
MERGE (o2:Order {id: 'O02'}) ON CREATE SET o2.timestamp = '2026-09-10T13:15:00Z', o2.status = 'COMPLETED';
MERGE (o3:Order {id: 'O03'}) ON CREATE SET o3.timestamp = '2026-09-10T14:00:00Z', o3.status = 'COMPLETED';
MERGE (o4:Order {id: 'O04'}) ON CREATE SET o4.timestamp = '2026-09-10T14:45:00Z', o4.status = 'COMPLETED';
MERGE (o5:Order {id: 'O05'}) ON CREATE SET o5.timestamp = '2026-09-10T18:30:00Z', o5.status = 'COMPLETED';
MERGE (o6:Order {id: 'O06'}) ON CREATE SET o6.timestamp = '2026-09-10T19:00:00Z', o6.status = 'COMPLETED';
MERGE (o7:Order {id: 'O07'}) ON CREATE SET o7.timestamp = '2026-09-10T19:30:00Z', o7.status = 'COMPLETED';
MERGE (o8:Order {id: 'O08'}) ON CREATE SET o8.timestamp = '2026-09-10T20:15:00Z', o8.status = 'COMPLETED';
MERGE (o9:Order {id: 'O09'}) ON CREATE SET o9.timestamp = '2026-09-10T20:45:00Z', o9.status = 'COMPLETED';
MERGE (o10:Order {id: 'O10'}) ON CREATE SET o10.timestamp = '2026-09-10T21:00:00Z', o10.status = 'COMPLETED';
MERGE (o11:Order {id: 'O11'}) ON CREATE SET o11.timestamp = '2026-09-10T21:30:00Z', o11.status = 'COMPLETED';
MERGE (o12:Order {id: 'O12'}) ON CREATE SET o12.timestamp = '2026-09-10T22:00:00Z', o12.status = 'COMPLETED';

// ------------------------------------------------------------
// 7. Relationships
// ------------------------------------------------------------
// SUPPLIES: (Supplier)-[:SUPPLIES]->(Batch)
MATCH (s1:Supplier {id: 'S001'}), (b1:Batch {id: 'B001'}) MERGE (s1)-[:SUPPLIES]->(b1);
MATCH (s1:Supplier {id: 'S001'}), (b2:Batch {id: 'B002'}) MERGE (s1)-[:SUPPLIES]->(b2);
MATCH (s1:Supplier {id: 'S001'}), (b3:Batch {id: 'B003'}) MERGE (s1)-[:SUPPLIES]->(b3);
MATCH (s2:Supplier {id: 'S002'}), (b4:Batch {id: 'B004'}) MERGE (s2)-[:SUPPLIES]->(b4);
MATCH (s2:Supplier {id: 'S002'}), (b5:Batch {id: 'B005'}) MERGE (s2)-[:SUPPLIES]->(b5);
MATCH (s3:Supplier {id: 'S003'}), (b6:Batch {id: 'B006'}) MERGE (s3)-[:SUPPLIES]->(b6);

// DELIVERED_TO: (Batch)-[:DELIVERED_TO]->(Kitchen)
MATCH (b1:Batch {id: 'B001'}), (k1:Kitchen {id: 'K01'}) MERGE (b1)-[:DELIVERED_TO]->(k1);
MATCH (b2:Batch {id: 'B002'}), (k1:Kitchen {id: 'K01'}) MERGE (b2)-[:DELIVERED_TO]->(k1);
MATCH (b2:Batch {id: 'B002'}), (k2:Kitchen {id: 'K02'}) MERGE (b2)-[:DELIVERED_TO]->(k2);
MATCH (b3:Batch {id: 'B003'}), (k3:Kitchen {id: 'K03'}) MERGE (b3)-[:DELIVERED_TO]->(k3);
MATCH (b4:Batch {id: 'B004'}), (k3:Kitchen {id: 'K03'}) MERGE (b4)-[:DELIVERED_TO]->(k3);
MATCH (b5:Batch {id: 'B005'}), (k4:Kitchen {id: 'K04'}) MERGE (b5)-[:DELIVERED_TO]->(k4);
MATCH (b6:Batch {id: 'B006'}), (k4:Kitchen {id: 'K04'}) MERGE (b6)-[:DELIVERED_TO]->(k4);

// USED_IN: (Kitchen)-[:USED_IN]->(Dish)
MATCH (k1:Kitchen {id: 'K01'}), (d1:Dish {id: 'D01'}) MERGE (k1)-[:USED_IN]->(d1);
MATCH (k1:Kitchen {id: 'K01'}), (d2:Dish {id: 'D02'}) MERGE (k1)-[:USED_IN]->(d2);
MATCH (k1:Kitchen {id: 'K01'}), (d3:Dish {id: 'D03'}) MERGE (k1)-[:USED_IN]->(d3);
MATCH (k2:Kitchen {id: 'K02'}), (d4:Dish {id: 'D04'}) MERGE (k2)-[:USED_IN]->(d4);
MATCH (k2:Kitchen {id: 'K02'}), (d5:Dish {id: 'D05'}) MERGE (k2)-[:USED_IN]->(d5);
MATCH (k3:Kitchen {id: 'K03'}), (d6:Dish {id: 'D06'}) MERGE (k3)-[:USED_IN]->(d6);
MATCH (k3:Kitchen {id: 'K03'}), (d7:Dish {id: 'D07'}) MERGE (k3)-[:USED_IN]->(d7);
MATCH (k4:Kitchen {id: 'K04'}), (d8:Dish {id: 'D08'}) MERGE (k4)-[:USED_IN]->(d8);

// ORDERED_AS: (Order)-[:ORDERED_AS]->(Dish)
MATCH (o1:Order {id: 'O01'}), (d1:Dish {id: 'D01'}) MERGE (o1)-[:ORDERED_AS]->(d1);
MATCH (o2:Order {id: 'O02'}), (d2:Dish {id: 'D02'}) MERGE (o2)-[:ORDERED_AS]->(d2);
MATCH (o3:Order {id: 'O03'}), (d3:Dish {id: 'D03'}) MERGE (o3)-[:ORDERED_AS]->(d3);
MATCH (o4:Order {id: 'O04'}), (d3:Dish {id: 'D03'}) MERGE (o4)-[:ORDERED_AS]->(d3);
MATCH (o5:Order {id: 'O05'}), (d4:Dish {id: 'D04'}) MERGE (o5)-[:ORDERED_AS]->(d4);
MATCH (o6:Order {id: 'O06'}), (d4:Dish {id: 'D04'}) MERGE (o6)-[:ORDERED_AS]->(d4);
MATCH (o7:Order {id: 'O07'}), (d5:Dish {id: 'D05'}) MERGE (o7)-[:ORDERED_AS]->(d5);
MATCH (o8:Order {id: 'O08'}), (d6:Dish {id: 'D06'}) MERGE (o8)-[:ORDERED_AS]->(d6);
MATCH (o9:Order {id: 'O09'}), (d7:Dish {id: 'D07'}) MERGE (o9)-[:ORDERED_AS]->(d7);
MATCH (o10:Order {id: 'O10'}), (d7:Dish {id: 'D07'}) MERGE (o10)-[:ORDERED_AS]->(d7);
MATCH (o11:Order {id: 'O11'}), (d8:Dish {id: 'D08'}) MERGE (o11)-[:ORDERED_AS]->(d8);
MATCH (o12:Order {id: 'O12'}), (d8:Dish {id: 'D08'}) MERGE (o12)-[:ORDERED_AS]->(d8);

// PLACED_BY: (Order)-[:PLACED_BY]->(Customer)
MATCH (o1:Order {id: 'O01'}), (c1:Customer {id: 'C01'}) MERGE (o1)-[:PLACED_BY]->(c1);
MATCH (o2:Order {id: 'O02'}), (c2:Customer {id: 'C02'}) MERGE (o2)-[:PLACED_BY]->(c2);
MATCH (o3:Order {id: 'O03'}), (c3:Customer {id: 'C03'}) MERGE (o3)-[:PLACED_BY]->(c3);
MATCH (o4:Order {id: 'O04'}), (c4:Customer {id: 'C04'}) MERGE (o4)-[:PLACED_BY]->(c4);
MATCH (o5:Order {id: 'O05'}), (c5:Customer {id: 'C05'}) MERGE (o5)-[:PLACED_BY]->(c5);
MATCH (o6:Order {id: 'O06'}), (c6:Customer {id: 'C06'}) MERGE (o6)-[:PLACED_BY]->(c6);
MATCH (o7:Order {id: 'O07'}), (c7:Customer {id: 'C07'}) MERGE (o7)-[:PLACED_BY]->(c7);
MATCH (o8:Order {id: 'O08'}), (c8:Customer {id: 'C08'}) MERGE (o8)-[:PLACED_BY]->(c8);
MATCH (o9:Order {id: 'O09'}), (c9:Customer {id: 'C09'}) MERGE (o9)-[:PLACED_BY]->(c9);
MATCH (o10:Order {id: 'O10'}), (c10:Customer {id: 'C10'}) MERGE (o10)-[:PLACED_BY]->(c10);
MATCH (o11:Order {id: 'O11'}), (c1:Customer {id: 'C01'}) MERGE (o11)-[:PLACED_BY]->(c1);
MATCH (o12:Order {id: 'O12'}), (c2:Customer {id: 'C02'}) MERGE (o12)-[:PLACED_BY]->(c2);

// ------------------------------------------------------------
// 8. Verification queries (Reference only)
// ------------------------------------------------------------
// // Total counts by label
// MATCH (n) RETURN labels(n) AS Label, count(n) AS Count;
//
// // Total relationship counts by type
// MATCH ()-[r]->() RETURN type(r) AS RelationshipType, count(r) AS Count;
//
// // B002 downstream impact
// MATCH (b:Batch {id: 'B002'})-[:DELIVERED_TO]->(k:Kitchen)-[:USED_IN]->(d:Dish)<-[:ORDERED_AS]-(o:Order)-[:PLACED_BY]->(c:Customer) 
// RETURN b, k, d, o, c;
//
// // S001 downstream batch count
// MATCH (s:Supplier {id: 'S001'})-[:SUPPLIES]->(b:Batch) 
// RETURN s.id AS Supplier, count(b) AS BatchCount;

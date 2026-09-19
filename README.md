# TraceVeritas

### Graph-Powered Food Safety Intelligence & Recall Command Center

> **TraceVeritas transforms food-safety incident response from database lookup into graph-powered investigation, impact analysis, containment simulation, targeted recall, and live verification.**

---

## 1. Overview

Cloud kitchens operate through interconnected supply chains involving suppliers, ingredient batches, kitchens, dishes, orders, and customers.

When an ingredient batch becomes contaminated, a conventional relational lookup can make it difficult to answer the most important operational questions quickly:

* Which kitchens received the batch?
* Which dishes used it?
* Which orders are affected?
* Which customers may have been exposed?
* Where did the affected order originate?
* What happens if containment is applied at one kitchen?
* Has the recall actually changed the live system state?

**TraceVeritas** uses **Neo4j graph traversal** to model these relationships as a connected supply-chain graph.

It provides a unified operational workflow:

> **Investigate → Trace → Analyze → Simulate → Decide → Recall → Verify**

---

## 2. Core Problem

The system models the supply chain as:

```text
Supplier
   ↓
Batch
   ↓
Kitchen
   ↓
Dish
   ↓
Order
   ↓
Customer
```

Using graph relationships:

```text
(Supplier)-[:SUPPLIES]->(Batch)
(Batch)-[:DELIVERED_TO]->(Kitchen)
(Kitchen)-[:USED_IN]->(Dish)
(Dish)<-[:ORDERED_AS]-(Order)
(Order)-[:PLACED_BY]->(Customer)
```

This allows TraceVeritas to traverse the entire downstream impact of a contaminated batch and also perform reverse root-cause tracing.

---

# 3. Key Capabilities

## 3.1 Live Incident Investigation

Select an entity and investigate its connected supply-chain impact.

Example:

```text
Batch: B002
```

TraceVeritas queries the live Neo4j database and dynamically calculates:

```text
2 Kitchens
5 Dishes
7 Orders
7 Customers
```

No impact numbers are hardcoded into the frontend.

---

## 3.2 Graph-Based Blast Radius

The central React Flow visualization exposes the causal chain:

```text
Supplier → Batch → Kitchen → Dish → Order → Customer
```

The graph is dynamically generated from Neo4j query results.

Different entity types receive distinct visual semantics:

| Entity   | Visual Role                    |
| -------- | ------------------------------ |
| Supplier | Source                         |
| Batch    | Incident / contamination point |
| Kitchen  | Operational node               |
| Dish     | Product                        |
| Order    | Transaction                    |
| Customer | Exposure endpoint              |

This makes the graph a visual representation of the incident's blast radius.

---

## 3.3 Reverse Trace / Root-Cause Analysis

TraceVeritas can investigate an individual Order or Customer backwards through the graph.

Example:

```text
O07
 ↓
D05
 ↓
K02
 ↓
B002
 ↓
S001
```

This answers questions such as:

> Why is order O07 affected?

and:

> Which supplier and batch are upstream of this order?

This demonstrates the bidirectional value of the graph:

```text
DOWNSTREAM
Batch → Kitchen → Dish → Order → Customer

UPSTREAM
Order → Dish → Kitchen → Batch → Supplier
```

---

# 4. Counterfactual Containment Simulation

TraceVeritas allows operators to simulate containment at a selected kitchen without modifying the database.

Example:

```text
Batch: B002
Containment: K01
```

The system compares:

```text
LIVE IMPACT
vs.
SIMULATED REMAINING IMPACT
```

For the seeded B002 scenario:

```text
LIVE

2 Kitchens
5 Dishes
7 Orders
7 Customers
```

After simulated containment at K01:

```text
SIMULATED REMAINING

1 Kitchen
2 Dishes
3 Orders
3 Customers
```

The simulation is explicitly **read-only**.

No Neo4j mutation occurs during simulation.

---

# 5. Targeted Recall

Once an operator decides to recall a contaminated batch, TraceVeritas executes a real Neo4j mutation.

The batch status changes to:

```text
CONTAMINATED
```

The application then performs a fresh investigation against Neo4j rather than assuming the mutation succeeded.

---

# 6. Live Recall Verification

TraceVeritas follows:

```text
READY TO EXECUTE RECALL
        ↓
EXECUTING RECALL
        ↓
VERIFYING LIVE GRAPH
        ↓
✓ RECALL VERIFIED
```

The final state is only displayed after the application confirms the updated state from the live Neo4j graph.

This prevents the UI from presenting a false success state.

---

# 7. Trace Assist

Trace Assist is a graph-grounded operational assistant powered by **Google Gemini**.

It is not a collection of hardcoded responses.

The architecture is:

```text
User Question
      ↓
FastAPI
      ↓
Fresh Neo4j Context
      ↓
Structured Investigation Context
      ↓
Gemini
      ↓
Grounded Operational Answer
      ↓
Trace Assist UI
```

Example:

```text
User:
Who is affected?

Trace Assist:
[Gemini-generated answer grounded in the current
Neo4j investigation context]

SOURCE: LIVE NEO4J GRAPH
```

Trace Assist dynamically receives the current investigation context.

Changing from:

```text
B002
```

to:

```text
B001
```

changes the graph context supplied to Gemini.

The assistant therefore does not rely on a static answer set.

---

## 7.1 Supported Investigation Context

Trace Assist can work with:

* Batch investigations
* Order reverse traces
* Customer investigations
* Containment simulations
* Current recall status

The backend re-queries Neo4j when necessary so that recall status is based on the current database state.

---

## 7.2 Voice Interaction

Trace Assist supports browser-native:

* Speech Recognition where supported
* Speech Synthesis / Read Aloud

This allows an operator to ask questions and have analytical responses read aloud.

---

# 8. Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
│                                                         │
│ Investigation Console                                  │
│ Impact Summary                                          │
│ React Flow Graph                                        │
│ Reverse Trace                                           │
│ Containment Simulation                                  │
│ Recall / Verification                                   │
│ Trace Assist                                            │
└─────────────────────────┬───────────────────────────────┘
                          │
                          │ REST API
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Backend                      │
│                                                         │
│ Investigation Routes                                    │
│ Reverse Trace Routes                                    │
│ Simulation Routes                                       │
│ Recall Routes                                           │
│ Trace Assist / Gemini Route                             │
└───────────────┬──────────────────────┬──────────────────┘
                │                      │
                │ Cypher               │ Gemini API
                ↓                      ↓
┌──────────────────────────┐   ┌────────────────────────┐
│        Neo4j             │   │     Google Gemini      │
│                          │   │                        │
│ Supplier                 │   │ Graph-grounded         │
│ Batch                    │   │ operational reasoning  │
│ Kitchen                  │   │                        │
│ Dish                     │   └────────────────────────┘
│ Order                    │
│ Customer                 │
└──────────────────────────┘
```

---

# 9. Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Flow
* Lucide React

## Backend

* Python
* FastAPI
* Uvicorn
* Pydantic
* Neo4j Python Driver
* Google GenAI SDK

## Database

* Neo4j

## AI

* Google Gemini
* Configurable through `GEMINI_MODEL`

---

# 10. Project Structure

```text
traceveritas/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   │
│   │   └── routes/
│   │       ├── investigation.py
│   │       └── assistant.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── investigation.ts
│   │   │   ├── assist.ts
│   │   │   ├── simulation.ts
│   │   │   └── trace.ts
│   │   │
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── InvestigationConsole.tsx
│   │   │   ├── ImpactGraph.tsx
│   │   │   ├── ImpactSummary.tsx
│   │   │   ├── ReverseTracePath.tsx
│   │   │   ├── RecallSimulator.tsx
│   │   │   ├── TraceAssist.tsx
│   │   │   ├── ViewCypher.tsx
│   │   │   └── BackgroundAnimation.tsx
│   │   │
│   │   ├── App.tsx
│   │   └── index.css
│   │
│   └── package.json
│
├── cypher/
│   ├── schema.cypher
│   └── seed.cypher
│
└── README.md
```

---

# 11. Graph Schema

The Neo4j graph contains six core node types:

```text
Supplier
Batch
Kitchen
Dish
Order
Customer
```

And five relationship types:

```text
SUPPLIES
DELIVERED_TO
USED_IN
ORDERED_AS
PLACED_BY
```

The database uses uniqueness constraints for stable entity identifiers.

---

# 12. Seeded Demo Dataset

The demonstration graph contains:

```text
3 Suppliers
6 Batches
4 Kitchens
8 Dishes
12 Orders
10 Customers
```

Relationships:

```text
6 SUPPLIES
7 DELIVERED_TO
8 USED_IN
12 ORDERED_AS
12 PLACED_BY
```

### B002 Demonstration Scenario

B002 is connected to:

```text
2 Kitchens
5 Dishes
7 Orders
7 Customers
```

This makes B002 the primary demonstration scenario for the incident-response workflow.

---

# 13. API Overview

## Investigation

```http
POST /api/investigate/batch
```

Example:

```json
{
  "batch_id": "B002"
}
```

---

## Reverse Trace

```http
POST /api/trace/origin
```

Supports upstream tracing for entities such as:

```text
Order
Customer
```

---

## Containment Simulation

```http
POST /api/simulate/containment
```

Example:

```json
{
  "batch_id": "B002",
  "kitchen_id": "K01"
}
```

Simulation is read-only.

---

## Recall

```http
POST /api/recall/batch
```

Example:

```json
{
  "batch_id": "B002"
}
```

---

## Trace Assist

```http
POST /api/assistant/chat
```

Example:

```json
{
  "question": "Who is affected?",
  "entity_type": "Batch",
  "entity_id": "B002"
}
```

---

## Health

```http
GET /health
```

---

# 14. Local Setup

## Prerequisites

Install:

* Node.js
* npm
* Python 3
* Neo4j
* Git

---

## Backend Setup

From the repository root:

```powershell
cd C:\Users\hp\traceveritas
```

Create/activate a Python environment if desired, then install dependencies:

```powershell
pip install -r backend/requirements.txt
```

Create:

```text
backend/.env
```

based on:

```text
backend/.env.example
```

Configure:

```env
NEO4J_URI=your_neo4j_uri
NEO4J_USERNAME=your_username
NEO4J_PASSWORD=your_password

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

**Never commit `backend/.env` to Git.**

---

## Start Backend

From the repository root:

```powershell
python -m uvicorn app.main:app --reload --app-dir backend
```

Backend:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/health
```

---

# 15. Neo4j Setup

Run the schema from:

```text
cypher/schema.cypher
```

Then load the deterministic demonstration dataset from:

```text
cypher/seed.cypher
```

The schema uses idempotent constraints, allowing the setup to be safely re-run.

---

# 16. Frontend Setup

Open another terminal:

```powershell
cd C:\Users\hp\traceveritas\frontend
```

Install dependencies:

```powershell
npm install
```

Start development server:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 17. Recommended Demo Flow

The intended demonstration sequence is:

### 1. Investigate

```text
B002
```

Show the live supply-chain graph.

---

### 2. Explain the blast radius

Show:

```text
2 Kitchens
5 Dishes
7 Orders
7 Customers
```

---

### 3. Ask Trace Assist

Ask:

> Who is affected?

Demonstrate that the answer is grounded in the live investigation.

---

### 4. Reverse Trace

Investigate:

```text
O07
```

Show:

```text
O07 → D05 → K02 → B002 → S001
```

Explain that the graph can trace both downstream impact and upstream origin.

---

### 5. Simulate Containment

Select:

```text
B002
K01
```

Compare:

```text
LIVE IMPACT
vs.
SIMULATED REMAINING
```

Explain that simulation does not mutate the database.

---

### 6. Execute Recall

Apply recall to:

```text
B002
```

---

### 7. Verify

Show:

```text
✓ RECALL VERIFIED
CONTAMINATED
VERIFIED FROM LIVE NEO4J GRAPH
```

This completes:

> **Investigate → Trace → Analyze → Simulate → Decide → Recall → Verify**

---

# 18. Security Notes

Sensitive credentials must remain server-side.

Never commit:

```text
backend/.env
```

Gemini API keys must never be exposed in the React frontend.

Neo4j credentials must never be hardcoded into frontend source files.

The repository should contain only:

```text
backend/.env.example
```

with placeholder values.

---

# 19. Design Philosophy

TraceVeritas uses a restrained enterprise visual language.

Primary design principles:

* information hierarchy over decoration
* graph-first investigation
* warm neutral canvas
* restrained maroon identity
* semantic colors
* high information density
* clear operational states
* minimal unnecessary UI
* accessibility-conscious interaction
* no fake AI affordances

The system is designed to feel like a real food-safety operations console rather than a generic AI dashboard.

---

# 20. Why Neo4j?

The central value of TraceVeritas comes from connected traversal.

A contaminated batch is not merely a database row.

It is connected to:

```text
Supplier
   ↓
Batch
   ↓
Kitchen
   ↓
Dish
   ↓
Order
   ↓
Customer
```

Neo4j allows TraceVeritas to traverse those relationships naturally and answer both:

```text
"What does this contamination affect?"
```

and:

```text
"Where did this affected order originate?"
```

The graph therefore becomes the operational model of the incident rather than simply another visualization.

---

# 21. Project Differentiation

TraceVeritas goes beyond static contamination lookup.

Its workflow combines:

```text
LIVE GRAPH INVESTIGATION
        +
BLAST-RADIUS ANALYSIS
        +
REVERSE ROOT-CAUSE TRACE
        +
COUNTERFACTUAL SIMULATION
        +
TARGETED RECALL
        +
LIVE VERIFICATION
        +
GRAPH-GROUNDED GEMINI ASSISTANCE
```

This creates a complete incident-response loop rather than a passive graph viewer.

---

# 22. Validation

The system has been validated across the core workflow:

* Live Neo4j investigation
* Dynamic batch impact
* Reverse tracing
* Counterfactual containment
* Recall mutation
* Fresh recall verification
* Gemini-grounded Trace Assist
* Read Aloud
* Voice Input where supported
* Frontend production build

Frontend build:

```text
npm run build
```

passes successfully.

---

# 23. Repository

GitHub:

https://github.com/urstrulysiddhu/traceveritas

Current development branch:

```text
main
```

---

# 24. Status

**TraceVeritas is a functional graph-powered food safety intelligence prototype demonstrating an end-to-end incident response workflow from investigation through verified recall.**

```text
INVESTIGATE
     ↓
TRACE
     ↓
ANALYZE
     ↓
SIMULATE
     ↓
DECIDE
     ↓
RECALL
     ↓
VERIFY
```

---

## Built for the Neo4j Logistics & Supply Chain Transparency Challenge

**TraceVeritas — Turn supply-chain uncertainty into traceable action.**

# TraceVeritas

### Graph-Powered Food Safety Intelligence & Recall Command Center

> **TraceVeritas turns food-safety incident response into a connected workflow: investigate, trace, simulate, recall, and verify.**

When a contaminated ingredient batch enters a food supply chain, the difficult question is not simply *which database records contain that batch?*

Operators need to know:

* Which kitchens received it?
* Which dishes used it?
* Which orders are affected?
* Which customers may have been exposed?
* Where did an affected order originate?
* What would happen if a kitchen were contained?
* Did the recall actually change the live system?

TraceVeritas uses **Neo4j graph traversal** to model these relationships and provide a unified incident-response workflow.

```text
Investigate → Trace → Analyze → Simulate → Recall → Verify
```

---

## The Problem

Cloud-kitchen supply chains are highly connected:

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

A contaminated batch can therefore create a chain of downstream impact.

TraceVeritas models these relationships directly in Neo4j:

```text
(Supplier)-[:SUPPLIES]->(Batch)
(Batch)-[:DELIVERED_TO]->(Kitchen)
(Kitchen)-[:USED_IN]->(Dish)
(Dish)<-[:ORDERED_AS]-(Order)
(Order)-[:PLACED_BY]->(Customer)
```

This allows the system to traverse the graph in both directions rather than treating each entity as an isolated database record.

---

# What TraceVeritas Does

## 1. Live Incident Investigation

An operator can select an affected batch and investigate its current downstream impact.

For example:

```text
Batch: B002

2 Kitchens
5 Dishes
7 Orders
7 Customers
```

These values are calculated from the **live Neo4j graph** rather than hardcoded into the frontend.

---

## 2. Graph-Based Blast Radius

The investigation console visualizes the connected impact using **React Flow**.

```text
Supplier → Batch → Kitchen → Dish → Order → Customer
```

The graph is generated from Neo4j query results, allowing the visualization to reflect the actual investigation rather than a static diagram.

---

## 3. Reverse Trace

The same graph can be traversed upstream.

For an affected order:

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

This allows an operator to answer:

> **Why is this order affected?**

and:

> **Which batch and supplier are upstream of it?**

The system therefore supports both:

```text
DOWNSTREAM
Batch → Kitchen → Dish → Order → Customer

UPSTREAM
Order → Dish → Kitchen → Batch → Supplier
```

---

# 4. Counterfactual Containment Simulation

Before changing the live system, an operator can simulate containment at a selected kitchen.

Example:

```text
Batch: B002
Containment: K01
```

TraceVeritas compares:

```text
LIVE IMPACT
      vs.
SIMULATED REMAINING IMPACT
```

For the demonstration scenario:

```text
LIVE
2 Kitchens
5 Dishes
7 Orders
7 Customers

SIMULATED AFTER K01 CONTAINMENT
1 Kitchen
2 Dishes
3 Orders
3 Customers
```

The simulation is **read-only**. No Neo4j mutation occurs during this step.

This gives operators a way to evaluate the effect of a containment decision before executing it.

---

# 5. Targeted Recall

Once a recall decision is made, TraceVeritas can perform a real Neo4j mutation.

For example:

```text
B002
   ↓
CONTAMINATED
```

The important part is what happens next.

The application does **not** simply assume the mutation succeeded.

It re-queries Neo4j and verifies the updated state.

---

# 6. Live Recall Verification

The recall workflow is:

```text
READY TO EXECUTE RECALL
          ↓
     EXECUTING RECALL
          ↓
   VERIFYING LIVE GRAPH
          ↓
      ✓ RECALL VERIFIED
```

The UI only displays the final verified state after confirming it against the live Neo4j database.

This was designed to prevent the interface from presenting a successful recall state based only on an optimistic frontend response.

---

# 7. Trace Assist

TraceVeritas also includes **Trace Assist**, a graph-grounded operational assistant powered by Google Gemini.

The assistant does not answer from a static set of predefined responses.

Instead:

```text
User Question
      ↓
FastAPI
      ↓
Fresh Neo4j Context
      ↓
Investigation Context
      ↓
Gemini
      ↓
Grounded Operational Answer
```

For example:

> **Who is affected?**

The backend supplies Gemini with the current investigation context from Neo4j, allowing the response to reflect the selected batch or entity.

Trace Assist can work with:

* Batch investigations
* Order reverse traces
* Customer investigations
* Containment simulations
* Current recall status

It also supports browser-native speech recognition and speech synthesis where available.

---

# Architecture

```text
┌──────────────────────────────────────────────────────┐
│                   React Frontend                     │
│                                                      │
│  Investigation Console                              │
│  Impact Graph                                       │
│  Reverse Trace                                      │
│  Containment Simulation                             │
│  Recall / Verification                              │
│  Trace Assist                                       │
└───────────────────────┬──────────────────────────────┘
                        │
                      REST
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                   FastAPI Backend                    │
│                                                      │
│  Investigation Routes                                │
│  Reverse Trace                                       │
│  Simulation                                          │
│  Recall                                              │
│  Trace Assist / Gemini                               │
└───────────────┬──────────────────────┬───────────────┘
                │                      │
             Cypher                Gemini API
                │                      │
                ▼                      ▼
       ┌────────────────┐      ┌─────────────────┐
       │     Neo4j      │      │  Google Gemini  │
       │                │      │                 │
       │ Supply Chain   │      │ Graph-grounded  │
       │ Graph          │      │ assistant       │
       └────────────────┘      └─────────────────┘
```

The frontend, API layer, graph database, and AI assistant are kept as separate components.

---

# Why Neo4j?

The central idea behind TraceVeritas is that a contaminated batch is not simply a row in a database.

It is a **connected event**.

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

Neo4j makes these relationships directly traversable.

That enables questions such as:

> **What does this contamination affect?**

and:

> **Where did this affected order originate?**

The graph therefore acts as the **operational model of the incident**, rather than simply being a visualization layer.

---

# Technology Stack

| Layer          | Technologies                                  |
| -------------- | --------------------------------------------- |
| Frontend       | React, TypeScript, Vite, Tailwind CSS         |
| Visualization  | React Flow, Lucide React                      |
| Backend        | Python, FastAPI, Uvicorn, Pydantic            |
| Graph Database | Neo4j                                         |
| Graph Queries  | Cypher                                        |
| AI             | Google Gemini, Google GenAI SDK               |
| Voice          | Browser Speech Recognition / Speech Synthesis |

---

# Demo Workflow

The intended demonstration follows a complete incident-response cycle:

### 1. Investigate

Select:

```text
B002
```

View its live supply-chain graph.

### 2. Analyze

Show the downstream blast radius:

```text
2 Kitchens
5 Dishes
7 Orders
7 Customers
```

### 3. Ask Trace Assist

Ask:

> **Who is affected?**

Demonstrate that the answer is grounded in the current graph context.

### 4. Reverse Trace

Investigate:

```text
O07
```

Trace:

```text
O07 → D05 → K02 → B002 → S001
```

### 5. Simulate

Simulate containment at:

```text
B002 + K01
```

Compare live impact with simulated remaining impact.

### 6. Recall

Execute the recall for:

```text
B002
```

### 7. Verify

Confirm:

```text
✓ RECALL VERIFIED
CONTAMINATED
VERIFIED FROM LIVE NEO4J GRAPH
```

This completes the full:

```text
INVESTIGATE
     ↓
TRACE
     ↓
ANALYZE
     ↓
SIMULATE
     ↓
RECALL
     ↓
VERIFY
```

---

# Validation

The core workflow has been validated across:

* Live Neo4j investigation
* Dynamic impact calculation
* Reverse tracing
* Counterfactual containment
* Recall mutation
* Fresh recall verification
* Gemini-grounded Trace Assist
* Voice input where supported
* Read Aloud
* Frontend production build

The frontend production build passes with:

```bash
npm run build
```

---

# Project Context

**TraceVeritas was built for the Neo4j Logistics & Supply Chain Transparency Challenge.**

The project explores how graph databases can be used not only for supply-chain visibility, but for **operational decision-making during an incident**.

The focus is deliberately beyond a static graph viewer:

```text
LIVE INVESTIGATION
        +
BLAST-RADIUS ANALYSIS
        +
REVERSE TRACE
        +
COUNTERFACTUAL SIMULATION
        +
TARGETED RECALL
        +
LIVE VERIFICATION
        +
GRAPH-GROUNDED AI
```

The result is a functional prototype that connects graph traversal, operational workflows, and grounded AI assistance in one interface.

---

## Status

**Functional graph-powered food-safety intelligence prototype.**

> **TraceVeritas — Turn supply-chain uncertainty into traceable action.**

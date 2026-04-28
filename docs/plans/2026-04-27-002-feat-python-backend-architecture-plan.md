---
title: feat: Python Backend Architecture and API Initialization
type: feat
status: completed
date: 2026-04-27
---

# feat: Python Backend Architecture and API Initialization

## Overview

Initialize the backend API and database layer for VibeBoard AI Agile using Python (FastAPI + SQLModel). This replaces the initially proposed Node.js backend because it is the fastest path from the current mocked UI to a real local API/data layer, OpenAPI-driven frontend type sync, and a Python runtime that can later host the AI Orchestrator work in Epic 3.

---

## Problem Frame

The project has established a strong UI prototype for the three-stage Vibe Ticket in `apps/vibeboard-ai-web`. However, the data is currently mocked. The next critical action is moving to a real database schema and providing the API endpoints and WebSocket channels needed to synchronize board state, populate `TicketDetail`, and stream agent timelines. This phase may expose preview-related metadata needed by the current UI, but it does not implement the local workspace preview runner itself.

Adopting Python for the backend provides the current delivery with first-class request validation, straightforward WebSocket support, and easy OpenAPI export so the React frontend can stay type-safe while the mocks are replaced. Python's agent/LLM ecosystem is a secondary advantage that becomes relevant once Epic 3 begins.

---

## Requirements Trace

- R1. Initialize monorepo structure with `apps/api` (from `next-actions.md`).
- R2. Design database schema representing Project, Ticket, AcceptanceCriterion, AgentRun, TimelineEvent, and the minimum persisted metadata needed for current `TicketDetail` reads (from `data-model.md`).
- R3. Provide Project create/read APIs plus Ticket create/read/update APIs to back the frontend Kanban and a first-pass `TicketDetail` contract.
- R4. Establish a Realtime Event Gateway (timeline-event ingest + WebSocket fan-out) for Agent Activity Timeline.
- R5. Seamlessly bridge the TypeScript frontend and Python backend via generated OpenAPI schema and TypeScript types.

---

## Scope Boundaries

- This plan covers scaffolding, database schema, basic REST APIs, and WebSocket infrastructure.
- This phase stops at board/detail read models, timeline transport, and local persistence. Preview runtime lifecycle management remains out of scope.
- **Explicit non-goal:** Implementing the actual AI Agent Orchestrator logic or LLM prompts (this is deferred to Epic 3).
- **Explicit non-goal:** Implementing the Workspace Preview runner process isolation (this will be a separate plan focused on the Preview Runtime Manager).

### Deferred to Follow-Up Work

- Implementing the AI Agent orchestration loop (Planner -> Coder -> Reviewer).
- Implementing the child-process/Docker manager for Live Workspace Previews.
- Adding persisted `PreviewSession`, `DiffReel`, or other preview-runtime tables before the preview manager plan owns them.

---

## Context & Research

### Relevant Code and Patterns

- `docs/technical/data-model.md`: Defines the entities and relationships needed.
- `docs/technical/architecture.md`: Defines the `API Server` and `Realtime event gateway` roles.

### Key Technical Decisions

- **Framework:** **FastAPI**. Rationale: Native async support, seamless WebSocket integration, and automatic OpenAPI generation let the current Vite/React prototype move off mocks with minimal translation layers.
- **ORM / Database:** **SQLModel** (built on SQLAlchemy & Pydantic) with **SQLite** (for MVP). Rationale: Reduces duplication between API validation schemas and database models. The MVP database will live in a repo-local, gitignored path so local state is easy to reset or back up while we validate the shape of the data.
- **Package Manager:** **uv**. Rationale: Modern, extremely fast Python package manager that handles virtual environments and dependencies cleanly inside a monorepo structure.
- **Frontend-Backend Sync:** **OpenAPI + `openapi-typescript`**. Rationale: Since the backend is Python and frontend is TS, we must retain end-to-end type safety. This phase will generate a single TypeScript types artifact from FastAPI's `openapi.json`; generated request hooks/clients are deferred until the REST contract stabilizes.

---

## Open Questions

### Resolved During Planning

- **Is Python acceptable for the backend?** Yes. FastAPI + SQLModel provide the quickest route from mocked UI flows to a real local API/data layer, and the Python ecosystem remains a useful follow-on benefit once AI orchestration work starts.

### Deferred to Implementation

- Exactly how `AgentRun` state transitions will be locked to prevent race conditions when multiple agents try to write timeline events concurrently.

---

## Output Structure

    apps/api/
    ├── pyproject.toml
    ├── uv.lock
    ├── .data/
    │   └── vibeboard.db
    ├── alembic.ini
    ├── alembic/
    │   └── versions/
    ├── src/
    │   ├── main.py
    │   ├── core/
    │   │   ├── config.py
    │   │   └── database.py
    │   ├── models/
    │   │   ├── project.py
    │   │   ├── ticket.py
    │   │   ├── agent.py
    │   │   └── timeline.py
    │   ├── api/
    │   │   ├── routes/
    │   │   │   ├── projects.py
    │   │   │   ├── tickets.py
    │   │   │   └── timeline_events.py
    │   │   └── websocket/
    │   │       └── timeline_ws.py

---

## Implementation Units

- U1. **Monorepo Setup & Python Scaffolding**

**Goal:** Establish the `apps/api` directory and basic FastAPI app, integrating it alongside the frontend.

**Requirements:** R1

**Dependencies:** None

**Files:**
- Create: `pnpm-workspace.yaml` (at root)
- Modify: `package.json` (at root)
- Create: `apps/api/pyproject.toml`
- Create: `apps/api/src/main.py`
- Create: `apps/api/src/core/config.py`

**Approach:**
- Define the root `pnpm-workspace.yaml` pointing to `apps/*`.
- Initialize a Python project in `apps/api` using `uv init`.
- Setup a basic FastAPI application in `main.py` with CORS middleware defaulting to `http://localhost:5173` and `http://127.0.0.1:5173`, overridable via environment variables for other local ports.

**Patterns to follow:**
- Standard FastAPI app factory pattern.

**Test scenarios:**
- Happy path: Server starts and `/docs` is accessible locally, exposing the Swagger UI.
- Integration: Vite dev server can proxy API requests to the Python backend without CORS errors.

**Verification:**
- The Python API can be started concurrently with the Vite frontend.

---

- U2. **Database Models and Alembic Migrations**

**Goal:** Translate the Markdown data models into SQLModel classes and setup Alembic.

**Requirements:** R2

**Dependencies:** U1

**Files:**
- Create: `apps/api/src/core/database.py`
- Create: `apps/api/src/models/project.py`
- Create: `apps/api/src/models/ticket.py`
- Create: `apps/api/src/models/agent.py`
- Create: `apps/api/src/models/timeline.py`
- Create: `apps/api/alembic.ini`
- Modify: `.gitignore` (ignore `apps/api/.data/`)

**Approach:**
- Translate the in-scope `docs/technical/data-model.md` entities to SQLModel tables: `Project`, `Ticket`, `AcceptanceCriterion`, `AgentRun`, and `TimelineEvent`.
- Keep `PreviewSession`, `DiffReel`, and `ContextPack` out of this phase until the preview runtime and AI orchestration plans own those tables explicitly.
- Use an SQLite database path configured via environment variables, defaulting to `apps/api/.data/vibeboard.db` so the file is repo-local and gitignored. Before destructive resets or migration experiments, copy the database into `.data/backups/`.
- Setup Alembic immediately after the models scaffold and treat Alembic revisions as the sole schema authority for dev/runtime databases; avoid `SQLModel.metadata.create_all()` outside isolated tests.

**Test scenarios:**
- Happy path: Alembic can auto-generate an initial migration from the models.
- Happy path: Applying the migration creates the correct tables in the SQLite database.
- Error path: Missing Project references are not validated by SQLModel model construction; the API layer must pre-check `projectId` or translate database integrity errors when the insert commits.

**Verification:**
- The SQLite database is created locally and contains the `Project`, `Ticket`, `AcceptanceCriterion`, `AgentRun`, and `TimelineEvent` tables, with the database file living under the gitignored `apps/api/.data/` directory.

---

- U3. **REST API Routes for Board and Tickets**

**Goal:** Implement the create/read/update endpoints needed by the Kanban board and the first `TicketDetail` page.

**Requirements:** R3

**Dependencies:** U2

**Files:**
- Create: `apps/api/src/api/routes/projects.py`
- Create: `apps/api/src/api/routes/tickets.py`
- Modify: `apps/api/src/models/ticket.py` (request/response models, including `TicketDetail`)
- Modify: `apps/api/src/main.py` (include routers)

**Approach:**
- Implement `GET /projects` and `POST /projects`; defer Project update/delete until a real ownership/archive workflow exists.
- Implement `GET /tickets`, `GET /tickets/{ticket_id}`, `POST /tickets`, and `PATCH /tickets/{ticket_id}` to support board reads, detail reads, and stage updates. Defer Ticket delete until the product defines archive/removal behavior.
- Define `TicketDetail` as a backend-owned aggregate response for `GET /tickets/{ticket_id}` with a minimum field set covering ticket core fields, acceptance criteria, recent timeline entries, and any preview metadata/status fields the current UI already renders.
- Keep the endpoints thin, delegating DB calls to simple service functions or inline SQLModel sessions.

**Execution note:** Test-first is recommended to lock down the JSON schema contracts before connecting the frontend.

**Test scenarios:**
- Happy path: Fetching tickets returns the active Kanban board items.
- Happy path: Fetching `GET /tickets/{ticket_id}` returns the normalized `TicketDetail` payload expected by the current detail UI.
- Edge case: Creating a ticket with an empty title is rejected by API validation (Pydantic 422).
- Integration: Updating a ticket's `status` successfully persists and returns the updated model.

**Verification:**
- The Swagger UI allows creating a project, creating a ticket, fetching `TicketDetail`, and moving the ticket between statuses.

---

- U4. **WebSocket Gateway for Timeline Events**

**Goal:** Provide a real-time event stream to update the "Execution Evidence" and "Timeline" in the frontend without polling.

**Requirements:** R4

**Dependencies:** U3

**Files:**
- Create: `apps/api/src/api/routes/timeline_events.py`
- Create: `apps/api/src/api/websocket/timeline_ws.py`
- Modify: `apps/api/src/main.py`

**Approach:**
- Use FastAPI's WebSocket support to create a `/ws/tickets/{ticket_id}` endpoint.
- Add a timeline-event ingest route (`POST /tickets/{ticket_id}/timeline-events`) that persists a `TimelineEvent` before notifying subscribers.
- Start with a minimal in-memory per-ticket connection registry colocated with the WebSocket module; only extract a broader event-bus abstraction after a second producer/process proves necessary.
- When an Agent (or mock script) creates a new `TimelineEvent` via REST API, the server persists it and then broadcasts the normalized event payload to connected WebSocket clients for that ticket.

**Test scenarios:**
- Happy path: Client connects to WS and receives a confirmation payload.
- Integration: Posting a new timeline event via REST API pushes the event JSON down the active WebSocket connection.
- Edge case: Client disconnects abruptly without causing server errors.

**Verification:**
- A simple frontend script can listen to the WebSocket and `console.log` events as they are created in the backend.

---

- U5. **OpenAPI Client Generation Pipeline**

**Goal:** Ensure the TypeScript frontend stays in sync with the Python backend automatically.

**Requirements:** R5

**Dependencies:** U3

**Files:**
- Create: `apps/api/scripts/export_openapi.py`
- Modify: `package.json` (add scripts for frontend generation)

**Approach:**
- Write a Python script to dump the FastAPI `openapi.json` to disk.
- Use `openapi-typescript` to generate a single `api.generated.ts` types artifact from that JSON.
- Keep data-fetching hooks/client wrappers handwritten in this phase; revisit `orval` or generated hooks only after the REST contract stabilizes.

**Test scenarios:**
- Happy path: Running the export script generates a valid `openapi.json`.
- Happy path: Running the TS generator creates `api.generated.ts` that matches the published response models, including `TicketDetail` and timeline event payloads.

**Verification:**
- The `Ticket`, `TicketDetail`, and timeline event interfaces in the frontend exactly match the FastAPI response models without manual duplication.

---

## System-Wide Impact

- **Interaction graph:** The frontend will switch from importing local mock files to calling `GET /projects`, `GET /tickets`, `GET /tickets/{ticket_id}`, `POST /tickets`, `PATCH /tickets/{ticket_id}`, `POST /tickets/{ticket_id}/timeline-events`, and `/ws/tickets/{ticket_id}`.
- **State lifecycle risks:** WebSocket connection drops must be handled gracefully by the frontend; the current phase guarantees live fan-out after connect, while richer replay semantics remain an explicit follow-up question.
- **API surface parity:** FastAPI's published schema will replace the manual `vibeTicket.ts` interfaces currently in the web app, while frontend hooks stay handwritten for now.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Dual-ecosystem complexity (Python + TS) | U5 establishes an automated OpenAPI generation pipeline to maintain single-source-of-truth for types. |
| SQLite locking with parallel Agent execution | Keep transactions very short, store the DB under `apps/api/.data/`, back it up before destructive resets, and move to PostgreSQL once multi-process contention or durability requirements show up repeatedly. |
| Scope creep from deferred preview/runtime work | Keep preview runtime lifecycle APIs and persistence out of this plan; only ship the preview metadata that today's `TicketDetail` UI already needs. |

---

## Documentation / Operational Notes

- README needs updating to document how to start the backend (`uv run uvicorn src.main:app`) and frontend simultaneously.
- Python 3.12+ is recommended to leverage the latest type hinting features.
- Document the default local database location (`apps/api/.data/vibeboard.db`), the reset path for local development, and the environment variable used to override allowed frontend origins.

---

## Deferred / Open Questions

### From 2026-04-28 review

- **Auth and timeline payload policy are undefined** — U3-U4 API / WebSocket contract (P1, security-lens, confidence 100)

  The current plan now defines the transport surface, but it still does not decide what auth model protects project, ticket, and WebSocket endpoints in the local MVP, or how strictly timeline-event payloads are validated before they are persisted and fanned out.

  <!-- dedup-key: section="u3u4 api websocket contract" title="auth and timeline payload policy are undefined" evidence="" -->

- **Realtime replay behavior is undefined** — U4 — WebSocket Gateway for Timeline Events (P1, design-lens, adversarial, confidence 100)

  The plan establishes live fan-out for connected clients, but it still leaves late-join and reconnect behavior open: whether a subscriber receives full replay, a recent tail, or only live events with a separate `TicketDetail` refetch path.

  <!-- dedup-key: section="u4 websocket gateway for timeline events" title="realtime replay behavior is undefined" evidence="" -->

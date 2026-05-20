# Process Discovery Agent — Project Brief

**Beam AI Hackathon · Team 02**
**Dates:** Wed 20 May – Fri 22 May 2026
**Demo:** Friday 22 May, 12:00 CET — 5 min demo + 5 min Q&A

**Team:** Christian (output generation), Lucas (conversation design + prompts), Sara (UI), Syed/Hussain (backend loop + Meet integration), Aqib (support + prototype owner)

---

## The problem

Every new client engagement starts with weeks of discovery interviews. Clients don't know their own processes — they think something works one way and it works another. Beam's solution engineers spend significant time on manual discovery before a single agent can be built.

The goal: automate process discovery. An AI agent interviews client employees, builds a structured understanding of how their work actually happens, and outputs everything needed to start building agents immediately.

---

## What we're building

**Timmy** — an AI business analyst that conducts a voice interview inside Google Meet, builds a knowledge base from what it hears, and generates three outputs at the end of the session:

1. **A process flowchart** with per-node step classification (Deterministic / Agentic / RPA Bridge)
2. **A SIPOC table** — instantly recognisable to any operational or transformation buyer
3. **A standard SOP document** — structured text, ready to hand to any client

What makes this unique is not the outputs themselves — it's where they live. Beam is the only platform where process discovery and agent deployment happen in the same place, in one seamless pipeline, without switching tools.

---

## Why this is worth building

- Klarity, the most funded player in this space ($70M Series B), has agent building capabilities — but in our sales call they explicitly positioned this as something for partners to handle, because Beam has the same. Discovery tools and agent platforms are two separate products at six-figure price points. We make them one.
- Klarity's pricing: $15K for a 10-day pilot, "well north of six figures" for a full contract. Beam cannot bundle this into a client offering. Building our own is a business necessity.
- Beam is the only platform where what Timmy learns in the interview feeds directly into the agents Beam builds next — no export, no handoff, no context lost.

**One-sentence pitch for Friday:**
> *"Every other discovery tool hands you a report and sends you somewhere else to build. Beam is the only platform where the interview, the process map, and the agent spec are one pipeline — and the agent you're about to build is already waiting on the other side."*

---

## MVP scope — what's in and what's out

### In scope (Friday demo)

**Phase 1 — Campaign setup**
User creates a project: client name, process name, one-line goal. The refund processing project is pre-seeded so the demo never starts blank.

**Phase 2 — Context integration**
Single "Add context" step after project creation. User pastes existing docs (Notion page, SOP, email thread) or skips. Stored as a plain text `context_blob`. Timmy reads this before generating his first question — makes him sound like he already knows the client.

**Phase 3 — Goal definition**
Timmy proposes 3-5 exploration goals derived from the context. User edits and approves. These become Timmy's internal agenda — the topics he must cover before closing the interview. This is what separates a structured interview from a random conversation.

**Phase 4 — Voice interview in Google Meet**
Timmy joins the Google Meet as a bot via Recall.ai and speaks directly in the call. His voice is generated via the existing ElevenLabs integration in Prism. During the interview, the Timmy web app shows an avatar image and a session status indicator (speaking / listening). The knowledge base builds silently in the background — no live flowchart during the call.

**Phase 5 — Information intake and processing**
After each interviewee answer, one LLM call extracts structured data: process steps, actors, decisions, systems, confidence score. This feeds the knowledge base and is the foundation of all three outputs.

**Phase 6 — Knowledge base building**
The KB is the accumulated extraction JSONs from the session, stored in a local array. Single-session only for the MVP. Enables Timmy to reference earlier answers and detect which goals still have gaps.

**Phase 7 — Multi-interview contextualization**
*Out of scope. Named in the Friday demo as a Week 1 roadmap item.*

**Phase 8 — Orchestration (the Timmy loop)**
Simple four-state machine: setup → interviewing → processing → complete. Per-turn loop runs synchronously: Recall.ai transcript → extraction → KB update → goal check → question generation → ElevenLabs TTS → Recall.ai audio injection → Timmy speaks. No queues, no background workers.

**Phase 9 — Output generation**
Three outputs generated when the user clicks "Generate outputs":
- SIPOC table with step classification tags
- Labeled process flowchart (Deterministic / Agentic / RPA Bridge per node, confidence score per node)
- Standard SOP document (Purpose, Scope, Roles, Steps, Exceptions, Systems, Approvals)

### Out of scope
- Screen recording
- Reconfirmation flow
- Multi-interview contextualization
- Auth, database, multi-user support — single-user app, data stored locally

### Friday morning goal (before demo)
- Prism integration — target to have the app running inside Prism before the 12:00 demo. Not a hard dependency for the demo itself, but the target.

---

## Tech stack

- **Runtime:** Aqib's existing prototype (build on top, not from scratch)
- **Single-user:** no auth, no DB, data stored locally, API keys in `.env.local`
- **Voice in Meet:** Recall.ai (bot joins as participant, streams audio in/out)
- **TTS:** ElevenLabs — reuse existing Prism integration, ask Aqib for credentials
- **Transcription:** Recall.ai built-in (utterance-end events, no separate Whisper needed)
- **LLM calls:** OpenAI via existing API key (extraction call + question generation call per turn)
- **Flowchart rendering:** Aqib's existing renderer (wire to final KB state, not live feed)

---

## Team allocation

| Person | Stream | Priority |
|---|---|---|
| **Syed** | Timmy loop backend — extraction call, KB, goal tracker, question generator, Recall.ai wiring | Start with text loop, verify logic, then add ElevenLabs + Recall.ai |
| **Sara** | UI — project setup screens, interview screen (avatar + status only), output screen | Build setup + output screens first; interview screen is lightweight |
| **Lucas** | Timmy conversation design + prompt files — extraction prompt, question generator prompt, exploration goals logic | **Do this first** — Syed is blocked until Lucas hands over the prompts |
| **Christian** | Output generation — SIPOC renderer, SOP generator, labeled flowchart | Works from KB schema once data contract is defined |

**Critical dependency:** Lucas writes the extraction prompt and question generator prompt first. Syed cannot build the loop without them.

**Data contract:** Before anyone writes code, agree on the shared JSON schemas — extraction output, KB array structure, flowchart node shape, goal coverage format, output payload. These are the integration seams. Define them in a shared file in the repo first.

---

## Timmy loop — how the AI orchestration works

```
Interviewee speaks in Meet
  → Recall.ai websocket → utterance_end event + transcript text
  → [Extraction call] → { steps, actors, decisions, systems, confidence }
  → [KB update] → append to local array
  → [Goal tracker] → which of 3-5 goals are now covered? (no LLM needed)
  → [Question generator] → one follow-up question
  → [ElevenLabs TTS] → audio bytes
  → [Recall.ai audio injection] → Timmy speaks in the call
  → KB stored locally — flowchart rendered only after session ends
```

**Timmy's question priority order:**
1. If the last answer was vague → ask for clarification on that specific point
2. If a decision point was detected → explore its conditions and outcomes
3. If an exploration goal is still uncovered → transition to it naturally
4. If all goals are covered → summarise and offer to close

**Risk gate (Recall.ai):** If not working end-to-end by Thu 15:00, switch to fallback immediately. Fallback: Timmy as a sidebar web app, voice through speakers, screen-shared in the Meet. The core loop is identical — only audio plumbing changes.

---

## Friday demo structure (5 minutes)

| Time | Content |
|---|---|
| 0:00–0:45 | Problem: *"Every new engagement starts with weeks of discovery. Clients don't know their own processes. We go faster."* |
| 0:45–3:00 | Live demo: create project → add context → approve goals → Timmy joins Meet → interview runs → KB builds |
| 3:00–3:45 | Click "Generate outputs" → SIPOC table + labeled flowchart + SOP appear |
| 3:45–4:15 | *"Every other discovery tool hands you a report and sends you somewhere else to build. Beam is the only place where the next step is already there."* + competitor table |
| 4:15–5:00 | Roadmap: multi-session memory, passive observation, push to Beam agent runner |

**Demo scenario:** Refund processing — pre-built in Aqib's POC, real transcript exists, context and goals pre-seeded. Do not demo a blank slate.

---

## Post-Friday roadmap

| Week | What to add |
|---|---|
| Week 1 | Multi-session memory — continue a discovery project across multiple interviews |
| Week 1 | Export flowchart as PNG / structured JSON |
| Week 2 | Passive observation mode (opt-in screen recording, Screenpipe integration) |
| Week 2 | Conflict detection — when two sessions describe the same step differently, surface the variance |
| Week 3 | Push to Beam agent runner — take the agent spec and wire it to a Prism agent automatically |
| Week 4 | Org-chart traversal — Timmy asks "who else should I talk to?" and schedules follow-up sessions |
| Future | Closed-loop: deployed agent performance triggers re-discovery when process drift detected |
| Future | Ontology layer — structured object graph that agents write back to and humans confirm |

---

## Competitive position

| Capability | Klarity | Varos | Ontora | Flowscope | Beam (Timmy) |
|---|---|---|---|---|---|
| AI voice interview | ✓ | ✓ | ✓ | — | ✓ |
| Real-time flowchart | — | — | — | — | ✓ |
| Per-node confidence | — | — | — | — | ✓ |
| **Native to agent build platform** | — | — | — | — | **✓ Prism** |
| **Discovery → agent in one pipeline** | — | — | — | — | **✓** |
| **No separate contract or tool switch** | — | — | — | — | **✓** |

---

*Knowledge base: `github.com/christianengnath-ctrl/process-discovery-kb`*

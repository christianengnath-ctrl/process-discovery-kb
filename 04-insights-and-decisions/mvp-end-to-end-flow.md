# MVP End-to-End Flow — Process Discovery Agent

*Derived from: kickoff call transcript (May 20) + kickoff brief + competitive analysis*  
*Updated: May 21 — agent renamed Timmy, voice in Google Meet confirmed, SOP output added, Phase 7 confirmed out*

---

## Confirmed constraints

- Build on Aqib's prototype — not from scratch, not into Prism yet
- Single-user app: no auth, no DB, no multi-user — data stored locally, API keys via `.env.local`
- Screen recording → OUT of MVP scope
- Reconfirmation flow → OUT of MVP scope
- Multi-interview contextualization (Phase 7) → OUT of MVP scope
- Prism integration → deferred to post-hackathon
- **Agent name: Timmy** (not Arthur)
- **Interview modality: voice-based inside Google Meet**
- Spec format for Sara/Hussain: screenshots + logic flowcharts

---

## AI Orchestration Layer — the "intelligent AI in the back"

This is the nucleus of what makes Timmy feel real rather than scripted. It is one repeating loop, triggered after each user turn.

### The Timmy loop (per turn)

```
User speaks in Meet
  → [Transcription] → user_turn_text
  → [Extraction call] → structured JSON {steps, actors, decisions, systems, confidence}
  → [KB update] → updated knowledge base + flowchart nodes
  → [Goal tracker] → which of the 3-5 exploration goals are now covered?
  → [Question generator] → next question text
  → [TTS] → Timmy speaks
```

Each arrow is either a simple function or a single LLM call. No complex infrastructure. No queues. No background workers.

### Extraction prompt (one call per user turn)

```
Given this conversation history and this user answer, extract:
- Process steps mentioned (sequence if clear)
- Actors/roles mentioned
- Decision points (if/then conditions)
- Systems or tools mentioned
- Confidence per item: 1=explicit, 2=implied, 3=inferred
Return as JSON.
```

### Question generator prompt (Timmy's brain)

```
You are Timmy, an AI business analyst interviewing {interviewee_name}
about {process_name} at {client_name}.

Context you have: {context_blob}
Exploration goals: {goals_list with coverage status}
What you've learned so far: {accumulated_steps_summary}
Last 3 conversation turns: {recent_history}

Ask ONE follow-up question. Priority order:
1. If last answer was vague → ask for clarification on that specific point
2. If you detected a decision point → explore its conditions and outcomes
3. If an exploration goal is still uncovered → transition to it naturally
4. If all goals are covered → summarize what you've learned and offer to close

Be conversational. Reference what they just said. One question only.
```

That is Timmy's entire intelligence. One extraction call + one question generation call per turn.

---

## Google Meet voice integration — approach

**Primary target: Timmy joins Meet as a bot via Recall.ai**
- Recall.ai API: give it the Meet link → bot joins as a participant, streams audio in/out
- Recall.ai provides built-in transcription (utterance-end events) — no need for separate Whisper
- Timmy speaks directly in the call via OpenAI TTS → audio bytes → Recall.ai audio injection
- Flowchart builds live in the Timmy web app, screen-shared by the interviewer in the Meet

**Build order (critical):**
1. Build the core Timmy loop first with text I/O in isolation — verify extraction + question generation work before touching audio
2. Add OpenAI TTS (`tts-1` model, `onyx` or `nova` voice)
3. Wire Recall.ai: bot join, websocket listener for utterance-end events, audio send
4. Check Recall.ai's required audio format before building TTS pipeline (PCM or Opus — this is where teams lose time)

**Fallback: sidebar app (if Recall.ai hits issues by Thu 15:00)**
- Timmy runs as a separate browser tab alongside Meet
- Interviewee hears Timmy via speakers; interviewer's mic picks up responses
- Screen share shows the Timmy interface + live flowchart
- The core loop is identical — only audio plumbing changes
- Fallback costs zero extra build time if loop is built first

**Risk gate: if not working by Thu 15:00, switch to fallback. Do not chase Recall.ai past that point.**

---

## The 9-phase nucleus

### Phase 1 — Campaign setup
**In nucleus | ~1h**

Project list → new project:
- Client name
- Process name (e.g. "Refund processing")
- One-line goal

Pre-seed the refund processing project so demo never starts blank.

---

### Phase 2 — Context integration
**In nucleus | ~1-2h**

After project creation: single "Add context" step.  
User pastes existing docs (Notion page text, SOP, email thread) or skips.  
Stored as `context_blob` (plain text, local).  
Timmy reads this before generating his first question.

---

### Phase 3 — Define exploration goals
**In nucleus (simplified) | ~1h**

Timmy (or setup screen) proposes 3-5 exploration goals derived from the context. User edits/approves.  
Examples:
- "Understand who initiates the refund request"
- "Map the approval chain for amounts over $500"
- "Identify what systems are involved"

These become Timmy's internal agenda — topics he must cover before closing the interview.

---

### Phase 4 — AI interview (voice in Google Meet)
**In nucleus — core demo moment | ~3-4h (Sara + Hussain)**

Voice-based. Timmy runs alongside Google Meet. Screen share shows the live flowchart.

Timmy's flow:
1. Introduces himself, explains the session (~1 turn)
2. Open question: "Walk me through what happens when a refund request comes in"
3. Dynamic follow-up based on extraction output + goal tracker
4. Checks off exploration goals as covered
5. Probes decision points and gaps
6. Closes when all goals covered OR interviewee says done

Each turn triggers the Timmy loop (see orchestration section above).  
**Lock to refund processing scenario. Do not demo a blank-slate interview.**

---

### Phase 5 — Information intake and processing
**In nucleus — runs silently per turn | ~2-3h**

The extraction call in the Timmy loop. Outputs structured JSON per turn:
- Process step described
- Actor/role
- Decision point (if any)
- System/tool involved
- Confidence score

Output feeds directly into the flowchart. Each element becomes a node or edge.

---

### Phase 6 — Knowledge base building
**In nucleus (single-session only) | ~1h**

KB = accumulated extraction JSONs stored in memory or local file.  
No vector DB, no embeddings, no cross-session persistence for MVP.

Enables:
- Timmy references earlier answers ("You mentioned the AP clerk validates the order — who do they escalate to if the amount is over $500?")
- Goal tracker knows what's covered
- Flowchart reflects cumulative understanding, not just last answer

Multi-session memory → post-Friday roadmap (Week 1).

---

### Phase 7 — Multi-interview contextualization
**CONFIRMED OUT OF SCOPE**

The "10 interviews then 10 more focused on gaps" loop. Deferred to Week 1 post-Friday.  
Name it in the Friday demo as a roadmap item.

---

### Phase 8 — Orchestration (Timmy loop)
**In nucleus | defined above**

Four states:
1. `setup` — project created, context added, goals defined
2. `interviewing` — active session, Timmy asking, flowchart updating per turn
3. `processing` — session ended, generating outputs
4. `complete` — all outputs ready

Per-turn loop: transcription → extraction → KB update → goal check → question generation → TTS.  
Synchronous, single-threaded, no background workers.

---

### Phase 9 — Output generation
**In nucleus | ~3-4h (Lucas, Stream 3)**

Triggered when user clicks "Generate outputs". Three outputs:

**Output A: SIPOC table**
| Suppliers | Inputs | Process Steps | Outputs | Customers |
|---|---|---|---|---|
| Derived from actors/systems in KB | Trigger + inputs | Numbered steps with classification tags | Deliverables | End recipients |

**Output B: Labeled process flowchart**
- Each node: step classification tag — `Deterministic` / `Agentic` / `RPA Bridge`
- Confidence score per node
- Rendered in the project view (builds live during interview, finalized here)

**Output C: Standard SOP document (text)**  
Plain text, structured format:
1. **Purpose** — one paragraph describing the process goal
2. **Scope** — what's included, what's not
3. **Roles & Responsibilities** — actors from the KB, their responsibilities
4. **Process Steps** — numbered, with decision points called out inline
5. **Exceptions & Edge Cases** — from KB confidence gaps + decision branches
6. **Systems Used** — tools/systems identified during interview
7. **Approvals** — decision authorities identified

Generated from the same KB as A and B. One additional LLM call with the full KB as input.

---

## Phase summary

| Phase | Status | Owner |
|---|---|---|
| 1. Campaign setup | ✓ In nucleus | Sara + Hussain |
| 2. Context integration | ✓ In nucleus | Sara + Hussain |
| 3. Goal definition | ✓ In nucleus | Sara + Hussain |
| 4. AI interview (voice, Meet) | ✓ In nucleus — core demo | Sara + Hussain |
| 5. Intake & processing | ✓ In nucleus (Timmy loop) | Sara + Hussain |
| 6. KB building | ✓ In nucleus (single session) | Sara + Hussain |
| 7. Multi-interview contextualization | ✗ OUT OF SCOPE | — |
| 8. Orchestration (Timmy loop) | ✓ In nucleus | Sara + Hussain |
| 9. Output: SIPOC + flowchart + SOP | ✓ In nucleus | Lucas |

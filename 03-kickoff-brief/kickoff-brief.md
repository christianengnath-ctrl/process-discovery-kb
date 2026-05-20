# Team Kickoff Brief — Process Discovery Agent

**Beam AI Hackathon · Team 02**  
Lead: Christian Engnath · Team: Lucas, Sara, Hussain, Aqib (sparring)  
Prepared: Wed 20 May 2026 · Kickoff session

---

## The brief (from the one-pager)

**Problem:** Mapping a client's workflow and processes takes weeks of interviews and deep client work (including edge cases). We need to discover processes in days, not weeks.

**What we're building:** An agent that interviews client employees and combines their answers with screen-recording / process mining → outputs a flowchart + agent spec. Built on Aqib's POC.

**Outcome by Friday:** Real workflow in → flowchart + agent spec out.

**Demo:** 10-min slot: 5 to demo, 5 for Q&A. Problem → live demo → packaging → next 4 weeks.

**Stretch:** Benchmark side-by-side against klarity.ai, varosresearch.com, ontora.com, flowscope.com — show where Beam wins.

---

## What the demo must show (non-negotiable)

1. User types: *"I want to automate refund request handling"*
2. Starts interview with Arthur → 3-minute conversation, screen-sharing email inbox
3. Flowchart builds live, per-node confidence scores appear
4. Interview ends → clicks "Generate agent spec"
5. Structured Beam agent blueprint appears on screen
6. Presenter: *"Every competitor stops at step 3. We start there."*

---

## Scope of work — 4 parallel streams

**Available build time:** ~12h Thursday (full build day) + ~2.5h Friday morning before demo = ~14h per person, ~56 person-hours total.

### Stream 1 — Prism Extension Shell
**Owner:** Lucas | **Window:** Wed 17:00 → Thu noon  
**Goal:** The thing runs inside Prism, not as a standalone app. This unblocks all other streams.

- Create `process-discovery` extension with correct manifest (kebab-case id, semver, permissions)
- Extension entity: `DiscoveryProject` with list + detail views
- Port / wire the existing Discovery landing page as the entry view
- Project list with % understood from POC data model

### Stream 2 — Interview Agent + Live Flowchart
**Owner:** Sara + Hussain | **Window:** Thu all day  
**Goal:** The core demo moment works end-to-end reliably.

- Wire Arthur into Prism's Mastra agent runtime (Aqib advises on POC structure)
- Screen-share observation pipeline from POC
- Conversation UI with turn labels (LOGGING / MIRRORING / REFLECTING / DECISION DETECTED)
- Live flowchart rendering in project view (port POC renderer)
- Interview overlay with live stats (steps, confidence X/Y, open gaps)
- **Lock to the refund processing scenario** — don't demo a blank slate

### Stream 3 — Agent Spec Generator
**Owner:** Lucas (picks up Thu afternoon after Stream 1 done) | **Window:** Thu afternoon  
**Goal:** The output nobody else has.

- After interview ends: parse flowchart into structured agent spec
  ```json
  {
    "trigger": "Customer sends refund request email",
    "steps": [...],
    "decisions": [{ "condition": "Amount > $500", "yes": "manager_approval", "no": "auto_approve" }],
    "actors": ["AP clerk", "Finance Manager (on-call rotation)"],
    "exceptions": ["Multiple recent refunds", "Order > 90 days old"],
    "tools_needed": ["Email inbox", "Order management system", "Slack (manager notify)"],
    "confidence_avg": 0.79
  }
  ```
- Render as an "Agent Blueprint" card in the project view
- "Export / Preview in Beam" action — well-formatted view is enough; doesn't need to be a live agent for the demo

### Stream 4 — Demo Script + Polish
**Owner:** Christian | **Window:** Thu afternoon → Fri morning  
**Goal:** 5 minutes on Friday are airtight. No surprises.

- Script the full demo using the **refund processing scenario** (transcript exists, flowchart pre-built, it's real)
- Ensure all three streams have a rehearsable path by Thu 18:00
- Competitor benchmark slide (one table — see `02-competitive-intelligence/competitive-synthesis.md`)
- *Stretch:* Show second scenario (invoice approval is already in the project list) to demonstrate the backlog UX

---

## Risk log

| Risk | Mitigation |
|---|---|
| POC → Prism integration takes longer than Stream 1 budget | Aqib on standby; worst case demo the POC standalone and narrate "this moves into the extension" |
| Voice/screen-share hits Prism permissions issues | Fall back to text-only interview — flowchart still works, demo is still compelling |
| Agent spec output too thin to impress | Make the schema verbose and well-labelled — the structure is the story, not the runtime |
| Demo reliability on Friday | Fixed test scenario only, no live improvisation; rehearse Thu evening |

---

## Decisions to make at kickoff

1. **Is the POC already a Prism extension, or a standalone app?** Aqib answers — changes Stream 1 scope.
2. **Voice or text-only for the Friday demo?** Voice = impressive. Text = reliable. Recommendation: wire both, fall back to text if unstable.
3. **Which demo scenario?** Refund processing (recommended — pre-built, real, transcript exists).
4. **Stream ownership confirmed?** Assign before 17:15 checkout today.

---

## Friday demo structure (5 minutes)

| Time | Content |
|---|---|
| 0:00–0:45 | Problem slide: *"Every new client engagement starts with weeks of discovery interviews. Clients don't know their own processes. We need to go faster."* |
| 0:45–3:30 | Live demo: type the problem → start interview → Arthur asks, screen is shared, flowchart builds live |
| 3:30–4:15 | Click "Generate agent spec" → blueprint appears → *"This is the step nobody else does."* |
| 4:15–5:00 | Packaging + roadmap: *"This is a Prism extension. Beam's solutions team uses it at the start of every engagement. Next 4 weeks: multi-session memory, export to Beam agent runner, passive screen observation."* |

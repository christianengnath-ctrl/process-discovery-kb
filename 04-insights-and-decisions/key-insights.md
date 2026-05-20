# Key Insights & Strategic Decisions

*Synthesised from: Aqib's POC video, Klarity sales call, competitive analysis, hackathon brief*  
*Updated: Wed 20 May 2026*

---

## The insight that makes this project worth building

**Klarity — the most mature, best-funded player in the space — explicitly told us they don't close the discovery → agent gap.** Cory's exact words: *"We do now have agent building capabilities, but we probably don't need to dive too deep into some of that given you guys have those same types of capabilities."*

This is not a product gap. It's a strategic hand-off. Klarity is conceding the agentic layer to partners. Beam's Discovery Agent is that partner's tool — and it lives inside Prism.

No competitor outputs an agent spec. We do. That's the demo.

---

## Insights from the Klarity call

### 1. Pricing confirms we must build our own
Klarity: "well north of six figures" full contract, $15K for a 10-day pilot. Beam cannot bundle this into a client offering. Our own discovery tool is a business necessity, not a nice-to-have.

**Use in Friday pitch:** *"The alternative is a six-figure enterprise SaaS contract. We built this in 1.5 days."*

### 2. Their biggest product challenge is ours to avoid
Klarity's hardest problem: getting people to click "start companion." Their answer: anonymisation + executive mandate + personal strength incentives.

Our answer: the user initiates the interview themselves. They want to describe their process — they're the expert. No mandate needed. No cold-start problem.

**Frame this as a deliberate product philosophy in the pitch**, not a feature gap.

### 3. Executive champion is still required
Even with user-initiated interviews, adoption at scale requires a senior sponsor. This is true for us too. The discovery agent works best when the process owner is the interviewee — not when IT deploys it top-down.

### 4. Europe / GDPR is a real differentiator
Christian raised this in the call: *"Especially in Germany and Europe, people are so hesitant to share anything they do."* Klarity's answer is anonymisation. Our answer is even better — user-controlled, user-initiated session, data stays in Prism (local-first).

**Callout in the Friday pitch** if we're talking to a German/European audience.

### 5. LLM routing is table stakes
Klarity dynamically switches between OpenAI, Gemini, Anthropic per task type. We should mention that Arthur routes to the right model too (even if simple today). It signals we think at the same sophistication level.

---

## Insights from the competitive analysis

### What all four competitors do
- AI-led capture (not forms, not log analysis)
- Some form of structured process output beyond transcripts
- Human oversight / project manager model
- Sales-led, enterprise-first GTM
- Positioned as replacement for expensive consulting discovery

### True differentiators by company
| Differentiator | Who has it | Why it matters for us |
|---|---|---|
| Three capture modes (interview + passive + docs) | Klarity only | We don't need all three to win |
| "Next best question" + conflict detection | Varos | Copy this algorithm for Arthur — it's what makes it a BA replacement vs. transcription tool |
| MCP server on knowledge graph | Ontora | Post-Friday roadmap — makes the process graph queryable by other agents |
| Cross-user handoff detection | Flowscope | Captures what operators don't know they do — not feasible this week |
| Continuous live-updating process map | Flowscope | Not feasible this week but worth naming in roadmap |

### What nobody does (our whitespace)
1. **Discovery → agent spec in one pipeline** ← build this in Stream 3
2. **Governance schema** (who approves what, audit trails) ← later
3. **Closed loop** (agent performance triggers re-discovery) ← later
4. **Multi-persona process model** (role A vs role B variations → reconciled canonical flow) ← later

---

## Decisions made at kickoff

> *Update this table as decisions are made during the kickoff session*

| Decision | Answer | Owner |
|---|---|---|
| Is POC a Prism extension or standalone? | TBD | Aqib |
| Voice or text-only for Friday demo? | TBD | Christian |
| Demo scenario | Refund processing (recommended) | Christian |
| Stream 1 owner | Lucas | confirmed |
| Stream 2 owners | Sara + Hussain | confirmed |
| Stream 3 owner | Lucas (Thu afternoon) | confirmed |
| Stream 4 owner | Christian | confirmed |

---

## The one-sentence pitch for Friday

> *"We built the missing last step of process discovery: the moment a client describes how their work happens, Beam maps it into a live flowchart and turns it into a deployable agent spec — directly inside Prism. Every competitor stops at the map. We start there."*

---

## Post-Friday roadmap (next 4 weeks)

Use this in the Friday demo to show you've thought beyond the hackathon.

| Week | What to add |
|---|---|
| Week 1 | Multi-session memory — continue a discovery project across multiple conversations |
| Week 1 | Export flowchart as PNG / structured JSON |
| Week 2 | Passive observation mode (opt-in screen recording, Screenpipe integration) |
| Week 2 | Conflict detection — when two sessions describe the same step differently, surface the variance |
| Week 3 | "Push to Beam agent runner" — take the agent spec and wire it to a Prism agent automatically |
| Week 4 | Org-chart traversal — Arthur asks "who else should I talk to?" and schedules follow-up sessions |
| Future | Closed-loop: deployed agent performance triggers re-discovery when process drift detected |
| Future | MCP server exposing the process graph to other agents |

# Competitive Proxy Analysis — Enterprise Process Discovery

*Compiled: Wed 20 May 2026 · Sources: company websites, YC profiles, Varos live demo transcript (May 2026), Klarity sales call (May 20, 2026)*

---

## The four companies

### 1. Klarity.ai — "Enterprise Instinct Platform"

**What they are:** Most mature player. $70M Series B. Fortune 500 clients: DoorDash, Stripe, Salesforce, OpenAI, Uber, Google, ServiceNow, McKesson, multiple consulting firms. ~200 employees.

**Capture modalities (all three):**
- **AI Companion** — passive screen capture via browser, no install needed, runs 6-8h/day [confirmed]
- **AI Interviewer** — voice interview + screen share, 15-30 min structured sessions, auto-screenshots [confirmed]
- **AI Intake** — ingest existing SOPs, runbooks, PDFs, Word, Excel [confirmed]

**Feature tree:**

| Layer | Capability |
|---|---|
| Discover | Companion (passive) · Interviewer (active) · Intake (docs) · Time-to-first-graph: "3 days" |
| Structure | Context Graph (4 layers: structured data, unstructured docs, tribal knowledge, agents) · Process Index (searchable, role-aware, L1-L5) · Decision nodes (who approves what) · Continuous refresh |
| Output | Pre-built templates: SOX narratives, BRDs, SOPs, PDDs · In-app editor + AI chat · Per-step spreadsheet: volumes, cycle times, owner, cost · Export to Visio/PNG/SFG |
| Improve | Advisor agent (prompt-based querying) · ROI roadmap · Agent building (de-emphasised, they partner on this) |

**Pricing:** Custom enterprise only. "Well north of six figures." Pilot: $15K for 10 days.  
**Integrations:** No install for Companion; CRM/HRIS/ERP/ITSM via API for graph layer.

**Key adoption challenge (confirmed in call):** Getting individual contributors to click "start companion" is their biggest hill. Requires executive mandate + personal incentive (personal strength insights visible only to the employee first).

**Benchmark:** DoorDash — 3,800+ accounting processes indexed in 14 weeks. SOPs generated within 15 min of each video submission.

---

### 2. Varos Research — "AI Business Analyst"

**What they are:** YC S21. $8.5M raised. Their agent "Arthur" conducts structured voice interviews at scale. Positioned as $50K–$100K replacement for $1M consulting discovery engagements.

**Feature tree:**

| Capability | Detail |
|---|---|
| Arthur interview agent | Voice or text, async, 24/7. Multilingual, live language switching. |
| "Next best question" algo | Dynamically generates follow-ups from full project context — not a static script. **Key differentiator.** |
| Conflict detection | Surfaces contradictions between interviewees explicitly. |
| Org-chart traversal | Asks "who else should I speak to?" and follows referrals. |
| Goal-anchored | Always returns to defined project scope. End-of-interview summary for validation. |
| Coverage tracking | What's known, what gaps remain, follow-up queue. |
| Follow-up scheduling | Arthur identifies insufficient depth and re-invites. |
| Knowledge base | All transcripts with lineage (finding → observation → transcript). Queryable post-project. |
| Output | Format agnostic: JIRA tickets, BRDs, SOPs, exec summaries, custom templates. |

**Scale proven:** 7,000 interviews on one project. 120 employees in 72 hours (financial services ERP). 200-person service center in 7 hours of operator time over 2 weeks.  
**Pricing:** Not public, sales-led. No integrations confirmed.

---

### 3. Ontora — "Read Your Company Like a Book"

**What they are:** YC Spring 2026. SF-based. Very early. One confirmed customer (Vertix, Strategy Manager). German founding team (referenced by Christian in the Klarity call).

**Feature tree:**

| Capability | Detail |
|---|---|
| Parallel interview engine | Interviews every employee simultaneously. Adaptive follow-up. "Insights within 24 hours." |
| Knowledge graph | Living picture across people, systems, workflows. Queryable. |
| Output | Themed findings with impact ratings · Executive summary · Visual process maps · Automation roadmap with ROI estimates |
| MCP server | Exposes knowledge graph to Claude, Cursor, ChatGPT, internal tools. **Differentiator.** |
| REST API | Build task-specific agents over company context. |

**Pricing:** ~$50K per engagement.  
**Integrations confirmed:** Glean, Celonis, Snowflake, Databricks, n8n, Microsoft Copilot, GitHub Copilot, MCP.

---

### 4. Flowscope — "AI-Native Consulting"

**What they are:** YC Spring 2026. SF-based. Ex-McKinsey/QuantumBlack founders. Pure behavioral observation — no interviews.

**Feature tree:**

| Capability | Detail |
|---|---|
| Endpoint agent | Records every click, paste, system write on employee machines. ~2 week observation window. |
| Modal path detection | Derives the canonical process path from the event stream — not from what people say. |
| Cross-user handoff detection | Observes which user touches which document next — captures real handoffs. **Differentiator.** |
| Exception detection | Surfaces deviations from modal path. |
| Continuous live-updating | Same agent stays running after initial map — tracks process drift. |
| Reengineer-before-automate | Explicit redesign step before automation. *"Don't pave cow paths."* **Differentiator.** |
| Automation execution | Agents that read/write from systems of record above existing systems. |

**Delivery model:** Done-for-you consulting, not self-serve SaaS.  
**Pricing:** Not public.

---

## Cross-company comparison

### Capture modality

| | Interview | Passive observation | Doc ingestion |
|---|---|---|---|
| Klarity | ✓ voice + screen | ✓ screen (no install) | ✓ |
| Varos | ✓ voice/text, any scale | — | — |
| Ontora | ✓ parallel all employees | — | — |
| Flowscope | — | ✓ endpoint agent | — |
| **Beam POC** | **✓ voice + screen** | **—** | **—** |

**Core tension:** Interviews capture *why* and tacit knowledge. Observation captures *what actually happens* (including workarounds people don't mention). Only Klarity does both — and charges the most.

### Feature comparison

| Capability | Klarity | Varos | Ontora | Flowscope | Beam POC |
|---|---|---|---|---|---|
| AI interview agent | ✓ | ✓ | ✓ | — | ✓ |
| Screen observation | ✓ passive | — | — | ✓ endpoint | ✓ screen-share |
| Real-time flowchart | — | — | — | — | **✓** |
| Per-node confidence | — | — | — | — | **✓** |
| "Next best question" | — | **✓ key diff** | ✓ | — | basic |
| Conflict detection | — | **✓** | ✓ | — | — |
| Org-chart traversal | — | **✓** | ✓ | — | — |
| Cross-user handoffs | — | — | — | **✓** | — |
| Continuous live update | — | — | — | **✓** | — |
| MCP / API on graph | — | — | **✓** | — | — |
| **Agent spec output** | **—** | **—** | **—** | **—** | **← build this** |
| **Discovery → agent pipeline** | **—** | **—** | **—** | **—** | **← unique to Beam** |
| Inside your platform | standalone | standalone | standalone + MCP | consulting | ✓ Prism |

---

## White space — what nobody does

1. **Discovery output that directly seeds agent configuration.** All four stop at the process map. None translate it into an agent spec, prompt structure, or workflow blueprint. **This is Beam's unique position — you build both the discovery tool and the automation agents.**

2. **Governance as a first-class output layer.** Who approves each step? What's audit-relevant? Where does escalation go? Klarity produces SOX narratives, but no one generates a structured governance schema baked into the process model — critical for financial services.

3. **Closed-loop: discovery → agent → performance → re-discovery trigger.** Flowscope keeps the agent running to track drift. But no one closes the full loop: running agent performance feeds back into the discovery model to flag when a process has changed enough to trigger re-interview.

4. **Role-level process variation as structured output.** Nobody produces a formal multi-persona model ("role A does it this way, role B does it that way, here's the reconciled canonical flow") — exactly what's needed to configure multi-agent handoff flows.

---

## Design implications for our hackathon build

1. **Interview-first is right.** Lower friction than endpoint agents, captures tacit knowledge, proven at scale. Our POC already does this.

2. **The IP is not just the interview — it's the output schema.** Define a canonical Process Schema as the core data model: `{ steps[], actors[], decisions[], systems[], exceptions[], handoffs[], approval_authorities[], KPIs[], automation_candidates[] }`. Every capture mode populates this. From it you generate both human-readable output AND agent blueprints.

3. **Add an explicit "agent spec" step.** Flowchart → proposed agent spec → human review → Beam agent. This is the story closer no competitor can match.

4. **Frame interview-initiated as a deliberate product choice vs. passive observation.** User-initiated = privacy-friendly (GDPR), intent-capturing, higher-quality output. Passive = lower friction but cold-start problem + legal complexity in Germany/Europe.

5. **Beam's moat: discovery → agent is one pipeline.** Every competitor ends at the map. Beam starts there. Position discovery not as a standalone product but as "the onboarding phase of your agent deployment."

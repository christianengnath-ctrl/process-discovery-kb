# Process Discovery Agent — Team Knowledge Base

**Beam AI Hackathon · Team 02**  
Lead: Christian Engnath · Team: Lucas, Sara, Hussain, Aqib (sparring)  
Demo: Friday 22 May 2026 · 12:00 CET

---

## What this repo is

Everything the team needs to build, scope, and demo the Process Discovery Agent by Friday.  
One place. No duplicates. Updated as we learn.

---

## Navigation

| Folder | What's inside |
|--------|---------------|
| [`01-what-we-have/`](01-what-we-have/) | Analysis of Aqib's POC — what's built, what's missing |
| [`02-competitive-intelligence/`](02-competitive-intelligence/) | Full competitor analysis + Klarity call transcript + insights |
| [`03-kickoff-brief/`](03-kickoff-brief/) | Team kickoff brief, scope of work, 4 parallel streams |
| [`04-insights-and-decisions/`](04-insights-and-decisions/) | Synthesized insights, key decisions, what we're building and why |

---

## The one-sentence brief

> An agent that interviews a client employee (via voice/text + screen share), builds a live flowchart of their process as they talk, then outputs a structured agent spec — all inside Prism.  
> **No competitor does the last step. That's our moat.**

---

## Demo target (Friday 5 min)

1. User types: *"I want to automate refund request handling"*
2. Starts interview with Arthur → 3-min conversation, screen sharing Gmail inbox
3. Flowchart builds live, per-node confidence scores appear
4. Interview ends → "Generate agent spec" → structured Beam agent blueprint appears
5. Presenter: *"Every competitor stops at step 3. We start there."*

---

## Critical path

```
Stream 1 (Lucas)     → Prism extension shell           Wed 17:00 – Thu noon
Stream 2 (Sara+Hussain) → Interview agent + flowchart  Thu all day
Stream 3 (Lucas)     → Agent spec generator            Thu afternoon
Stream 4 (Christian) → Demo script + polish            Thu afternoon – Fri morning
```

---

## Key contacts / references

- Aqib's POC: see `01-what-we-have/poc-video-analysis.md`
- Klarity call recording + transcript: see `02-competitive-intelligence/klarity-call-transcript-and-insights.md`
- Competitor comparison table: see `02-competitive-intelligence/competitive-synthesis.md`
- Hackathon handbook repo: `beam-hackathon`

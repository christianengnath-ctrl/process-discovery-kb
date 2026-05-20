# Aqib's POC — What's Already Built

*Source: Screen recording analysis of "Built-in Retina Display.mp4" (5:04, recorded ~May 2026)*  
*Analysed: Wed 20 May 2026*

---

## What it is

**Beam Discovery** — a weekend prototype. An AI Solution Engineer named **Arthur** that conducts a structured video interview (voice + screen share) with a client employee, builds a live flowchart of the process as they talk, and tracks confidence per step.

The demo scenario used throughout: **Refund processing at cubitbeam.ai** — Arthur walks through how customer refund emails are handled, building the flowchart in real time.

---

## Screens / features built

### Discovery landing page
- Headline: *"What do you want to automate?"*
- Free-text input + preset suggestion chips: *Approve vendor invoices · Triage support emails · Onboard new vendors · Issue portal refunds*
- **"Continue working on"** list of in-progress projects, each showing:
  - Project name
  - Last session timestamp + session count
  - % understood progress bar
  - Preview of original automation request

**5 projects shown in demo:** Refund processing (76%), Invoice approval (78%), Email triage (65%), Vendor onboarding (45%), Audit logging (30%)

### Project view (main workspace)
Split layout:
- **Left:** Live flowchart canvas — pan/zoom, click any node to see Arthur's notes
- **Right:** Structured chat log with Arthur, turn labels: `LOGGING` / `MIRRORING` / `REFLECTING` / `DECISION DETECTED`
- **Header:** Project name · % understood · open gaps count · "Start interview" button · "Push to Beam" CTA

### Flowchart renderer
- Node types: rounded pill (start/end), rectangle (process step), diamond (decision)
- Per-node confidence chip (e.g. 85%, 75%)
- Solid border = confident, dashed border = uncertain/low-confidence
- Real-time update as Arthur captures each turn
- Pan + zoom, clickable for detail

### Interview / video call mode
- **"Start conversation" modal** → mic + screen-share permissions granted
- **Floating overlay during call:**
  - Live *"What I've understood"* checklist (items tick as Arthur captures them)
  - *Live stats* panel: Steps · Decisions · Confident X/Y · Open gaps · Avg confidence %
  - Arthur's current question shown + listening indicator
  - "End" button

### Arthur interview agent
- Voice + text input
- Screen-share observation: Arthur can see the screen and reference what's visible (confirmed in demo: "I can see your screen — it looks like you're on a GitHub repo page")
- Structured question generation (adapts based on conversation, not a static script)
- Labeled reasoning turns (LOGGING / MIRRORING / REFLECTING / DECISION DETECTED)
- Confidence tracking per node, updates as more detail is confirmed

---

## The refund processing flowchart captured in the demo

```
[Customer email arrives]
        ↓
[Validate order] (85%)
        ↓
  <Eligible?> (highlighted gap)
   NO ↓        YES ↓
[Send rejection] (75%)   <Amount > ~$500?>
[End]            NO ↓           YES ↓
          [Auto-approve] (75%)  [Manager approval] (40%, dashed/uncertain)
                    ↓                   ↓
               [Issue refund] (75%)
```

**Decision rules captured:**
- Order must be under 90 days old, customer must not have multiple recent refunds
- Under $500 → auto-approve
- Over $500 → manager approval (rotating: 3 finance leads on weekly schedule)

---

## What is NOT built yet

| Gap | Why it matters |
|-----|----------------|
| **No agent spec output** | The brief says "flowchart + agent spec out" — the flowchart exists, nothing converts it to a deployable agent definition. This is our moat to build. |
| **"Push to Beam" is not wired** | Button exists in UI, not functional |
| **Not a Prism extension** | Runs as a standalone app — needs to be wrapped as an extension to demo in Prism |
| **No export** | Flowchart can't be exported as PNG, Visio, or structured JSON |
| **No persistent multi-session memory** | Projects listed but unclear if sessions truly persist across app restarts |
| **No conflict detection** | If two employees describe the same process differently, the system doesn't surface the contradiction |

---

## Key open question before building

> **Is the POC structured as a Prism extension, or a standalone Next.js/React app?**  
> Aqib answers this — it changes Stream 1 scope significantly.  
> If standalone: ~4-6h to wrap as extension. If already extension-shaped: ~1-2h.

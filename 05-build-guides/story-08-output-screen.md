# Story 08 — Outputs Screen

**Screen:** `Outputs`
**Route:** `/projects/:id/outputs`
**File:** `src/screens/Outputs.jsx`
**Status:** Exists — verify it matches this spec exactly, fix any gaps

---

## What this screen does

The final deliverable screen. After a discovery interview is complete, this screen presents four ready-to-use artefacts: an automation-classified process flowchart, a SIPOC table, a structured SOP document, and the full interview transcript. Each artefact lives on its own tab. The user can copy any tab's content to the clipboard with a single button. This is the screen a consultant hands off to a client or uses internally to brief an automation team.

---

## Technical anatomy

### File location
```
src/
  screens/
    Outputs.jsx      ← this story
  store.js
  App.jsx            ← route already registered here
```

### Route registration (already in App.jsx — do not change)
```jsx
<Route path="/projects/:id/outputs" element={<Outputs />} />
```

### Imports required
```jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { useStore } from '../store';
```

---

## Demo data constants (hardcoded — top of file, no props)

All output content is static demo data. There is no fetching, no async state, and no generation trigger.

### CLASS_COLOR lookup
```js
const CLASS_COLOR = {
  Deterministic: { stripe: 'var(--beam-blue-300)',   text: 'var(--beam-blue-200)' },
  Agentic:       { stripe: 'rgb(200,130,255)',        text: 'rgb(220,180,255)' },
  'RPA Bridge':  { stripe: 'var(--beam-green-soft)', text: 'var(--beam-green-soft)' },
};
```

### NODES — 6 flowchart steps
```js
const NODES = [
  { name: 'Intake form submitted',   actor: 'Client portal',   kind: 'Deterministic', conf: 96, x: 12,  y: 52,  w: 188, h: 88 },
  { name: 'Auto-classify request',   actor: 'Triage AI',       kind: 'Agentic',       conf: 88, x: 228, y: 52,  w: 188, h: 88 },
  { name: 'Pull patient records',    actor: 'EHR connector',   kind: 'RPA Bridge',    conf: 72, x: 444, y: 0,   w: 188, h: 88 },
  { name: 'Clinical reviewer check', actor: 'Reviewer',        kind: 'Agentic',       conf: 81, x: 444, y: 116, w: 188, h: 88 },
  { name: 'Decision & notification', actor: 'Comms agent',     kind: 'Agentic',       conf: 78, x: 660, y: 52,  w: 188, h: 88 },
  { name: 'Log audit trail',         actor: 'Compliance',      kind: 'Deterministic', conf: 95, x: 876, y: 52,  w: 188, h: 88 },
];
```

### SIPOC_ROWS — 5 rows
```js
const SIPOC_ROWS = [
  ['Referring physician', 'Auth request form',  'Intake → classify', 'Routed ticket',      'Triage AI'],
  ['Patient',             'Insurance details',  'Auto-classify',     'Tier assignment',    'Clinical reviewer'],
  ['EHR system',          'Patient record',     'Pull records',      'Bundled record set', 'Clinical reviewer'],
  ['Clinical reviewer',   'Bundled record set', 'Decision & notify', 'Approval / denial',  'Patient · Physician'],
  ['Comms agent',         'Decision payload',   'Send notifications','Email · SMS',        'Patient · Physician'],
];
```

### SOP_SECTIONS — 7 sections
```js
const SOP_SECTIONS = [
  { h: '1. Purpose',    body: 'Standardize how refund requests are processed from intake through resolution, ensuring auditability and consistent turnaround.' },
  { h: '2. Scope',      body: 'Applies to all refund requests submitted via the customer portal or by phone/email and routed to the AP team.' },
  { h: '3. Roles',      body: 'AP Clerk (logging), AP Manager (approval for amounts >$500), Finance (payout), Comms (customer notification).' },
  { h: '4. Steps',      body: '4.1 Request received via email/portal · 4.2 AP Clerk logs in SAP · 4.3 Confirmation sent to customer · 4.4 AP Manager reviews if >$500 · 4.5 Approved → Finance initiates payout · 4.6 Payout processed within 3–5 business days · 4.7 Customer notified.' },
  { h: '5. Exceptions', body: 'Amounts >$2,000 require VP sign-off. Duplicate requests are flagged and held pending review. Missing invoice → request returned to sender.' },
  { h: '6. Systems',    body: 'SAP (logging + payout) · Email (comms) · Customer portal · Finance reporting dashboard.' },
  { h: '7. Approvals',  body: 'Process owner: AP Manager. Reviewed quarterly.' },
];
```

### TRANSCRIPT_TURNS — 11 turns
```js
const TRANSCRIPT_TURNS = [
  { speaker: 'Timmy',       text: "Hi, I'm Timmy from Beam AI. I'm here to learn about your refund request process. Can you walk me through what happens from the moment a refund request comes in?", ts: '0:00' },
  { speaker: 'Interviewee', text: "Sure. So a customer submits a refund request either via our portal or by calling in. Our AP clerk logs it into SAP and we send an acknowledgement email.", ts: '0:18' },
  { speaker: 'Timmy',       text: "Got it. Who reviews the request after it's logged, and is there a threshold where different people need to get involved?", ts: '0:42' },
  { speaker: 'Interviewee', text: "Yeah, anything under five hundred dollars the AP clerk can approve directly. Over five hundred it goes to the AP Manager. And if it's over two thousand we need VP sign-off.", ts: '0:55' },
  { speaker: 'Timmy',       text: "Understood. What systems are involved in processing the payout once it's approved?", ts: '1:28' },
  { speaker: 'Interviewee', text: "SAP handles both the logging and the payout. Finance uses the reporting dashboard to track outstanding refunds. Customer gets notified by email when the payout is done.", ts: '1:38' },
  { speaker: 'Timmy',       text: "Are there any common exceptions or edge cases that slow things down?", ts: '2:10' },
  { speaker: 'Interviewee', text: "Duplicates are the main one — we have to hold those pending review. Missing invoice is another common one. And anything with a disputed amount usually needs extra back-and-forth with the customer.", ts: '2:18' },
  { speaker: 'Timmy',       text: "That's really helpful. Last question — who owns this process and how often is it reviewed?", ts: '2:52' },
  { speaker: 'Interviewee', text: "AP Manager is the process owner. We review the SOP quarterly or whenever there's a major system change.", ts: '3:02' },
  { speaker: 'Timmy',       text: "Perfect. I think I have what I need. Thank you for your time — this gives us a solid base to build the automation.", ts: '3:14' },
];
```

---

## Data contract

The screen reads one project from the Zustand store using the `:id` URL param.

```jsx
const { id } = useParams();
const { projects } = useStore();
const project = projects.find(p => p.id === id);
```

If no matching project is found, redirect immediately to `/` and return null:
```jsx
if (!project) { navigate('/'); return null; }
```

Fields used on this screen: `project.clientName`, `project.processName` (for the nav breadcrumb only). No other project fields are read — all output content is hardcoded demo data.

---

## Local state

```jsx
const [tab, setTab] = useState('flowchart');
```

One piece of local state: the active tab id. Default is `'flowchart'`. Tab switching is instant — no loading, no async.

---

## Tabs array (exact, in order)

```js
const tabs = [
  { id: 'flowchart',  label: 'Flowchart',  sub: 'Process map' },
  { id: 'sipoc',      label: 'SIPOC',      sub: 'Share with client' },
  { id: 'sop',        label: 'SOP',        sub: "Client's records" },
  { id: 'transcript', label: 'Transcript', sub: 'Full interview' },
];
```

---

## Top-level layout

```
AppNav (crumbs: ['Process Discovery', `${project.clientName} · ${project.processName}`, 'Outputs'])
output-tabs-bar
  ├── Left: tab buttons (mapped from tabs array)
  └── Right: "⧉ Copy" button + "← Projects" button
screen-body (padding: '28px 32px 40px')
  └── Active tab content (one of four views)
```

The `output-tabs-bar` sits **above** `screen-body` and is rendered before it in the JSX. Do not render tabs inside `screen-body`.

---

## Output tabs bar spec (class `output-tabs-bar`)

```jsx
<div className="output-tabs-bar">
  <div className="row" style={{ gap: 0 }}>
    {tabs.map(t => (
      <button
        key={t.id}
        className={`output-tab ${tab === t.id ? 'active' : ''}`}
        onClick={() => setTab(t.id)}
      >
        <div>{t.label}</div>
        <div className="output-tab-sub">{t.sub}</div>
      </button>
    ))}
  </div>
  <div className="row gap-8" style={{ alignItems: 'center' }}>
    <button className="btn sm" onClick={copyTab}>⧉ Copy</button>
    <button className="btn ghost sm" onClick={() => navigate('/')}>← Projects</button>
  </div>
</div>
```

Rules:
- Tab buttons: class `output-tab` plus `active` when the tab id matches `tab` state.
- Each tab button contains exactly two `<div>` children: label text, then sub-label text (class `output-tab-sub`).
- The gap between tab buttons is `0` (they sit flush against each other).
- "⧉ Copy" calls `copyTab()`. Class `btn sm`.
- "← Projects" navigates to `'/'`. Class `btn ghost sm`.

---

## Screen body

```jsx
<div className="screen-body" style={{ padding: '28px 32px 40px' }}>
  {tab === 'flowchart'  && <FlowchartView />}
  {tab === 'sipoc'      && <SipocView />}
  {tab === 'sop'        && <SopView />}
  {tab === 'transcript' && <TranscriptView />}
</div>
```

The padding `'28px 32px 40px'` is non-default and must be set inline. Do not use the default `screen-body` padding for this screen.

---

## Copy function — getContent() and copyTab()

`getContent()` returns a plain-text string representing the active tab's content. It is called only by `copyTab()`.

```jsx
function getContent() {
  if (tab === 'flowchart') {
    return NODES.map(n => `${n.name} (${n.actor}) — ${n.kind} ${n.conf}%`).join('\n');
  }
  if (tab === 'sipoc') {
    return ['Suppliers\tInputs\tProcess\tOutputs\tCustomers',
      ...SIPOC_ROWS.map(r => r.join('\t'))].join('\n');
  }
  if (tab === 'sop') {
    return SOP_SECTIONS.map(s => `${s.h}\n${s.body}`).join('\n\n');
  }
  return TRANSCRIPT_TURNS.map(t => `[${t.ts}] ${t.speaker}: ${t.text}`).join('\n\n');
}

function copyTab() {
  navigator.clipboard.writeText(getContent()).catch(() => {});
}
```

Format rules per tab:
- **flowchart:** One line per node: `Step name (Actor) — Kind conf%`. Lines joined with `\n`.
- **sipoc:** First line is the TSV header `Suppliers\tInputs\tProcess\tOutputs\tCustomers`. Each data row is its five cells joined with `\t`. All lines joined with `\n`.
- **sop:** Each section is `heading\nbody`. Sections separated by `\n\n` (blank line between them).
- **transcript:** Each turn is `[ts] Speaker: text`. Turns separated by `\n\n` (blank line between turns).

The `.catch(() => {})` swallows clipboard errors silently — no error UI.

---

## FlowNode sub-component

Positioned absolutely within `.flow-canvas`. Props: `name`, `actor`, `kind`, `conf`, `x`, `y`, `w`, `h`.

```jsx
function FlowNode({ name, actor, kind, conf, x, y, w, h }) {
  const c = CLASS_COLOR[kind];
  return (
    <div className="flow-node" style={{ left: x, top: y, width: w, height: h }}>
      <div className="flow-node-stripe" style={{ background: c.stripe }} />
      <div>
        <div className="flow-node-kind" style={{ color: c.text }}>{kind}</div>
        <div className="flow-node-name">{name}</div>
      </div>
      <div className="flow-node-footer">
        <span className="flow-node-actor">{actor}</span>
        <span className="flow-node-conf">{conf}%</span>
      </div>
    </div>
  );
}
```

Color is read from `CLASS_COLOR[kind]`:
- `stripe` drives the `background` of `.flow-node-stripe` (the left colored bar).
- `text` drives the `color` of `.flow-node-kind` (the classification label).

The footer shows actor name (left) and confidence percentage (right, as `{conf}%`).

---

## FlowchartView sub-component

### Header row
```
"Refund request handling — process map"     font-size 17, fontWeight 500
"6 steps · 5 actors · classified by automation strategy"    muted, font-size 13
```
These are rendered as two stacked elements in the header row, left-aligned.

### Color legend (top-right, same header row)
Three entries from `CLASS_COLOR`, each rendered as:
- A 14×4 px stripe swatch colored with `c.stripe`
- A label text for the kind name

```jsx
{Object.entries(CLASS_COLOR).map(([kind, c]) => (
  <div key={kind} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ width: 14, height: 4, borderRadius: 2, background: c.stripe }} />
    <span style={{ fontSize: 12, color: 'var(--fg-on-dark-3)' }}>{kind}</span>
  </div>
))}
```

### Canvas (class `flow-canvas`)
- `position: relative`
- `overflow-x: auto`
- Dot-grid SVG background (subtle, `opacity: 0.4`)
- SVG `<line>` arrows connecting nodes in order (25% white, `opacity: 0.25` or similar)
- 6 `<FlowNode>` components positioned absolutely using each node's `x`, `y`, `w`, `h` props

### Below-canvas panel row
Two cards rendered side by side below the canvas:

**Left card (flex: 1 / grow):** "Selected step" panel
- Heading: "Selected step"
- Shows hardcoded AP Manager approval step details (demo copy)
- Fields: Step name, Actor, Kind badge, Confidence score, Notes about threshold

**Right card (width: 260px):** "Coverage" panel
- Large monospace number: `72%`
- Explanation text below (muted): describes what the coverage percentage means

---

## SipocView sub-component

### Header
```
"SIPOC — Refund request handling"                     font-size 17, fontWeight 500
"Share this with the client to confirm scope before agent build."   muted, font-size 13
```

### Table
Wrapped in a card with `padding: 0, overflow: hidden`. Table class: `sipoc-table`.

| Column | Header label |
|---|---|
| 1 | Suppliers |
| 2 | Inputs |
| 3 | Process |
| 4 | Outputs |
| 5 | Customers |

Data rows come from `SIPOC_ROWS` (5 rows). Each row is mapped from the array — `row[0]` through `row[4]` map to the five columns in order.

---

## SopView sub-component

### Header row (space-between)
Left side:
```
"SOP — Refund request handling"                                          font-size 17, fontWeight 500
"Draft v1.0 · auto-generated from interview · ready for client review"  muted, font-size 13
```
Right side (chip):
```jsx
<span className="chip">
  <span className="dot" />
  7 sections
</span>
```

### Content card
- `padding` — default card padding
- `maxHeight: 460`
- `overflowY: auto`

Inside the card:

**Document heading block** (at top of card):
- `"Refund request handling"` — font-size 20, fontWeight 500
- `"Acme Logistics · Standard Operating Procedure"` — uppercase, font-size 11, muted, `letterSpacing: '0.1em'`

**Section list:** 7 `sop-section` divs mapped from `SOP_SECTIONS`:
```jsx
{SOP_SECTIONS.map(s => (
  <div key={s.h} className="sop-section">
    <h3>{s.h}</h3>
    <p>{s.body}</p>
  </div>
))}
```

---

## TranscriptView sub-component

### Header row (space-between)
Left side:
```
"Interview transcript — Refund request handling"   font-size 17, fontWeight 500
"Auto-transcribed · 11 turns · 3 min 14 sec"      muted, font-size 13
```
Right side (chip with green dot):
```jsx
<span className="chip">
  <span className="dot" style={{ background: 'var(--beam-green)' }} />
  Complete
</span>
```

### Content card
- `padding` — default card padding
- `maxHeight: 480`
- `overflowY: auto`

**Turn list:** 11 `transcript-turn` rows mapped from `TRANSCRIPT_TURNS`:
```jsx
{TRANSCRIPT_TURNS.map((turn, i) => (
  <div key={i} className="transcript-turn">
    <div className="transcript-turn-meta">
      <span className={`transcript-turn-speaker ${turn.speaker === 'Timmy' ? 'timmy' : 'interviewee'}`}>
        {turn.speaker}
      </span>
      <span className="transcript-turn-ts">{turn.ts}</span>
    </div>
    <div className="transcript-turn-text">{turn.text}</div>
  </div>
))}
```

### Speaker color rules
- `.transcript-turn-speaker.timmy` → `color: var(--beam-blue-300)`
- `.transcript-turn-speaker.interviewee` → `color: var(--beam-green-soft)`

The `.timmy` / `.interviewee` modifier classes must be in `index.css`. The conditional class is applied inline in the JSX as shown above.

---

## CSS classes (already in index.css — do not redefine)

| Class | Purpose |
|---|---|
| `.output-tabs-bar` | Sticky bar above screen-body, full-width, flex row space-between |
| `.output-tab` | Tab button; contains label div + sub div |
| `.output-tab.active` | Active tab highlight state |
| `.output-tab-sub` | Muted sub-label inside each tab button |
| `.flow-canvas` | Relative-positioned container for the flowchart; overflow-x auto |
| `.flow-node` | Absolutely positioned node card within the canvas |
| `.flow-node-stripe` | Left-edge colored stripe inside a node |
| `.flow-node-kind` | Classification label (Deterministic / Agentic / RPA Bridge) |
| `.flow-node-name` | Step name text |
| `.flow-node-footer` | Bottom row of a node (actor + confidence) |
| `.flow-node-actor` | Actor name in node footer |
| `.flow-node-conf` | Confidence percentage in node footer |
| `.sipoc-table` | Styled HTML `<table>` |
| `.sop-section` | Section div containing `<h3>` and `<p>` |
| `.transcript-turn` | Flex row for one transcript turn |
| `.transcript-turn-meta` | 90 px fixed-width left column (speaker + timestamp) |
| `.transcript-turn-speaker` | Speaker name span |
| `.transcript-turn-speaker.timmy` | Blue color for Timmy turns |
| `.transcript-turn-speaker.interviewee` | Green-soft color for interviewee turns |
| `.transcript-turn-ts` | Timestamp span in meta column |
| `.transcript-turn-text` | Turn body text |

---

## Exact copy (all user-visible strings)

| Location | String |
|---|---|
| Nav breadcrumb [0] | `Process Discovery` |
| Nav breadcrumb [1] | `${project.clientName} · ${project.processName}` (interpolated) |
| Nav breadcrumb [2] | `Outputs` |
| Tab 1 label | `Flowchart` |
| Tab 1 sub | `Process map` |
| Tab 2 label | `SIPOC` |
| Tab 2 sub | `Share with client` |
| Tab 3 label | `SOP` |
| Tab 3 sub | `Client's records` |
| Tab 4 label | `Transcript` |
| Tab 4 sub | `Full interview` |
| Copy button | `⧉ Copy` |
| Back button | `← Projects` |
| Flowchart title | `Refund request handling — process map` |
| Flowchart sub | `6 steps · 5 actors · classified by automation strategy` |
| SIPOC title | `SIPOC — Refund request handling` |
| SIPOC sub | `Share this with the client to confirm scope before agent build.` |
| SIPOC col 1 | `Suppliers` |
| SIPOC col 2 | `Inputs` |
| SIPOC col 3 | `Process` |
| SIPOC col 4 | `Outputs` |
| SIPOC col 5 | `Customers` |
| SOP title | `SOP — Refund request handling` |
| SOP sub | `Draft v1.0 · auto-generated from interview · ready for client review` |
| SOP chip | `7 sections` |
| SOP doc heading | `Refund request handling` |
| SOP doc sub | `Acme Logistics · Standard Operating Procedure` |
| Transcript title | `Interview transcript — Refund request handling` |
| Transcript sub | `Auto-transcribed · 11 turns · 3 min 14 sec` |
| Transcript chip | `Complete` |

---

## Full component skeleton

```jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { useStore } from '../store';

// ── DEMO DATA ─────────────────────────────────────────────────────────────────

const CLASS_COLOR = { /* ... see Data contract */ };
const NODES = [ /* 6 entries */ ];
const SIPOC_ROWS = [ /* 5 rows */ ];
const SOP_SECTIONS = [ /* 7 sections */ ];
const TRANSCRIPT_TURNS = [ /* 11 turns */ ];

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function FlowNode({ name, actor, kind, conf, x, y, w, h }) {
  const c = CLASS_COLOR[kind];
  return (
    <div className="flow-node" style={{ left: x, top: y, width: w, height: h }}>
      <div className="flow-node-stripe" style={{ background: c.stripe }} />
      <div>
        <div className="flow-node-kind" style={{ color: c.text }}>{kind}</div>
        <div className="flow-node-name">{name}</div>
      </div>
      <div className="flow-node-footer">
        <span className="flow-node-actor">{actor}</span>
        <span className="flow-node-conf">{conf}%</span>
      </div>
    </div>
  );
}

function FlowchartView() {
  return (
    <div>
      {/* Header row: title/sub left, legend right */}
      {/* .flow-canvas with SVG arrows + 6 FlowNode components */}
      {/* Below-canvas: "Selected step" card (grow) + "Coverage" card (w:260) */}
    </div>
  );
}

function SipocView() {
  return (
    <div>
      {/* Title + sub */}
      {/* card (padding:0, overflow:hidden) containing .sipoc-table */}
    </div>
  );
}

function SopView() {
  return (
    <div>
      {/* Header row: title/sub left, "7 sections" chip right */}
      {/* card (maxHeight:460, overflowY:auto):
            doc heading + sub
            7 .sop-section divs */}
    </div>
  );
}

function TranscriptView() {
  return (
    <div>
      {/* Header row: title/sub left, "Complete" chip (green dot) right */}
      {/* card (maxHeight:480, overflowY:auto):
            11 .transcript-turn rows */}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function Outputs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects } = useStore();
  const project = projects.find(p => p.id === id);
  const [tab, setTab] = useState('flowchart');

  if (!project) { navigate('/'); return null; }

  const tabs = [
    { id: 'flowchart',  label: 'Flowchart',  sub: 'Process map' },
    { id: 'sipoc',      label: 'SIPOC',      sub: 'Share with client' },
    { id: 'sop',        label: 'SOP',        sub: "Client's records" },
    { id: 'transcript', label: 'Transcript', sub: 'Full interview' },
  ];

  function getContent() {
    if (tab === 'flowchart') {
      return NODES.map(n => `${n.name} (${n.actor}) — ${n.kind} ${n.conf}%`).join('\n');
    }
    if (tab === 'sipoc') {
      return ['Suppliers\tInputs\tProcess\tOutputs\tCustomers',
        ...SIPOC_ROWS.map(r => r.join('\t'))].join('\n');
    }
    if (tab === 'sop') {
      return SOP_SECTIONS.map(s => `${s.h}\n${s.body}`).join('\n\n');
    }
    return TRANSCRIPT_TURNS.map(t => `[${t.ts}] ${t.speaker}: ${t.text}`).join('\n\n');
  }

  function copyTab() {
    navigator.clipboard.writeText(getContent()).catch(() => {});
  }

  return (
    <div className="app-shell">
      <AppNav crumbs={['Process Discovery', `${project.clientName} · ${project.processName}`, 'Outputs']} />

      <div className="output-tabs-bar">
        <div className="row" style={{ gap: 0 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`output-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <div>{t.label}</div>
              <div className="output-tab-sub">{t.sub}</div>
            </button>
          ))}
        </div>
        <div className="row gap-8" style={{ alignItems: 'center' }}>
          <button className="btn sm" onClick={copyTab}>⧉ Copy</button>
          <button className="btn ghost sm" onClick={() => navigate('/')}>← Projects</button>
        </div>
      </div>

      <div className="screen-body" style={{ padding: '28px 32px 40px' }}>
        {tab === 'flowchart'  && <FlowchartView />}
        {tab === 'sipoc'      && <SipocView />}
        {tab === 'sop'        && <SopView />}
        {tab === 'transcript' && <TranscriptView />}
      </div>
    </div>
  );
}
```

---

## Definition of Done

### Routing
- [ ] Navigating to `/projects/:id/outputs` with a valid id renders the Outputs screen
- [ ] If no project matches the id, the screen calls `navigate('/')` and returns null immediately

### Tabs bar
- [ ] Four tab buttons render in the correct order: Flowchart, SIPOC, SOP, Transcript
- [ ] Each tab button shows both its label and its sub-label
- [ ] The active tab has the `active` CSS class; inactive tabs do not
- [ ] Clicking a tab updates `tab` state and switches content instantly (no animation, no loading)
- [ ] "⧉ Copy" button is always visible regardless of active tab
- [ ] "← Projects" button always navigates to `/`

### Breadcrumb
- [ ] Three crumbs render: "Process Discovery", the interpolated client and process name, "Outputs"
- [ ] The client and process name crumb reads live from the matched project in the store

### Copy function
- [ ] Flowchart copy: one line per node in `Step name (Actor) — Kind conf%` format
- [ ] SIPOC copy: TSV with header row first, then 5 data rows
- [ ] SOP copy: heading + newline + body for each section, sections separated by blank lines
- [ ] Transcript copy: `[ts] Speaker: text` per turn, blank line between turns
- [ ] Clipboard errors are silently swallowed — no toast, no error message

### Flowchart tab
- [ ] Header shows title at 17px/500 weight and sub at 13px/muted
- [ ] Color legend shows all three classification types with correct stripe colors
- [ ] `.flow-canvas` renders with dot-grid SVG background
- [ ] All 6 FlowNode components render at their specified x/y/w/h positions
- [ ] Each node shows: kind label (colored), step name, actor (left footer), confidence % (right footer)
- [ ] Left stripe color and kind text color match `CLASS_COLOR[kind]`
- [ ] SVG arrows connect nodes in sequence
- [ ] "Selected step" panel and "Coverage" panel render below the canvas

### SIPOC tab
- [ ] Title and muted sub render above the table
- [ ] Table has 5 columns with correct header labels
- [ ] All 5 data rows render from `SIPOC_ROWS`
- [ ] Table is wrapped in a card with `padding: 0, overflow: hidden`

### SOP tab
- [ ] Header shows title, muted sub, and "7 sections" chip (right-aligned)
- [ ] Document heading "Refund request handling" at 20px/500
- [ ] Sub heading "Acme Logistics · Standard Operating Procedure" in uppercase, 11px, muted, letterSpacing 0.1em
- [ ] All 7 sop-section divs render with `<h3>` and `<p>` children
- [ ] Content area has `maxHeight: 460` and `overflowY: auto`

### Transcript tab
- [ ] Header shows title, muted sub, and "Complete" chip with green dot (right-aligned)
- [ ] All 11 transcript turns render in order
- [ ] Timmy turns get class `.timmy` (blue color)
- [ ] Interviewee turns get class `.interviewee` (green-soft color)
- [ ] Each turn shows speaker name, timestamp (in meta column), and full turn text
- [ ] Content area has `maxHeight: 480` and `overflowY: auto`

### Screen body padding
- [ ] `screen-body` div has inline style `padding: '28px 32px 40px'` (non-default)

### What must NOT be present
- [ ] No loading state on any tab — switching is always instant
- [ ] No error state per tab
- [ ] No download button — copy only
- [ ] No tab-level regeneration button
- [ ] No fullscreen or zoom control on the flowchart
- [ ] No editable fields in any output view
- [ ] No real-time generation — all data is hardcoded demo constants

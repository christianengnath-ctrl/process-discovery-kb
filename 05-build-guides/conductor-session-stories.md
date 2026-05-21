# Conductor Session Stories — Process Discovery Agent

These stories are written for a Conductor (vibe-code) session. Each story is self-contained: it names the screen, describes what currently exists, specifies exactly what needs to change, and provides a clear Definition of Done. No prior context required.

---

## Story A — Interview mode selection

**Goal**
Before the interview begins, the user picks one of two modes: Voice only or Voice + Screen recording. The selection is saved to the project and controls which variant of `InterviewInProgress` renders.

**Screen**
`InterviewSetup` — `/projects/:id/setup`

**What currently exists**
The screen shows Timmy's avatar, a Google Meet URL input field, and a "Launch Timmy" button. The button is disabled until the URL is valid.

**What needs to change**
1. **Remove** the Google Meet URL input field and all URL validation logic.
2. **Remove** the "Launch Timmy" label — replace with "Start interview".
3. **Add** two mode-selector cards below the Timmy avatar:

   | Card | Icon | Title | Description |
   |---|---|---|---|
   | 1 | 🎤 | Voice only | Timmy asks questions, you answer out loud. No recording needed. |
   | 2 | 🖥 | Voice + Screen recording | Timmy asks questions while capturing your screen. Best for process mapping. |

4. Voice only is pre-selected by default (visual: highlighted border + filled radio dot).
5. Clicking a card selects it and deselects the other.
6. Clicking "Start interview":
   - Writes `project.interviewMode` to the Zustand store (`'voice'` or `'voice+screen'`).
   - Updates `project.status` to `'interviewing'`.
   - Navigates to `/projects/:id/live`.

**Data shape**
```js
// store.js already has:
interviewMode: 'voice', // default

// setInterviewMode action:
setInterviewMode: (id, mode) => get().updateProject(id, { interviewMode: mode })
```

**Constraints**
- No external API calls on this screen.
- Do not show the goals list.
- Button is always enabled (mode always has a value — Voice only is the default).

**Definition of Done**
- [ ] Google Meet input field is gone; no URL validation logic remains
- [ ] Two mode-selector cards render with correct icons, titles, and descriptions
- [ ] Voice only is visually selected on first render
- [ ] Clicking the second card selects it; clicking back re-selects Voice only
- [ ] Button label reads "▶ Start interview"
- [ ] Clicking "Start interview" saves `interviewMode` to the store and navigates to `/live`
- [ ] `project.interviewMode` is immediately readable from the next screen

---

## Story B — Voice-only interview in progress

**Goal**
The user monitors Timmy conducting the interview. The app shows that something is running — Timmy's avatar, a live timer, and goal coverage chips. The user can end the interview at any time with a confirmation step.

**Screen**
`InterviewInProgress` — `/projects/:id/live`

**What currently exists**
The screen shows:
- A "Interview in progress" live chip
- Timmy's avatar (180 px, speaking state)
- A running `mm:ss` timer
- Goal coverage chips (first two shown as covered, rest pending)
- An "End interview" button that triggers a confirmation inline ("End anyway?" / "Keep going")

**What to verify still works**
All of the above should be intact for Voice-only mode. This story is primarily about confirming the existing screen is wired to `interviewMode: 'voice'` correctly.

**Specific change needed**
Read `project.interviewMode` from the store. When `interviewMode === 'voice'`, render the existing layout unchanged. The screen capture panel (Story C add) should NOT appear.

**Data reads**
```js
const project = projects.find(p => p.id === id);
const isScreenMode = project.interviewMode === 'voice+screen';
// Voice-only: isScreenMode === false → no changes to layout
```

**Definition of Done**
- [ ] Screen renders the existing layout when `interviewMode === 'voice'`
- [ ] No screen capture panel or "● Recording" badge appears in Voice-only mode
- [ ] Timer starts on mount and increments every second
- [ ] Goal chips render for all goals in `project.goals[]`
- [ ] "End interview" → inline confirm → "Yes, end now" → `status: 'complete'` → navigate to `/outputs`
- [ ] "Keep going" dismisses the confirmation and resumes the session

---

## Story C — Output screen with Transcript tab

**Goal**
After the interview, the user reviews four output tabs: Flowchart, SIPOC, SOP, and Transcript. This is the demo closer. Switching tabs never re-runs generation. Each tab has a "Copy" button.

**Screen**
`Outputs` — `/projects/:id/outputs`

**What currently exists**
Three tabs: Flowchart, SIPOC, SOP. All render hardcoded demo data. The Flowchart copy button has a bug — `getContent()` returns an empty string for the flowchart tab.

**What needs to change**

### 1. Add Transcript as a fourth tab

Tab definition to add:
```js
{ id: 'transcript', label: 'Transcript', sub: 'Full interview' }
```

### 2. Add hardcoded demo transcript data

```js
const TRANSCRIPT_TURNS = [
  { speaker: 'Timmy',       text: "Hi, I'm Timmy from Beam AI. Can you walk me through what happens from the moment a refund request comes in?", ts: '0:00' },
  { speaker: 'Interviewee', text: "Sure. A customer submits via the portal or calls in. Our AP clerk logs it into SAP and sends an acknowledgement email.", ts: '0:18' },
  { speaker: 'Timmy',       text: "Who reviews the request, and is there a threshold where different people get involved?", ts: '0:42' },
  { speaker: 'Interviewee', text: "Under $500 the clerk can approve directly. Over $500 goes to the AP Manager. Over $2,000 we need VP sign-off.", ts: '0:55' },
  { speaker: 'Timmy',       text: "What systems are involved in processing the payout once approved?", ts: '1:28' },
  { speaker: 'Interviewee', text: "SAP handles logging and payout. Finance uses the reporting dashboard. Customer is notified by email when payout completes.", ts: '1:38' },
  { speaker: 'Timmy',       text: "Are there common exceptions or edge cases that slow things down?", ts: '2:10' },
  { speaker: 'Interviewee', text: "Duplicates are held pending review. Missing invoice is common. Disputed amounts need back-and-forth with the customer.", ts: '2:18' },
  { speaker: 'Timmy',       text: "Who owns this process and how often is it reviewed?", ts: '2:52' },
  { speaker: 'Interviewee', text: "AP Manager is the process owner. We review the SOP quarterly or after major system changes.", ts: '3:02' },
  { speaker: 'Timmy',       text: "Perfect. Thank you — this gives us a solid base to build the automation.", ts: '3:14' },
];
```

### 3. Add `TranscriptView` component

Renders a conversation log:
- Each turn has: speaker label, timestamp, and text
- Timmy turns: speaker label in blue (`var(--beam-blue-300)`)
- Interviewee turns: speaker label in green (`var(--beam-green-soft)`)
- Header: title, subtitle (turn count + duration), "Complete" chip

### 4. Fix Flowchart copy (`getContent()` bug)

Current broken code:
```js
if (tab === 'flowchart') return tab === 'flowchart' ? 'Flowchart content copied.' : '';
```
Should be:
```js
if (tab === 'flowchart') return NODES.map(n => `${n.name} (${n.actor}) — ${n.kind} ${n.conf}%`).join('\n');
```

### 5. Update Transcript copy in `getContent()`

```js
// transcript tab:
return TRANSCRIPT_TURNS.map(t => `[${t.ts}] ${t.speaker}: ${t.text}`).join('\n\n');
```

**CSS classes needed** (already in `index.css`):
```
.transcript-turn          — flex row, gap 14px, margin-bottom 20px
.transcript-turn-meta     — 90px wide column (speaker + timestamp)
.transcript-turn-speaker  — uppercase small label; .timmy = blue, .interviewee = green
.transcript-turn-ts       — monospace timestamp
.transcript-turn-text     — body text, 13px, line-height 1.6
```

**Definition of Done**
- [ ] Four tabs render: Flowchart, SIPOC, SOP, Transcript — Flowchart is default
- [ ] Transcript tab shows all turns with speaker label, timestamp, and text
- [ ] Timmy speaker label is blue; Interviewee speaker label is green
- [ ] Switching between tabs never re-generates content (tab state is local `useState`)
- [ ] "⧉ Copy" copies correct format per tab:
  - Flowchart: `Step name (Actor) — Kind conf%` per line
  - SIPOC: tab-separated with header row
  - SOP: plain text with section headings
  - Transcript: `[ts] Speaker: text` per turn, blank lines between turns
- [ ] Flowchart copy no longer returns empty string
- [ ] "← Projects" link navigates to `/`

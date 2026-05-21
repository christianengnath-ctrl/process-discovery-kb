# User Stories — Process Discovery with Timmy

*All steps follow the structure: Goal · Screen name · Data · Context · Constraints · Definition of Done*

---

## User Story — Step 1: Project List

**Goal**
The solutions engineer needs a home screen that shows all their discovery projects at a glance and lets them start a new one. This is the entry point to the entire app.

**Screen name**
`ProjectList`

**Data**
- Reads: local project array `projects[]` — each project has `id`, `clientName`, `processName`, `goal`, `status` (`setup` | `interviewing` | `complete`), `createdAt`
- Writes: nothing — read-only. New project creation happens in `CreateProject`.

**Context**

*Screenshots:* Search competitor apps for project list / dashboard views — Klarity, Ontora, Varos. Looking for: how they display multiple projects, what metadata is surfaced per card, how the empty state is handled, where the "new project" CTA lives.

*Logic flow:*
```
App loads
  → read projects[] from local storage
  → if projects[] is empty → show empty state with "New project" CTA
  → if projects[] has items → show project cards, sorted by createdAt descending
  → user clicks "New project" → navigate to CreateProject
  → user clicks a project card → navigate based on status:
      status: setup → AddContext
      status: interviewing → InterviewInProgress
      status: complete → OutputScreen
```

The refund processing project is pre-seeded in local storage on first load — it must appear in the list without the user creating it.

**Constraints**
- Do not build authentication, user accounts, or multi-user logic
- Do not add filtering, sorting controls, or search — single flat list only
- Do not add delete or archive project functionality
- Do not show any loading spinner if local storage read is instant
- Do not add pagination — flat list, all projects visible

**Definition of Done**
- [ ] App loads and the project list screen is the default route
- [ ] The pre-seeded refund processing project appears on first load without any user action
- [ ] If no projects exist, an empty state is shown with a visible "New project" button — not a blank screen
- [ ] Clicking "New project" navigates to `CreateProject`
- [ ] Clicking a project card navigates to the correct screen based on that project's `status` field
- [ ] Each project card displays: client name, process name, status, and creation date
- [ ] List is sorted by most recently created first

---

## User Story — Step 2: Create Project

**Goal**
The solutions engineer creates a new discovery project by naming the client, the process, and the goal. This is the minimum viable setup that gives Timmy enough context to generate exploration goals.

**Screen name**
`CreateProject`

**Data**
- Reads: nothing
- Writes: new project object to `projects[]` in local storage:
  ```json
  {
    "id": "uuid",
    "clientName": "string",
    "processName": "string",
    "goal": "string",
    "status": "setup",
    "contextBlob": "",
    "goals": [],
    "kb": [],
    "createdAt": "ISO timestamp"
  }
  ```

**Context**

*Screenshots:* Search for: Klarity new project / new engagement screen, Varos project creation, Ontora onboarding. Looking for: how competitors frame the "name your project" step — field labels, helper text, level of detail requested.

*Logic flow:*
```
User arrives from ProjectList → "New project"
  → show form with three fields: Client name, Process name, One-line goal
  → "Create project" button disabled until all three fields have content
  → user fills fields → button enables
  → user clicks "Create project"
    → create project object with status: "setup"
    → save to local storage
    → navigate to AddContext with new project id
```

**Constraints**
- Do not add optional fields — exactly three fields, all required
- Do not add a project image, colour picker, or any visual customisation
- Do not validate field content beyond "non-empty"
- Do not save to any remote database or API
- Do not auto-generate the project name or goal from AI — pure user input

**Definition of Done**
- [ ] Form shows exactly three fields: Client name, Process name, One-line goal
- [ ] Each field has appropriate helper text as specified
- [ ] "Create project" button is disabled until all three fields are non-empty
- [ ] Submitting the form creates a new project in local storage with the correct schema
- [ ] After creation, app navigates to `AddContext` with the new project's id
- [ ] Navigating back to `ProjectList` shows the new project in the list

---

## User Story — Step 3: Add Context

**Goal**
The solutions engineer can optionally paste existing process documentation so Timmy can read it before the interview starts — making his questions sharper and more specific to the client.

**Screen name**
`AddContext`

**Data**
- Reads: current project from local storage by id
- Writes: updates `contextBlob` field on the current project in local storage

**Context**

*Screenshots:* Search for: Klarity intake / document upload screen, Varos project setup context step, Ontora knowledge input. Looking for: how competitors handle "give us your existing docs" — field size, framing, skip option placement.

*Logic flow:*
```
User arrives from CreateProject
  → show large text area, pre-filled with "" (empty)
  → "Continue" button always enabled (skip is valid)
  → "Skip for now" link also always visible
  → user pastes text OR clicks "Skip for now" OR clicks "Continue" with empty field
    → save contextBlob to current project in local storage (empty string if skipped)
    → navigate to GoalDefinition
```

**Constraints**
- Do not add file upload — plain text paste only for MVP
- Do not add URL input or web scraping
- Do not validate or process the context blob at this step — save as-is, raw text
- Do not show a character count or limit
- "Skip for now" and "Continue" must both lead to `GoalDefinition`

**Definition of Done**
- [ ] Screen shows a large text area with heading "Give Timmy some background"
- [ ] Helper text is visible below the text area
- [ ] "Continue" button is always enabled regardless of whether the field is empty
- [ ] "Skip for now" link is visible and navigates to `GoalDefinition`
- [ ] Clicking "Continue" saves whatever is in the text area (including empty string) to `contextBlob`
- [ ] After saving, app navigates to `GoalDefinition`

---

## User Story — Step 4: Goal Definition

**Goal**
The solutions engineer reviews and approves the exploration goals Timmy will use to structure the interview. These goals are Timmy's internal agenda — the topics he must cover before closing the session.

**Screen name**
`GoalDefinition`

**Data**
- Reads: current project (`contextBlob`, `processName`, `goal`) from local storage
- Writes: updates `goals[]` array on the current project in local storage:
  ```json
  "goals": [
    { "id": "uuid", "text": "string", "covered": false }
  ]
  ```

**Context**

*Screenshots:* No direct competitor equivalent. Search for: research agenda UI, interview guide checklist, Varos coverage tracking, editable tag/chip lists. Looking for: how to display a short editable list of agenda items that feel structured but not intimidating.

*Logic flow:*
```
User arrives from AddContext
  → trigger one LLM call: generate 3-5 goals from contextBlob + processName + goal
  → show loading state: "Timmy is preparing his questions…"
  → on success: display goals as editable line items
  → on LLM failure: display 3 default goals pre-filled:
      "Walk me through the process end to end"
      "Who are the people involved?"
      "What systems or tools are used?"
  → user can: edit any goal text inline, remove a goal, add a goal (max 5)
  → "Start interview" button enabled when at least 1 goal exists
  → user clicks "Start interview"
    → lock goals
    → save goals[] to current project, update status to "interviewing"
    → navigate to InterviewSetup
```

**Constraints**
- Do not allow more than 5 goals
- Do not allow 0 goals — "Start interview" disabled if all goals are removed
- Do not re-generate goals if the user navigates back and returns — show what was saved
- Do not add drag-to-reorder — flat list, fixed order
- Goals are plain text strings only — no tags, categories, or priority levels

**Definition of Done**
- [ ] LLM call fires on arrival and shows a loading state while running
- [ ] On success, 3-5 generated goals are displayed as editable line items
- [ ] On LLM failure, 3 default goals are shown pre-filled and editable
- [ ] User can edit any goal text inline
- [ ] User can remove a goal; remove button hidden when only 1 goal remains
- [ ] User can add a goal up to maximum of 5; add option hidden at 5
- [ ] "Start interview" is disabled when 0 goals exist
- [ ] Clicking "Start interview" saves goals to local storage, updates project status to `interviewing`, navigates to `InterviewSetup`

---

## User Story — Step 5: Interview Setup

**Goal**
The solutions engineer selects an interview mode and starts the session. This is the final confirmation step before the interview begins — no external tools or links required.

**Screen name**
`InterviewSetup`

**Data**
- Reads: current project from local storage (`goals[]`, `contextBlob`)
- Writes: `interviewMode: 'voice' | 'voice+screen'` on current project; `status → 'interviewing'`

**Context**

*Screenshots:* Search for: Klarity AI interviewer start screen, Varos interview launch, any "ready to start" confirmation screen. Looking for: how to frame the moment just before an AI agent goes live — what reassurance, what information, what single CTA.

*Logic flow:*
```
User arrives from GoalDefinition
  → show Timmy avatar + two mode-selector cards + "Start interview" button
  → Voice only pre-selected by default
  → user optionally switches to "Voice + Screen recording"
  → user clicks "Start interview"
    → save interviewMode to project in local state
    → update project status to 'interviewing'
    → navigate to InterviewInProgress
```

**Constraints**
- Do not add a Meet URL field — interview runs entirely in the browser
- Do not add scheduling or calendar integration
- Do not show the goals list on this screen
- Do not allow editing goals from this screen
- Default mode must always be Voice only

**Definition of Done**
- [ ] Screen shows Timmy's avatar, two mode-selector cards, and a "Start interview" button
- [ ] Voice only is pre-selected on arrival
- [ ] Clicking a card selects that mode and deselects the other
- [ ] Clicking "Start interview" saves `interviewMode` to local state and navigates to `InterviewInProgress`
- [ ] `project.interviewMode` is readable from `InterviewInProgress` immediately after navigation

---

## User Story — Step 6: Interview In Progress

**Goal**
The solutions engineer monitors the live session. Timmy handles the conversation entirely via ElevenLabs TTS in the browser. The app confirms the session is active — nothing more. The screen has two variants driven by the `interviewMode` selected in Step 5.

**Screen name**
`InterviewInProgress`

**Data**
- Reads: current project (`goals[]`, `contextBlob`, `kb[]`, `interviewMode`) from local storage
- Writes: appends to `kb[]` on current project after each turn; updates `goals[].covered` as goals are met; `status → 'complete'` on end

**Context**

*Screenshots:* Search for: voice agent waiting screen, AI call in progress UI, minimal "something is running" screen. Looking for: how to communicate that a background process is active without showing real-time data — calm, confident, minimal.

*Logic flow — Voice only:*
```
On arrival (interviewMode: 'voice'):
  → show "Interview in progress" chip + Timmy avatar + timer + goal chips
  → Timmy sends opening message via ElevenLabs TTS (browser audio)

Per utterance-end event:
  → extraction LLM call → structured JSON
  → append to kb[] in local storage
  → check goal coverage → update goals[].covered
  → question generator LLM call → next question text
  → ElevenLabs TTS → audio plays in browser → Timmy speaks

When all goals covered:
  → status indicator → "Interview complete"
  → button → "Generate outputs"
```

*Logic flow — Voice + Screen recording:*
```
On arrival (interviewMode: 'voice+screen'):
  → same as Voice only, PLUS:
  → show screen capture preview panel above the timer
  → show "● Recording" badge on the preview panel
  → screen capture runs via browser MediaRecorder API
  → recording stream saved locally for transcript generation
```

*Decision point — user ends early:*
```
User clicks "End interview"
  → confirmation dialog: "Timmy hasn't covered all goals yet. End anyway?"
  → Yes → navigate to GeneratingOutputs
  → No → dismiss, continue
```

**Edge cases:**
- Screen recording permission denied → show permission error prompt; offer "Continue in Voice-only mode" button
- No speech detected for 60 s → Timmy asks "Are you still there?"

**Constraints**
- Do not show a live transcript feed in the UI
- Do not show the goals checklist updating in real time
- Do not show extraction results or KB contents during the session
- Do not allow editing goals during the interview
- Both modes use the identical Timmy loop — only the screen capture layer differs

**Definition of Done — Voice only**
- [ ] Screen shows Timmy's avatar, "Interview in progress" chip, and a running timer
- [ ] Goal coverage chips visible when goals exist; update as Timmy covers each goal
- [ ] Per-turn loop fires: extraction → KB update → goal check → question generation → TTS
- [ ] `kb[]` grows after each turn; `goals[].covered` updates correctly
- [ ] When all goals covered, status updates to "Interview complete" and button changes to "Generate outputs"
- [ ] "End interview" shows a confirmation dialog before navigating away

**Definition of Done — Voice + Screen recording (additional)**
- [ ] Screen capture preview panel renders above the timer
- [ ] "● Recording" badge is visible on the preview panel
- [ ] If screen permission is denied, error prompt appears with "Continue in Voice-only mode" option

---

## User Story — Step 7: Generating Outputs

**Goal**
After the interview ends, the app generates four outputs from the accumulated knowledge base and interview audio. The solutions engineer sees clear progress and is automatically taken to the results when done.

**Screen name**
`GeneratingOutputs`

**Data**
- Reads: current project (`kb[]`, `goals[]`, `clientName`, `processName`) from local storage; raw audio (Voice+Screen mode)
- Writes: `outputs` object on current project:
  ```json
  "outputs": {
    "flowchart": { "nodes": [], "edges": [] },
    "sipoc": { "suppliers": [], "inputs": [], "steps": [], "outputs": [], "customers": [] },
    "sop": { "purpose": "", "scope": "", "roles": [], "steps": [], "exceptions": [], "systems": [], "approvals": "" },
    "transcript": { "turns": [{ "speaker": "", "text": "", "timestamp": "" }] }
  }
  ```

**Context**

*Screenshots:* Search for: AI processing / generation loading screen, multi-step progress indicator. Looking for: how to show sequential progress through multiple generation steps — Timmy's avatar should stay present throughout.

*Logic flow:*
```
On arrival:
  → show Timmy avatar + four-step progress indicator (all pending)
  → run four generation tasks in sequence:

  Step 1: Flowchart generation
    → prompt: full kb[] → structured nodes + edges with classification tags + confidence scores
    → gaps: output node with label "Insufficient data — not covered in interview"
    → on success: tick step 1 ✓, start step 2
    → on failure: show retry for step 1, do not proceed

  Step 2: SIPOC generation
    → prompt: full kb[] → SIPOC table rows
    → gaps: output "Insufficient data — not covered in interview" in the relevant cell
    → on success: tick step 2 ✓, start step 3
    → on failure: show retry for step 2

  Step 3: SOP generation
    → prompt: full kb[] → structured SOP sections
    → gaps: output "Insufficient data — not covered in interview" — do not invent content
    → on success: tick step 3 ✓, start step 4
    → on failure: show retry for step 3

  Step 4: Transcript generation
    → Whisper (or ElevenLabs transcript API) → structured turns: [{speaker, text, timestamp}]
    → speaker labels: "Timmy" for agent turns, "Interviewee" for human turns
    → on success: tick step 4 ✓
    → on failure: show retry for step 4

  All complete → save outputs to local storage → update status to "complete" → navigate to OutputScreen
```

**Constraints**
- Do not run the four tasks in parallel — run sequentially so progress is visible
- Do not hallucinate content for gaps — use the explicit gap marker string
- Do not allow the user to navigate back during generation
- Do not show raw LLM output — parse into structured schema before saving

**Definition of Done**
- [ ] Four-step progress indicator shown on arrival, all steps starting as pending
- [ ] Steps tick off one at a time as each task completes
- [ ] Flowchart output saved as structured nodes + edges with classification tags and confidence scores
- [ ] SIPOC output saved as structured rows matching the SIPOC schema
- [ ] SOP output saved with all seven sections; gaps use the explicit marker string, not invented content
- [ ] Transcript output saved as `{ turns: [{speaker, text, timestamp}] }`; speaker labels are "Timmy" or "Interviewee"
- [ ] On full success, project status updates to `complete` and app navigates to `OutputScreen`
- [ ] If any step fails, that step shows an error with a "Retry" button — succeeded steps are not re-run

---

## User Story — Step 8: Output Screen

**Goal**
The solutions engineer reviews all four outputs and copies what they need. This is the demo closer — the screen that shows what no competitor produces in one place.

**Screen name**
`OutputScreen`

**Data**
- Reads: `outputs` object from current project in local storage (`flowchart`, `sipoc`, `sop`, `transcript`)
- Writes: nothing — read-only screen. Copy to clipboard is client-side only.

**Context**

*Screenshots — HIGH PRIORITY:* Search for: Klarity process output screen, Klarity SOP export, Varos BRD output, Ontora process map view. Looking for: how competitors display final discovery outputs — layout, tabs vs sections, how the flowchart is presented visually, how document outputs are structured. This is the most important screen to get right — it is the demo closer.

*Logic flow:*
```
On arrival:
  → read outputs from current project in local storage
  → render four tabs: Flowchart (default) / SIPOC / SOP / Transcript
  → no re-generation on tab switch

Flowchart tab:
  → render nodes with step name, actor, classification tag badge, confidence score
  → colour-code by classification: Deterministic / Agentic / RPA Bridge

SIPOC tab:
  → render as a five-column table
  → rows from sipoc output object

SOP tab:
  → render as structured text with section headings
  → gap marker displayed as dimmed/italic text

Transcript tab:
  → render as a turn-by-turn conversation log
  → each turn: speaker label (Timmy / Interviewee), timestamp, spoken text
  → Timmy turns in blue; Interviewee turns in green

Copy to clipboard (per tab):
  → Flowchart: copy node list as plain text (one line per node)
  → SIPOC: copy as tab-separated table with header row
  → SOP: copy as plain text with section headings
  → Transcript: copy as "[timestamp] Speaker: text" per turn, separated by blank lines
```

**Constraints**
- Do not add download as file — clipboard only for MVP
- Do not re-run generation from this screen
- Do not allow editing of outputs
- Gap marker text must be visually distinct (dimmed or italic) — not styled the same as real content
- Switching tabs must never trigger a re-generation call

**Definition of Done**
- [ ] Screen shows four tabs: Flowchart, SIPOC, SOP, Transcript — Flowchart is default
- [ ] Flowchart tab renders all nodes with step name, actor, classification tag, and confidence score
- [ ] Classification tags are colour-coded: Deterministic / Agentic / RPA Bridge each have a distinct colour
- [ ] SIPOC tab renders a five-column table with correct row data
- [ ] SOP tab renders all seven sections with correct headings; gap markers are visually dimmed/italic
- [ ] Transcript tab renders all turns with speaker label, timestamp, and text; Timmy and Interviewee turns are visually distinct
- [ ] Switching tabs does not re-generate content
- [ ] "Copy to clipboard" works per tab and copies the correct format for that tab
- [ ] "Back to projects" link navigates to `ProjectList`

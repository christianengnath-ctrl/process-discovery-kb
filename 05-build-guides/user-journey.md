# User Journey — Process Discovery with Timmy

**Actor:** Beam solutions engineer, fresh off an initial client call. They have a rough understanding of the process they need to automate but not the detail needed to build agents.

**Job to be done:** Conduct a structured AI-led discovery interview with a client employee, and walk away with a process flowchart, SIPOC table, and SOP — without manual note-taking or post-processing.

**Trigger:** Solutions engineer has scheduled a discovery call with the client. They open the Process Discovery app to set it up before the call.

**Success:** The solutions engineer ends the session with three outputs they can immediately use — a SIPOC to share with the client, a flowchart to brief the agent team, and an SOP for the client's records.

---

## Happy path

---

### Step 1 — Project list
**Screen name:** `ProjectList`

**What the user sees:**
- List of existing discovery projects (client name, process name, % understood, date)
- "New project" button
- Empty state if no projects exist yet

**What the user does:** Clicks "New project"

**System response:** Opens the project creation form

**Done when:** Clicking "New project" navigates to the `CreateProject` screen. If no projects exist, an empty state is shown with a visible "New project" CTA — the list never shows a blank page with no affordance.

> 🖼 **[SCREEN NEEDED]** Project list / dashboard view. Search competitors for: Klarity project dashboard, Ontora project list, Varos research project overview. Looking for: how they display multiple discovery projects, what metadata they surface (status, progress, date), and how the "new project" entry point is framed.

---

### Step 2 — Create project
**Screen name:** `CreateProject`

**What the user sees:**
- Three fields: Client name, Process name, One-line goal
- Helper text under "Process name": e.g. "Refund request handling"
- Helper text under "One-line goal": e.g. "Understand how refund requests are processed end to end"
- "Create project" button

**What the user does:** Fills in the three fields and clicks "Create project"

**System response:** Creates the project locally, navigates to `AddContext`

**Edge cases:**
- All three fields are required — "Create project" is disabled until all are filled
- The refund processing project is pre-seeded and appears in the project list — it does not go through this flow

**Done when:** Submitting the form with all three fields filled navigates to `AddContext` and the new project appears in the project list when the user navigates back.

---

### Step 3 — Add context
**Screen name:** `AddContext`

**What the user sees:**
- Heading: "Give Timmy some background"
- Large text area: "Paste any existing process documentation, emails, or notes"
- Helper text: "Timmy will read this before the interview starts. The more context, the sharper his questions."
- "Skip for now" link
- "Continue" button (enabled even if empty, since skip is valid)

**What the user does:** Pastes existing docs (Notion export, email thread, SOP text) — or clicks "Skip for now"

**System response:** Saves the `context_blob` locally. Navigates to `GoalDefinition`.

**Edge cases:**
- If skipped: Timmy generates exploration goals from the project name and process name only
- No file upload in MVP — plain text paste only. File upload is a post-Friday addition.

**Done when:** Clicking "Continue" (with or without text) navigates to `GoalDefinition`. The `context_blob` is retrievable from local state.

> 🖼 **[SCREEN NEEDED]** Context / knowledge input screen. Search competitors for: Klarity intake screen, Varos project setup, Ontora context upload. Looking for: how they frame the "give us your existing docs" step and what they ask for.

---

### Step 4 — Goal definition
**Screen name:** `GoalDefinition`

**What the user sees:**
- Heading: "Here's what Timmy will explore"
- 3-5 suggested exploration goals, each as an editable chip or line item
- "Add a goal" option (max 5)
- "Remove" option per goal
- "Start interview" button

**What the user does:** Reviews the goals, edits or removes any that don't fit, optionally adds one, then clicks "Start interview"

**System response:** Timmy generates the 3-5 goals via one LLM call using the `context_blob` and project metadata. Goals are displayed for review. On "Start interview", goals are locked and saved to local state. App transitions to `InterviewSetup`.

**Edge cases:**
- If context was skipped: goals are generated from process name + goal only — they will be more generic
- If goal generation fails (LLM error): show 3 default editable goals — "Walk me through the process end to end", "Who are the people involved?", "What systems or tools are used?" — user edits before proceeding
- Minimum 1 goal required to proceed
- Goals are editable free text — user can fully rewrite any of them

**Done when:** Goals are displayed after navigating from `AddContext`. Editing a goal updates it in local state. Clicking "Start interview" with at least one goal navigates to `InterviewSetup` and the approved goals are accessible in the app state.

> 🖼 **[SCREEN NEEDED]** Goal / agenda review screen. No direct competitor equivalent — this is unique to our flow. Search for: Varos coverage tracking UI, Klarity advisor agent prompt screen, any "research agenda" or "interview guide" UI. Also consider: task checklist UIs for reference on how to display an editable agenda.

---

### Step 5 — Interview setup
**Screen name:** `InterviewSetup`

**What the user sees:**
- Heading: "Ready to start the interview"
- Timmy avatar image
- Two mode-selector cards:
  - **Voice only** — "Timmy asks questions, you answer out loud. No recording needed."
  - **Voice + Screen recording** — "Timmy asks questions while capturing your screen. Best for process mapping."
- Voice only is pre-selected by default
- Summary chips: goals count, context status, "Voice: ElevenLabs"
- "Start interview" button

**What the user does:** Reviews the mode options (defaults to Voice only), optionally selects Voice + Screen recording, then clicks "Start interview"

**System response:** Saves the selected `interviewMode` ('voice' or 'voice+screen') to local state. App transitions to `InterviewInProgress`.

**Decision point:**
- Voice only → `InterviewInProgress` (standard layout)
- Voice + Screen recording → browser requests screen capture permission, then `InterviewInProgress` (recording variant)

**Done when:** Two mode cards render with correct labels and descriptions. Voice only is pre-selected. Clicking "Start interview" saves `interviewMode` to local state and navigates to `InterviewInProgress`. No external API calls required.

> 🖼 **[SCREEN NEEDED]** Pre-interview / setup screen. Search for: Klarity AI interviewer start screen, Varos interview launch screen. Looking for: how competitors frame the "about to start" moment and what they show the operator before the interview begins.

---

### Step 6 — Interview in progress
**Screen name:** `InterviewInProgress`

**What the user sees (both modes):**
- Status chip: "Interview in progress"
- Timmy's avatar (large, centred)
- Session timer
- Goal coverage chips (shows which goals are covered as Timmy works through them)
- "End interview" button

**Voice + Screen recording variant — additional elements:**
- Live screen capture preview panel (above the timer)
- "● Recording" badge overlaid on the preview panel

**What the user does:** Monitors the session. Timmy conducts the interview entirely via ElevenLabs TTS in the browser — no external meeting tool required.

**System response (running silently per turn):**
- Extraction call runs silently
- KB updates locally
- Goal tracker checks coverage, updates goal chips
- Question generator produces Timmy's next question
- ElevenLabs TTS → audio plays in browser → Timmy speaks

**When Timmy closes the interview:** All goals covered → app status updates to "Interview complete". "End interview" button becomes "Generate outputs".

**Decision point — user ends early:**
- User clicks "End interview" before all goals are covered
- Confirmation dialog: "Timmy hasn't covered all goals yet. End anyway?"
- Yes → transition to `GeneratingOutputs`
- No → continue

**Edge cases:**
- Screen recording permission denied → show permission error prompt; offer to continue in Voice-only mode
- No speech detected for 60 s → Timmy prompts "Are you still there?"

**Done when:** The interview screen shows Timmy's avatar, status chip, and timer. Voice-only mode renders the standard layout. Voice + Screen recording mode adds the screen capture preview panel and "● Recording" badge. When Timmy finishes or the user ends the interview, clicking "Generate outputs" transitions to `GeneratingOutputs`.

> 🖼 **[SCREEN NEEDED]** Active interview / session screen. Search for: Klarity AI interviewer active session, Varos interview in progress, voice agent waiting screen. Looking for: how to communicate that something is running without showing real-time data — minimal, confident UI.

---

### Step 7 — Generating outputs
**Screen name:** `GeneratingOutputs`

**What the user sees:**
- Timmy's avatar
- Progress indicator with four steps ticking off in sequence:
  1. "Building process flowchart…" ✓
  2. "Generating SIPOC table…" ✓
  3. "Writing SOP document…" ✓
  4. "Transcribing interview…" ✓
- Estimated time: ~20 seconds

**System response:** Four generation tasks run in sequence against the accumulated KB and raw audio. On completion, navigates to `OutputScreen`.

**Edge cases:**
- If the KB doesn't have enough data for a section, outputs show an explicit gap: "Insufficient data — not covered in interview." Do not fill gaps with invented content.
- If any call fails, show which outputs succeeded and offer "Retry" for the failed tab only.

**Done when:** Navigating to this screen triggers the four generation tasks. On completion of all four, the app automatically transitions to `OutputScreen`. If any task fails, an error state is shown per failed output with a "Retry" option.

---

### Step 8 — Output screen
**Screen name:** `OutputScreen`

**What the user sees:**
- Four tabs: "Flowchart" / "SIPOC" / "SOP" / "Transcript"
- **Flowchart tab (default):** Process flowchart with all nodes labelled. Each node shows: step name, actor, classification tag (Deterministic / Agentic / RPA Bridge), confidence score. Colour-coded by classification.
- **SIPOC tab:** Full SIPOC table.
- **SOP tab:** Structured text document. Sections: Purpose, Scope, Roles, Steps, Exceptions, Systems, Approvals. Gaps shown as "Insufficient data — not covered in interview" where KB has no content.
- **Transcript tab:** Full timestamped interview transcript with speaker labels (Timmy / Interviewee) for every turn.
- "Copy to clipboard" button per tab
- "Back to projects" link

**What the user does:** Reviews the four outputs. Shares SIPOC with the client. Shares flowchart with the agent team. Copies SOP for client records. Reads transcript for verbatim detail.

**Done when:** All four tabs display content. Switching between tabs does not re-generate content. Each tab's content is readable and correctly structured. Copy to clipboard works per tab and copies the correct format (plain text for SOP/Transcript, tab-separated for SIPOC, node list for Flowchart).

> 🖼 **[SCREEN NEEDED — HIGH PRIORITY]** Output / results screen. Search for: Klarity process output screen, Klarity SOP output, Varos BRD output, Ontora process map output. Looking for: how competitors display final discovery outputs, how they present the flowchart, and how they structure document outputs. This is the most important screen to get right visually — it is the demo closer.

---

## Decision points summary

| Point | Condition | Path A | Path B |
|---|---|---|---|
| Context | User has docs | Pastes context → richer goals | Skips → generic goals |
| Goal generation | LLM succeeds | Generated goals shown | 3 default goals shown for editing |
| Interview mode | Voice only | Standard layout, no capture | — |
| Interview mode | Voice + Screen recording | Screen capture preview + Recording badge | Permission denied → offer Voice-only fallback |
| Interview end | All goals covered | Timmy closes gracefully | User ends manually |
| User ends early | Confirmed | Generate from partial KB | Continue interview |
| Output generation | All tasks succeed | Output screen (4 tabs) | Error per tab + retry |

---

## Edge cases — resolved

- **Empty project list** → empty state with clear "New project" CTA
- **Goal generation fails** → show 3 default editable goals, user proceeds manually
- **Screen recording permission denied** → show browser permission error prompt; offer to continue in Voice-only mode with a single click
- **Interview produces no extractable content** → low-confidence nodes in flowchart, gaps flagged in SOP as "Insufficient data — not covered in interview." No hallucinated content.
- **Output generation partially fails** → show succeeded tabs, retry failed tab individually. No placeholder or hallucinated content in failed tabs.

---

## Out of scope (explicit)

- File upload for context (post-Friday)
- Real-time transcript or goals feed during interview
- Multi-user access
- Reconfirmation flow
- Multi-session memory
- Prism integration (Friday morning stretch)
- Download as .txt — export is copy to clipboard only for MVP

---

## Decisions — resolved

1. **Interview location** — Interview runs entirely inside the app via ElevenLabs TTS. No Google Meet, no Recall.ai bot, no external call tool required.
2. **Two interview modes** — Voice only and Voice + Screen recording are both MVP. Voice only is the default. Screen recording requires browser permission.
3. **Export** → copy to clipboard only. One click copies the content so the user can paste into any doc.
4. **SIPOC** → kept as-is as the third output tab. Transcript added as the fourth tab.

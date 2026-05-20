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
- Google Meet link field (user pastes the Meet link)
- Timmy avatar image
- Brief description: "Timmy will join as a participant and conduct the interview. You'll see his status here while the session runs."
- "Launch Timmy" button

**What the user does:** Pastes the Google Meet link and clicks "Launch Timmy"

**System response:** Calls Recall.ai API to create a bot with the provided Meet URL. Bot joins the call. App transitions to `InterviewInProgress`.

**Decision point:**
- Recall.ai bot joins successfully → proceed to `InterviewInProgress`
- Recall.ai fails → show error with two options: "Retry" and "Switch to manual mode" — manual mode opens the fallback sidebar view

**Done when:** Pasting a valid Meet URL and clicking "Launch Timmy" triggers the Recall.ai bot creation call. A loading state is shown while the bot joins. On success, app transitions to `InterviewInProgress`.

> 🖼 **[SCREEN NEEDED]** Pre-interview / setup screen. Search for: Klarity AI interviewer start screen, Varos interview launch screen. Looking for: how competitors frame the "about to start" moment and what they show the operator before the interview begins.

---

### Step 6 — Interview in progress
**Screen name:** `InterviewInProgress`

**What the user sees:**
- Timmy's avatar (large, centred)
- Status indicator: "Interview in progress"
- Session timer
- "End interview" button

**What the user does:** Nothing — the solutions engineer monitors the Google Meet call. Timmy handles the conversation entirely. No real-time feedback is shown in the app during the session.

**System response (running silently per turn):**
- Recall.ai delivers utterance-end transcript
- Extraction call runs silently
- KB updates locally
- Goal tracker checks coverage
- Question generator produces Timmy's next question
- ElevenLabs TTS → Recall.ai audio injection → Timmy speaks

**When Timmy closes the interview:** All goals covered → Timmy summarises what he's learned and says goodbye in the Meet call. App status updates to "Interview complete". "End interview" button becomes "Generate outputs".

**Decision point — user ends early:**
- User clicks "End interview" before all goals are covered
- Confirmation dialog: "Timmy hasn't covered all goals yet. End anyway?"
- Yes → transition to `GeneratingOutputs`
- No → continue

**Fallback sidebar (manual relay mode):**
When Recall.ai fails, the solutions engineer switches to manual mode. Screen shows: Timmy's avatar, his current question in large text, a text input field, "Submit answer" button. The solutions engineer reads Timmy's question out loud in the Meet and types the interviewee's response back in. Same Timmy loop — manual audio relay instead of automatic.

**Edge cases:**
- Recall.ai connection drops mid-session → show reconnection banner, attempt reconnect once, then offer to end and generate outputs from KB gathered so far
- No speech detected for 60s → Timmy prompts "Are you still there?" in the Meet call

**Done when:** The interview screen shows Timmy's avatar, status, and timer. The backend loop runs silently with no UI updates during the session. When Timmy finishes or the user ends the interview, the button changes to "Generate outputs" and clicking it transitions to `GeneratingOutputs`.

> 🖼 **[SCREEN NEEDED]** Active interview / session screen. Search for: Klarity AI interviewer active session, Varos interview in progress, voice agent waiting screen. Looking for: how to communicate that something is running without showing real-time data — minimal, confident UI.

---

### Step 7 — Generating outputs
**Screen name:** `GeneratingOutputs`

**What the user sees:**
- Timmy's avatar
- Progress indicator with three steps ticking off in sequence:
  1. "Building process flowchart…" ✓
  2. "Generating SIPOC table…" ✓
  3. "Writing SOP document…" ✓
- Estimated time: ~15 seconds

**System response:** Three LLM calls run in sequence against the accumulated KB. On completion, navigates to `OutputScreen`.

**Edge cases:**
- If the KB doesn't have enough data for a section, outputs show an explicit gap: "Insufficient data — not covered in interview." Do not fill gaps with invented content.
- If any call fails, show which outputs succeeded and offer "Retry" for the failed tab only.

**Done when:** Navigating to this screen triggers the three output generation calls. On completion of all three, the app automatically transitions to `OutputScreen`. If any call fails, an error state is shown per failed output with a "Retry" option.

---

### Step 8 — Output screen
**Screen name:** `OutputScreen`

**What the user sees:**
- Three tabs: "Flowchart" / "SIPOC" / "SOP"
- **Flowchart tab (default):** Process flowchart with all nodes labelled. Each node shows: step name, actor, classification tag (Deterministic / Agentic / RPA Bridge), confidence score. Colour-coded by classification.
- **SIPOC tab:** Full SIPOC table.
- **SOP tab:** Structured text document. Sections: Purpose, Scope, Roles, Steps, Exceptions, Systems, Approvals. Gaps shown as "Insufficient data — not covered in interview" where KB has no content.
- "Copy to clipboard" button per tab
- "Back to project" link

**What the user does:** Reviews the three outputs. Shares SIPOC with the client. Shares flowchart with the agent team. Copies SOP for client records.

**Done when:** All three tabs display content generated from the KB. Switching between tabs does not re-generate content. Each tab's content is readable and correctly structured. Copy to clipboard works per tab.

> 🖼 **[SCREEN NEEDED — HIGH PRIORITY]** Output / results screen. Search for: Klarity process output screen, Klarity SOP output, Varos BRD output, Ontora process map output. Looking for: how competitors display final discovery outputs, how they present the flowchart, and how they structure document outputs. This is the most important screen to get right visually — it is the demo closer.

---

## Decision points summary

| Point | Condition | Path A | Path B |
|---|---|---|---|
| Context | User has docs | Pastes context → richer goals | Skips → generic goals |
| Goal generation | LLM succeeds | Generated goals shown | 3 default goals shown for editing |
| Recall.ai | Bot joins | Full Meet integration | Manual relay sidebar mode |
| Interview end | All goals covered | Timmy closes gracefully | User ends manually |
| User ends early | Confirmed | Generate from partial KB | Continue interview |
| Output generation | All calls succeed | Output screen | Error per tab + retry |

---

## Edge cases — resolved

- **Empty project list** → empty state with clear "New project" CTA
- **Goal generation fails** → show 3 default editable goals, user proceeds manually
- **Recall.ai fails to join** → manual relay mode: Timmy's questions shown as text, solutions engineer reads out loud and types responses back
- **Interview produces no extractable content** → low-confidence nodes in flowchart, gaps flagged in SOP as "Insufficient data — not covered in interview." No hallucinated content.
- **Output generation partially fails** → show succeeded tabs, retry failed tab individually. No placeholder or hallucinated content in failed tabs.

---

## Out of scope (explicit)

- File upload for context (post-Friday)
- Screen recording during interview
- Real-time transcript or goals feed during interview
- Multi-user access
- Reconfirmation flow
- Multi-session memory
- Prism integration (Friday morning stretch)
- Download as .txt — export is copy to clipboard only for MVP

---

## Decisions — resolved

1. **Who is in the Meet?** Just the interviewee. Solutions engineer observes. Timmy addresses the interviewee only.
2. **Fallback sidebar** → manual relay mode. Timmy's question shown as large text. Solutions engineer reads it out loud and types the response back in.
3. **Export** → copy to clipboard only. One click copies the content so the user can paste into any doc.

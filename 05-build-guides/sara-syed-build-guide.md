# Build Guide — Sara & Syed
## Timmy Voice Interview Loop + Google Meet Integration

*Owner: Sara Intikhab + Syed (Hussain)*  
*Window: Thu all day*  
*Goal: Timmy joins a Google Meet, conducts a voice interview, and the flowchart builds live*

---

## Before you write a single line of code

Get this API key right now. Everything else is blocked until you have it.

1. **Recall.ai** — recall.ai, self-serve sign-up, no sales call needed

**ElevenLabs — do not set up from scratch.** Prism already has a running ElevenLabs integration. Ask Aqib for the credentials/config. Reuse that — don't create a new account or key.

Once you have access, pick a Timmy voice in the ElevenLabs console before starting. Don't default to whatever comes first. Pick something that sounds like a calm, professional interviewer.

Also confirm you have your **OpenAI API key** in `.env.local` — you need it for the extraction and question generation calls.

---

## Build sequence — 4 steps, same session

### Step 1 — Build the core Timmy loop (text only, no audio)
**~2 hours**

Build this as a standalone backend script. No UI. No audio. Text in, text out.

The loop runs once per conversation turn:

```
hardcoded_user_answer (string)
  → extraction_call()       → structured JSON
  → kb_update()             → append to local array
  → goal_tracker()          → which goals are now covered?
  → question_generator()    → next question (string)
  → print to console
```

**Done when:** you can paste a fake user answer ("When a refund request comes in, our AP clerk receives it by email and logs it in SAP"), run the script, and see a sensible follow-up question printed to the terminal.

**Verify before moving on:**
- Does the extraction JSON look correct? (right steps, actors, decisions)
- Does the question reference what was just said?
- Does the goal tracker correctly mark goals as covered?

---

### Step 2 — Add ElevenLabs TTS
**~1 hour**

Take Timmy's question text from Step 1 and convert it to audio.

```
question_text (string)
  → ElevenLabs API call
  → audio bytes (MP3)
  → play through speakers OR save to file
```

**Important:** Check Recall.ai's audio injection docs NOW for the required audio format (PCM, Opus, or other). Configure the ElevenLabs output format to match from the start — this saves a conversion headache in Step 3.

**Done when:** Timmy's question plays out loud through your speakers after each loop iteration.

**Verify:** Does Timmy sound natural? Is the latency acceptable (under ~2 seconds from question generated to audio start)?

---

### Step 3 — Wire Recall.ai (Meet integration)
**~2-3 hours**

Replace the two hardcoded parts (text input, speaker playback) with Recall.ai.

**3a — Bot joins the Meet**
```python
POST https://api.recall.ai/api/v1/bot
{
  "meeting_url": "https://meet.google.com/xxx-yyyy-zzz",
  "bot_name": "Timmy"
}
```
Recall.ai returns a `bot_id`. The bot joins the call.

**3b — Receive transcript from Recall.ai**
Open a websocket to Recall.ai. Listen for `utterance_end` events. Each event gives you the transcript text of what the interviewee just said. Feed that into your extraction call instead of the hardcoded string from Step 1.

**3c — Send Timmy's audio into the call**
After TTS generates audio bytes, POST them to Recall.ai's audio injection endpoint. The bot plays Timmy's voice in the Meet.

```
Recall.ai websocket → utterance_end → transcript_text
  → extraction_call()
  → kb_update()
  → goal_tracker()
  → question_generator()
  → ElevenLabs TTS → audio_bytes
  → POST audio to Recall.ai bot → Timmy speaks in Meet
```

**Done when:** You can open a test Google Meet, the bot joins, you say something, and Timmy responds with audio in the call.

---

### Step 4 — Connect the flowchart UI
**~2 hours (can run in parallel with Step 3)**

The loop already produces structured extraction JSON per turn. That JSON is the data source for the flowchart.

After each `kb_update()`, emit the new node/edge data to the frontend (websocket or polling). The flowchart re-renders with the new node.

Aqib's prototype already has the flowchart renderer — wire the data source, don't rebuild the renderer.

**Done when:** A new node appears on the flowchart after each interview turn during a live test.

---

## Risk gate

**If Recall.ai is not working end-to-end by Thu 15:00, switch to the fallback immediately.**

Fallback: Timmy runs as a separate browser tab. The interviewee is on Google Meet. The interviewer screen-shares the Timmy tab (showing the live flowchart). Timmy's audio plays through the interviewer's speakers. The loop is identical — only the audio plumbing changes. The fallback costs zero extra build time if Steps 1 and 2 are done.

Do not chase Recall.ai past 15:00.

---

## Full loop diagram

```
┌─────────────────────────────────────────────────────┐
│                   TIMMY LOOP (per turn)             │
│                                                     │
│  Interviewee speaks in Meet                        │
│         ↓                                          │
│  Recall.ai websocket → utterance_end + transcript  │
│         ↓                                          │
│  [Extraction call]                                 │
│    Input:  transcript text + conversation history  │
│    Output: { steps, actors, decisions,             │
│              systems, confidence }                 │
│         ↓                                          │
│  [KB update]                                       │
│    Append extraction JSON to local array           │
│         ↓                                          │
│  [Goal tracker]                                    │
│    Check which of 3-5 goals are now covered        │
│    (string matching, no LLM needed)                │
│         ↓                                          │
│  [Question generator]                              │
│    Input:  context blob + goal coverage +          │
│            KB summary + last 3 turns               │
│    Output: one question (string)                   │
│         ↓                                          │
│  [ElevenLabs TTS]                                  │
│    Input:  question text                           │
│    Output: audio bytes                             │
│         ↓                                          │
│  [Recall.ai audio injection]                       │
│    Timmy speaks in the Meet call                   │
│         ↓                                          │
│  [Flowchart update]                                │
│    Emit new KB node → frontend re-renders          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Explainers

### Why build the text loop first before adding audio?

If the extraction is producing wrong JSON or the question generator is hallucinating, you want to catch that in a terminal where you can read the output instantly. Debugging audio is slower — you have to listen to it, and audio errors look the same as logic errors. Verify the brain works before adding the voice.

### Why ElevenLabs over OpenAI TTS?

OpenAI TTS is simpler and good enough. But ElevenLabs voices sound significantly more natural in conversational context — the demo lives or dies on whether Timmy feels like a real interviewer. A robotic voice undermines the effect even if the questions are great. Prism already has ElevenLabs running, so there's no setup cost. Use it.

### Why Recall.ai over other options?

The alternative is building a browser extension or sidebar app that captures Meet audio — possible but takes longer and is less robust. Recall.ai gives you the audio stream and transcription as a managed service. You focus on Timmy's logic, not on audio capture engineering. For a 1.5-day build, this is the right trade.

### What is the KB actually?

For the MVP, it's a local array of extraction JSONs. Each turn appends one object:

```json
{
  "turn": 3,
  "transcript": "The AP clerk logs it in SAP and sends a confirmation email",
  "steps": ["Log in SAP", "Send confirmation email"],
  "actors": ["AP clerk"],
  "decisions": [],
  "systems": ["SAP", "Email"],
  "confidence": 1
}
```

That array is the knowledge base. No vector DB. No embeddings. The question generator gets a plain-text summary of it. The flowchart reads from it. The output generator (SIPOC, SOP) reads from it at the end.

### What is the goal tracker actually?

A function that takes the KB array and the exploration goals list and returns a coverage status. For the MVP, simple keyword/concept matching per goal is enough. Example:

```
Goal: "Understand who initiates the refund request"
→ scan KB for actor mentions related to initiation
→ if found with confidence ≤ 2, mark as covered
```

No LLM call. No complexity. It just needs to tell the question generator which goals still need attention.

### What happens when all goals are covered?

The question generator prompt has a priority order. When all goals are marked covered, it falls through to: "Summarize what you've learned and offer to close the interview." Timmy says something like: "I think I have a good picture of the refund process. Let me summarize what I've understood — does that match your experience?" The interviewer or interviewee can then end the session, which triggers output generation.

### What is Timmy's conversation logic in the question generator?

One LLM call with this priority order baked into the prompt:

1. If the last answer was vague → ask for clarification on that specific point
2. If you detected a decision point → explore its conditions and outcomes
3. If an exploration goal is still uncovered → transition to it naturally
4. If all goals are covered → summarize and offer to close

The LLM gets: the context blob, the goal coverage status, the accumulated KB summary, and the last 3 conversation turns. It returns one question. That's Timmy's entire brain.

# Story 06 — Interview In Progress

**Screen:** `InterviewInProgress`
**Route:** `/projects/:id/live`
**File:** `src/screens/InterviewInProgress.jsx`
**Status:** EXISTS — verify it matches this spec exactly, fix any gaps

---

## What this screen does

The live session screen. It is shown while Timmy (the AI interviewer) is actively conducting the process discovery interview. The screen counts up from zero, shows which discovery goals have been covered so far (static demo state), and holds a two-step "End interview" confirmation so an accidental tap does not abort a live call. When the user confirms the end, the project is marked complete and the app navigates to the outputs screen.

---

## Technical anatomy

### File location
```
src/
  screens/
    InterviewInProgress.jsx   ← this story
  components/
    Timmy.jsx                 ← avatar, pass size/state/label
    AppNav.jsx
  store.js
  App.jsx                     ← route already registered here
```

### Route registration (already in App.jsx — do not change)
```jsx
<Route path="/projects/:id/live" element={<InterviewInProgress />} />
```

### Imports required
```jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { Timmy } from '../components/Timmy';
import { useStore } from '../store';
```

---

## The `useTimer` custom hook

Define `useTimer` **at module level, outside the component**. It is not exported — it is local to this file only.

```jsx
function useTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = n => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
```

Key behaviours:
- Interval fires every 1000 ms and increments `seconds` by 1
- Cleanup: `return () => clearInterval(t)` runs on unmount — no memory leak
- Returns `mm:ss` format when elapsed time is under one hour
- Returns `hh:mm:ss` format when elapsed time is one hour or more
- `pad()` uses `String(n).padStart(2, '0')` — always at least two digits

---

## Data contract

The screen reads from the Zustand store using `useParams` to resolve the project:

```jsx
const { id } = useParams();
const { projects, updateProject } = useStore();
const project = projects.find(p => p.id === id);
```

Fields used on this screen:

| Field | Type | Used for |
|---|---|---|
| `id` | `string` | URL param, store writes |
| `clientName` | `string` | Nav breadcrumb |
| `processName` | `string` | Nav breadcrumb |
| `goals` | `Goal[]` | Goal coverage chips |
| `interviewMode` | `'voice' \| 'voice+screen'` | Screen capture panel + timer sub-text |

### Guard: project not found
If `project` is undefined (stale URL, direct navigation to a deleted project), redirect immediately and return null:

```jsx
if (!project) { navigate('/'); return null; }
```

No error UI is needed — a hard redirect to home is the correct recovery path.

---

## Store contract

```jsx
const { projects, updateProject } = useStore();
```

- `projects: Project[]` — full project array; screen resolves its own project via `find`
- `updateProject(id, patch): void` — merges `patch` into the project with matching `id`

### Store write on end
```jsx
updateProject(id, { status: 'complete', pctUnderstood: 72 });
```

Both fields are written atomically in one call. `pctUnderstood: 72` is hardcoded demo data — it is not derived from real interview analysis.

---

## Local state

| Variable | Type | Initial | Purpose |
|---|---|---|---|
| `confirmEnd` | `boolean` | `false` | Two-step end-interview confirmation guard |

`timer` is the return value of `useTimer()` — it is a string, not a state variable. Do not add a `useState` for it.

---

## Derived values (no useState)

```jsx
const goals = project.goals ?? [];
const isScreenMode = project.interviewMode === 'voice+screen';
```

These are plain expressions computed on every render. Do not lift them into state.

---

## Layout

Outer shell:
```jsx
<div className="app-shell">
  <AppNav crumbs={['Process Discovery', `${project.clientName} · ${project.processName}`, 'Live']} />
  <div className="screen-body center" style={{ minHeight: 560 }}>
    {/* content */}
  </div>
</div>
```

The `center` modifier on `screen-body` centres all content horizontally. `minHeight: 560` keeps the layout stable while the screen capture panel appears and disappears.

---

## UI element order (top to bottom)

1. "Interview in progress" live chip
2. Timmy avatar
3. Screen capture panel (conditional — voice+screen mode only)
4. Timer display
5. Timer sub-text
6. Goal coverage chips (conditional — only when goals.length > 0)
7. End interview action row

---

## 1. "Interview in progress" chip

```jsx
<span className="chip live" style={{ marginBottom: 32 }}>
  <span className="dot" />
  Interview in progress
</span>
```

Class `chip live` gives the glowing green dot automatically. `marginBottom: 32` separates it from Timmy below.

---

## 2. Timmy avatar

```jsx
<Timmy size={180} state="speaking" label />
```

- `size={180}` — large format, centrepiece of the screen
- `state="speaking"` — animation state indicating active interview
- `label` — shorthand for `label={true}`, renders a text label below the avatar

---

## 3. Screen capture panel (voice+screen mode only)

Renders only when `isScreenMode === true`:

```jsx
{isScreenMode && (
  <div className="screen-capture-wrap mt-32">
    <span className="screen-capture-badge">● Recording</span>
    <div className="screen-capture-preview">
      Screen capture active
    </div>
  </div>
)}
```

| Element | Class | Copy |
|---|---|---|
| Container | `screen-capture-wrap mt-32` | — |
| Badge | `screen-capture-badge` | `● Recording` |
| Preview box | `screen-capture-preview` | `Screen capture active` |

This is a visual indicator only. There is no actual screen recording happening.

---

## 4. Timer display

```jsx
<div className={`timer ${isScreenMode ? 'mt-16' : 'mt-32'}`}>{timer}</div>
```

Top margin is context-sensitive:
- `mt-32` when there is no screen capture panel (voice-only mode)
- `mt-16` when the screen capture panel is shown (voice+screen mode) — the panel already provides visual separation, so less margin is needed

The `timer` value is the string returned by `useTimer()` — e.g. `"02:47"` or `"1:03:12"`.

---

## 5. Timer sub-text

```jsx
<p className="muted mt-8" style={{ fontSize: 14 }}>
  {isScreenMode
    ? "Timmy is recording. The page won't update until the interview ends."
    : "Timmy is on the call. The page won't update until the interview ends."}
</p>
```

| Mode | Copy |
|---|---|
| `voice+screen` | `Timmy is recording. The page won't update until the interview ends.` |
| `voice` | `Timmy is on the call. The page won't update until the interview ends.` |

---

## 6. Goal coverage chips (only when goals.length > 0)

```jsx
{goals.length > 0 && (
  <div className="row gap-8 mt-32" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
    {goals.map((g, i) => (
      <span key={g.id} className={`chip ${i < 2 ? 'live' : ''}`} style={i > 2 ? { opacity: 0.5 } : {}}>
        <span className="dot" style={i < 2 ? {} : i === 2 ? {} : { background: 'var(--beam-w-25)' }} />
        {i < 2 ? `Goal ${i + 1} covered` : i === 2 ? `Goal ${i + 1} …` : `Goal ${i + 1}`}
      </span>
    ))}
  </div>
)}
```

### Per-index rules

| Index `i` | Chip class | Chip style | Dot style | Label |
|---|---|---|---|---|
| 0 | `chip live` | `{}` | `{}` (green glow) | `Goal 1 covered` |
| 1 | `chip live` | `{}` | `{}` (green glow) | `Goal 2 covered` |
| 2 | `chip` | `{}` | `{}` (default) | `Goal 3 …` |
| 3+ | `chip` | `{ opacity: 0.5 }` | `{ background: 'var(--beam-w-25)' }` | `Goal 4`, `Goal 5`, … |

Rules explained:
- `i < 2` — first two goals get the `live` class (green glow) and the "covered" label
- `i === 2` — third goal gets no `live` class, default dot, and an ellipsis label indicating in-progress
- `i > 2` — all remaining goals are faded to 50% opacity with a grey dot, showing they are pending

**Important:** This is a static demo visual. The chips do not update as the interview progresses. There is no mechanism connecting real interview speech to goal completion.

---

## 7. End interview action row

Two-step confirmation prevents accidental termination of a live session.

```jsx
<div className="row gap-16 mt-48" style={{ alignItems: 'center' }}>
  {confirmEnd ? (
    <>
      <span style={{ fontSize: 14, color: 'var(--fg-on-dark-2)' }}>
        Timmy hasn't covered all goals. End anyway?
      </span>
      <button className="btn danger" onClick={handleEnd}>Yes, end now</button>
      <button className="btn ghost" onClick={() => setConfirmEnd(false)}>Keep going</button>
    </>
  ) : (
    <button className="btn danger" onClick={handleEnd}>End interview</button>
  )}
</div>
```

### `handleEnd` function

```jsx
function handleEnd() {
  if (!confirmEnd) { setConfirmEnd(true); return; }
  updateProject(id, { status: 'complete', pctUnderstood: 72 });
  navigate(`/projects/${id}/outputs`);
}
```

### State machine

```
Initial state (confirmEnd = false):
  "End interview" button visible
  ↓ user clicks
  confirmEnd → true

Confirmation state (confirmEnd = true):
  Warning text + "Yes, end now" + "Keep going" visible

  "Yes, end now" clicked:
    → updateProject(id, { status: 'complete', pctUnderstood: 72 })
    → navigate(`/projects/${id}/outputs`)

  "Keep going" clicked:
    → confirmEnd → false (returns to initial state)
```

The warning text — `"Timmy hasn't covered all goals. End anyway?"` — is always shown in the confirmation state regardless of actual goal coverage. It is not computed from the goals array.

---

## Navigation map

```
Screen loads        ← navigated here from project list (status: 'interviewing')
                      or from pre-interview setup screen

User confirms end   → navigate(`/projects/${id}/outputs`)

project not found   → navigate('/')    (guard at top of component)
```

There is no back button and no cancel navigation. The only way off this screen is:
1. Confirm end → outputs
2. Guard redirect → home (only if project is missing from store)

This is deliberate — the live interview state should not be accidentally exited.

---

## Exact copy (all user-visible strings)

| Location | String |
|---|---|
| Nav breadcrumb [0] | `Process Discovery` |
| Nav breadcrumb [1] | `${project.clientName} · ${project.processName}` |
| Nav breadcrumb [2] | `Live` |
| Live chip | `Interview in progress` |
| Screen capture badge | `● Recording` |
| Screen capture preview | `Screen capture active` |
| Timer sub-text (voice+screen) | `Timmy is recording. The page won't update until the interview ends.` |
| Timer sub-text (voice only) | `Timmy is on the call. The page won't update until the interview ends.` |
| Goal chip (i < 2) | `Goal ${i + 1} covered` |
| Goal chip (i === 2) | `Goal ${i + 1} …` |
| Goal chip (i > 2) | `Goal ${i + 1}` |
| End button (initial) | `End interview` |
| Confirmation warning | `Timmy hasn't covered all goals. End anyway?` |
| Confirm end button | `Yes, end now` |
| Cancel button | `Keep going` |

---

## Constraints — do NOT build these

- **No real-time transcript feed** — there is no transcript display on this screen
- **No ElevenLabs TTS integration** — the screen is display only; no audio is wired here
- **No speech detection** — Timmy's "speaking" state is a static prop, not driven by audio activity
- **No actual screen recording** — the screen capture panel is a visual indicator only; no capture API is called
- **No auto-advance of goal chips** — goal chip states are static hardcoded demo visuals; they do not update as the interview progresses
- **No back button or cancel link** — deliberate; user must use "End interview" or "Keep going"
- **No pause/mute controls** — the live session cannot be paused from this screen
- **No loading spinner** — the store is synchronous; project lookup is instant
- **No error state** — missing project hard-redirects to `/` without rendering error UI
- **No elapsed-time persistence** — the timer resets to `00:00` on every mount; it is not stored

---

## Full component (exact source)

```jsx
// src/screens/InterviewInProgress.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { Timmy } from '../components/Timmy';
import { useStore } from '../store';

function useTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = n => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function InterviewInProgress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject } = useStore();
  const project = projects.find(p => p.id === id);
  const timer = useTimer();
  const [confirmEnd, setConfirmEnd] = useState(false);

  if (!project) { navigate('/'); return null; }

  const goals = project.goals ?? [];
  const isScreenMode = project.interviewMode === 'voice+screen';

  function handleEnd() {
    if (!confirmEnd) { setConfirmEnd(true); return; }
    updateProject(id, { status: 'complete', pctUnderstood: 72 });
    navigate(`/projects/${id}/outputs`);
  }

  return (
    <div className="app-shell">
      <AppNav crumbs={['Process Discovery', `${project.clientName} · ${project.processName}`, 'Live']} />
      <div className="screen-body center" style={{ minHeight: 560 }}>
        <span className="chip live" style={{ marginBottom: 32 }}>
          <span className="dot" />
          Interview in progress
        </span>

        <Timmy size={180} state="speaking" label />

        {isScreenMode && (
          <div className="screen-capture-wrap mt-32">
            <span className="screen-capture-badge">● Recording</span>
            <div className="screen-capture-preview">
              Screen capture active
            </div>
          </div>
        )}

        <div className={`timer ${isScreenMode ? 'mt-16' : 'mt-32'}`}>{timer}</div>
        <p className="muted mt-8" style={{ fontSize: 14 }}>
          {isScreenMode
            ? "Timmy is recording. The page won't update until the interview ends."
            : "Timmy is on the call. The page won't update until the interview ends."}
        </p>

        {goals.length > 0 && (
          <div className="row gap-8 mt-32" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {goals.map((g, i) => (
              <span key={g.id} className={`chip ${i < 2 ? 'live' : ''}`} style={i > 2 ? { opacity: 0.5 } : {}}>
                <span className="dot" style={i < 2 ? {} : i === 2 ? {} : { background: 'var(--beam-w-25)' }} />
                {i < 2 ? `Goal ${i + 1} covered` : i === 2 ? `Goal ${i + 1} …` : `Goal ${i + 1}`}
              </span>
            ))}
          </div>
        )}

        <div className="row gap-16 mt-48" style={{ alignItems: 'center' }}>
          {confirmEnd ? (
            <>
              <span style={{ fontSize: 14, color: 'var(--fg-on-dark-2)' }}>Timmy hasn't covered all goals. End anyway?</span>
              <button className="btn danger" onClick={handleEnd}>Yes, end now</button>
              <button className="btn ghost" onClick={() => setConfirmEnd(false)}>Keep going</button>
            </>
          ) : (
            <button className="btn danger" onClick={handleEnd}>End interview</button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Definition of Done

### Routing
- [ ] Navigating to `/projects/:id/live` renders `InterviewInProgress` for the matching project
- [ ] A stale or unknown `:id` silently redirects to `/` without rendering error UI

### Timer
- [ ] Timer starts at `00:00` on mount and counts up one second at a time
- [ ] Timer displays `mm:ss` format for elapsed time under one hour
- [ ] Timer displays `hh:mm:ss` format for elapsed time of one hour or more
- [ ] Navigating away (ending the interview) clears the interval — no memory leak

### Timmy avatar
- [ ] Timmy renders at size 180 with `state="speaking"` and `label={true}`

### Screen capture panel
- [ ] Panel is visible when `project.interviewMode === 'voice+screen'`
- [ ] Panel is absent when `project.interviewMode === 'voice'`
- [ ] Badge reads `● Recording` and preview reads `Screen capture active`

### Timer margin
- [ ] Timer has `mt-32` when in voice-only mode
- [ ] Timer has `mt-16` when in voice+screen mode (screen capture panel is shown)

### Timer sub-text
- [ ] Voice+screen mode shows: `Timmy is recording. The page won't update until the interview ends.`
- [ ] Voice-only mode shows: `Timmy is on the call. The page won't update until the interview ends.`

### Goal chips
- [ ] Goal chips section does not render when `project.goals` is empty or undefined
- [ ] Goal chips section renders when `project.goals` has one or more entries
- [ ] First two chips (i=0, i=1) have class `chip live`, green dot, label `Goal N covered`
- [ ] Third chip (i=2) has class `chip` (no live), default dot, label `Goal 3 …`
- [ ] Fourth and later chips (i≥3) have class `chip`, `opacity: 0.5`, grey dot (`var(--beam-w-25)`), label `Goal N`

### End interview — initial state
- [ ] A single "End interview" button (class `btn danger`) is shown
- [ ] Clicking it once sets `confirmEnd = true` and does NOT navigate or write to the store

### End interview — confirmation state
- [ ] Warning text `Timmy hasn't covered all goals. End anyway?` is visible
- [ ] "Yes, end now" button (class `btn danger`) is visible
- [ ] "Keep going" button (class `btn ghost`) is visible
- [ ] "End interview" button is no longer visible in this state

### End interview — confirmed
- [ ] Clicking "Yes, end now" calls `updateProject(id, { status: 'complete', pctUnderstood: 72 })`
- [ ] After the store write, navigates to `/projects/${id}/outputs`

### Keep going
- [ ] Clicking "Keep going" sets `confirmEnd = false`
- [ ] The single "End interview" button is restored; the confirmation row disappears

### Nav breadcrumbs
- [ ] Breadcrumb [0] is `Process Discovery`
- [ ] Breadcrumb [1] is `${project.clientName} · ${project.processName}` (with middle-dot separator)
- [ ] Breadcrumb [2] is `Live`

### What must NOT be present
- [ ] No real-time transcript or speech feed
- [ ] No pause, mute, or volume controls
- [ ] No back button or cancel navigation
- [ ] No loading spinner
- [ ] No error state UI (redirect only)
- [ ] No elapsed-time persistence across mounts

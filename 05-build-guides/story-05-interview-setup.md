# Story 05 — Interview Setup

**Screen:** `InterviewSetup`
**Route:** `/projects/:id/setup`
**File:** `src/screens/InterviewSetup.jsx`
**Status:** Exists — verify it matches this spec exactly, fix any gaps

---

## What this screen does

The pre-interview configuration step. The user picks how Timmy will conduct the interview — voice-only or voice with screen recording — and then launches the live session. It is the last stop before `/projects/:id/live`. The screen shows a summary of what Timmy already knows (goal count, whether context was loaded, and the voice provider) so the user can confirm they are ready before starting.

---

## Technical anatomy

### File location
```
src/
  screens/
    InterviewSetup.jsx   ← this story
  components/
    AppNav.jsx
    Timmy.jsx
  store.js
  App.jsx                ← route is already registered here
```

### Route registration (already in App.jsx — do not change)
```jsx
<Route path="/projects/:id/setup" element={<InterviewSetup />} />
```

### Imports required
```jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { Timmy } from '../components/Timmy';
import { useStore } from '../store';
```

---

## Module-level constant

`MODES` is defined at the top of the module, outside the component. Do not move it inside the component.

```js
const MODES = [
  {
    id: 'voice',
    icon: '🎤',
    title: 'Voice only',
    desc: 'Timmy asks questions, you answer out loud. No recording needed.',
  },
  {
    id: 'voice+screen',
    icon: '🖥',
    title: 'Voice + Screen recording',
    desc: 'Timmy asks questions while capturing your screen. Best for process mapping.',
  },
];
```

---

## Data contract

The screen reads one project from the Zustand store using the `:id` URL param.

Fields used on this screen:

| Field | Type | Used for |
|---|---|---|
| `id` | `string` | URL param lookup, navigation targets |
| `clientName` | `string` | Nav breadcrumb |
| `processName` | `string` | Nav breadcrumb |
| `goals` | `Goal[]` | `goals.length` chip |
| `contextBlob` | `string` | Truthy check for context chip |

---

## Store contract

```jsx
const { projects, updateProject } = useStore();
```

- `projects: Project[]` — full project array; this screen finds the right one by `id`
- `updateProject(id, patch): void` — merges `patch` into the project with that `id`

### Write on start

```js
updateProject(id, { interviewMode: mode, status: 'interviewing' })
```

This is called once inside `handleStart()`, before the 400 ms delay and navigation.

---

## Local state

```jsx
const [mode, setMode] = useState('voice');       // which MODES entry is selected
const [starting, setStarting] = useState(false); // true during the 400 ms transition delay
```

- `mode` defaults to `'voice'` — Voice only is pre-selected on first render.
- `starting` is `false` on mount. It becomes `true` the instant `handleStart` fires and stays `true` for the lifetime of the component (navigation destroys it immediately after).

---

## Guard: project not found

```jsx
if (!project) { navigate('/'); return null; }
```

This runs after the `find`. If no project matches the URL param, the component navigates to `/` and returns null immediately. There is no loading state — the store is synchronous.

---

## Navigation map

```
User clicks "← Back to goals"   → navigate(`/projects/${id}/goals`)

User clicks "▶ Start interview":
  1. setStarting(true)
  2. updateProject(id, { interviewMode: mode, status: 'interviewing' })
  3. await 400 ms (Promise/setTimeout)
  4. navigate(`/projects/${id}/live`)
```

### handleStart implementation

```jsx
async function handleStart() {
  setStarting(true);
  updateProject(id, { interviewMode: mode, status: 'interviewing' });
  // Brief transition delay so state write is flushed before navigation
  await new Promise(r => setTimeout(r, 400));
  navigate(`/projects/${id}/live`);
}
```

The 400 ms delay is intentional — it ensures the Zustand write is flushed before the LiveInterview screen mounts and reads the store. Do not remove it.

---

## Layout

The screen uses `"screen-body center"` — this centres content both vertically and horizontally on the page. There is no left-aligned constrained container and no step indicator.

```
app-shell
  AppNav  (crumbs below)
  screen-body center
    Timmy  (size=140, state="idle", label=true)
    h2.screen-title.mt-32       "Ready to start the interview"
    p.screen-sub (maxWidth 500) "Choose how you'd like Timmy to conduct the interview."
    Mode card list  (width 100%, maxWidth 520, col gap-12, mt-32)
      mode-card × 2
    Summary chips row  (mt-32, flexWrap, centred)
      chip × 3
    Action buttons row  (mt-48, gap-16, centred)
      btn ghost  "← Back to goals"
      btn primary lg  "▶ Start interview" / "◌ Starting…"
```

---

## Timmy component

```jsx
<Timmy size={140} state="idle" label />
```

- `size={140}` — rendered at 140 px
- `state="idle"` — the calm, non-animated avatar state
- `label` — boolean prop; when true, displays the "Timmy · Beam AI" label below the avatar

---

## Heading and sub-copy

```jsx
<h2 className="screen-title mt-32">Ready to start the interview</h2>
<p className="screen-sub" style={{ maxWidth: 500 }}>
  Choose how you'd like Timmy to conduct the interview.
</p>
```

---

## Mode cards

Rendered by mapping over the module-level `MODES` array. The container is `col gap-12 mt-32` at `width: 100%, maxWidth: 520`.

```jsx
<div className="col gap-12 mt-32" style={{ width: '100%', maxWidth: 520 }}>
  {MODES.map(m => (
    <button
      key={m.id}
      className={`mode-card ${mode === m.id ? 'selected' : ''}`}
      onClick={() => setMode(m.id)}
    >
      <span className="mode-card-icon">{m.icon}</span>
      <div className="col" style={{ gap: 4 }}>
        <div className="mode-card-title">{m.title}</div>
        <div className="mode-card-desc">{m.desc}</div>
      </div>
      <span className={`mode-radio ${mode === m.id ? 'checked' : ''}`} />
    </button>
  ))}
</div>
```

### Mode card CSS classes (already in index.css — do not redefine)

| Class | Description |
|---|---|
| `.mode-card` | Flex row card, full-width button |
| `.mode-card.selected` | Highlighted border (blue), filled background |
| `.mode-card-icon` | Large emoji/icon area, left side |
| `.mode-card-title` | Bold title text |
| `.mode-card-desc` | Muted description text |
| `.mode-radio` | Right-aligned radio circle |
| `.mode-radio.checked` | Filled radio dot |

---

## Summary chips

Three chips rendered in a flex row, wrapping, centred, at `mt-32`.

```jsx
<div className="row gap-8 mt-32" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
  <span className="chip"><span className="dot" /> {project.goals.length} goals to cover</span>
  <span className="chip"><span className="dot" /> {project.contextBlob ? 'Context loaded' : 'No context'}</span>
  <span className="chip"><span className="dot" /> Voice: ElevenLabs</span>
</div>
```

| Chip | Logic |
|---|---|
| Goals | `{project.goals.length} goals to cover` — always shows a number |
| Context | `'Context loaded'` if `project.contextBlob` is truthy, otherwise `'No context'` |
| Voice | Always `'Voice: ElevenLabs'` — static string, no condition |

---

## Action buttons

```jsx
<div className="row gap-16 mt-48" style={{ alignItems: 'center' }}>
  <button className="btn ghost" onClick={() => navigate(`/projects/${id}/goals`)}>
    ← Back to goals
  </button>
  <button
    className="btn primary lg"
    disabled={starting}
    onClick={handleStart}
  >
    {starting ? '◌ Starting…' : '▶ Start interview'}
  </button>
</div>
```

### Button states

| `starting` | Label | `disabled` |
|---|---|---|
| `false` | `▶ Start interview` | `false` — always clickable before handleStart fires |
| `true` | `◌ Starting…` | `true` — disabled during the 400 ms delay |

The button is **never** disabled on initial render — `mode` always has a value (`'voice'` by default), so there is no empty/unselected condition to guard against.

---

## Nav breadcrumbs

```jsx
<AppNav crumbs={['Process Discovery', `${project.clientName} · ${project.processName}`, 'Interview']} />
```

Three crumb segments:
1. `Process Discovery` (static)
2. `` `${project.clientName} · ${project.processName}` `` (dynamic, uses a centre-dot `·`)
3. `Interview` (static)

---

## Exact copy (all user-visible strings)

| Location | String |
|---|---|
| Nav breadcrumb [0] | `Process Discovery` |
| Nav breadcrumb [1] | `{clientName} · {processName}` |
| Nav breadcrumb [2] | `Interview` |
| Screen title | `Ready to start the interview` |
| Screen subtitle | `Choose how you'd like Timmy to conduct the interview.` |
| Mode 1 title | `Voice only` |
| Mode 1 desc | `Timmy asks questions, you answer out loud. No recording needed.` |
| Mode 2 title | `Voice + Screen recording` |
| Mode 2 desc | `Timmy asks questions while capturing your screen. Best for process mapping.` |
| Chip 1 | `{N} goals to cover` |
| Chip 2 (context) | `Context loaded` or `No context` |
| Chip 3 | `Voice: ElevenLabs` |
| Back button | `← Back to goals` |
| Start button (idle) | `▶ Start interview` |
| Start button (loading) | `◌ Starting…` |

---

## Full component

```jsx
// src/screens/InterviewSetup.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { Timmy } from '../components/Timmy';
import { useStore } from '../store';

const MODES = [
  {
    id: 'voice',
    icon: '🎤',
    title: 'Voice only',
    desc: 'Timmy asks questions, you answer out loud. No recording needed.',
  },
  {
    id: 'voice+screen',
    icon: '🖥',
    title: 'Voice + Screen recording',
    desc: 'Timmy asks questions while capturing your screen. Best for process mapping.',
  },
];

export function InterviewSetup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject } = useStore();
  const project = projects.find(p => p.id === id);
  const [mode, setMode] = useState('voice');
  const [starting, setStarting] = useState(false);

  if (!project) { navigate('/'); return null; }

  async function handleStart() {
    setStarting(true);
    updateProject(id, { interviewMode: mode, status: 'interviewing' });
    // Brief transition delay so state write is flushed before navigation
    await new Promise(r => setTimeout(r, 400));
    navigate(`/projects/${id}/live`);
  }

  return (
    <div className="app-shell">
      <AppNav crumbs={['Process Discovery', `${project.clientName} · ${project.processName}`, 'Interview']} />
      <div className="screen-body center">
        <Timmy size={140} state="idle" label />

        <h2 className="screen-title mt-32">Ready to start the interview</h2>
        <p className="screen-sub" style={{ maxWidth: 500 }}>
          Choose how you'd like Timmy to conduct the interview.
        </p>

        <div className="col gap-12 mt-32" style={{ width: '100%', maxWidth: 520 }}>
          {MODES.map(m => (
            <button
              key={m.id}
              className={`mode-card ${mode === m.id ? 'selected' : ''}`}
              onClick={() => setMode(m.id)}
            >
              <span className="mode-card-icon">{m.icon}</span>
              <div className="col" style={{ gap: 4 }}>
                <div className="mode-card-title">{m.title}</div>
                <div className="mode-card-desc">{m.desc}</div>
              </div>
              <span className={`mode-radio ${mode === m.id ? 'checked' : ''}`} />
            </button>
          ))}
        </div>

        <div className="row gap-8 mt-32" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="chip"><span className="dot" /> {project.goals.length} goals to cover</span>
          <span className="chip"><span className="dot" /> {project.contextBlob ? 'Context loaded' : 'No context'}</span>
          <span className="chip"><span className="dot" /> Voice: ElevenLabs</span>
        </div>

        <div className="row gap-16 mt-48" style={{ alignItems: 'center' }}>
          <button className="btn ghost" onClick={() => navigate(`/projects/${id}/goals`)}>← Back to goals</button>
          <button
            className="btn primary lg"
            disabled={starting}
            onClick={handleStart}
          >
            {starting ? '◌ Starting…' : '▶ Start interview'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Constraints — do NOT build these

- **No step indicator** — this screen uses centred layout, not the left-aligned flow with a numbered step bar.
- **No URL validation** — there is no Google Meet URL field or any external meeting link input.
- **No Recall.ai references** — no meeting bot, no recording service integration, no external URLs.
- **No loading spinner on mount** — the store is synchronous; if the project is not found, the guard navigates away immediately.
- **No error state** — the only failure mode is a missing project, which is handled by the guard at the top of the render.
- **No confirmation dialog** — clicking "Start interview" fires immediately; there is no "are you sure?" step.
- **No mode count badge or indicator** — the chip row is not a count of selected options.

---

## Definition of Done

### Routing
- [ ] Navigating to `/projects/:id/setup` with a valid `id` renders `InterviewSetup`
- [ ] Navigating to `/projects/nonexistent-id/setup` redirects to `/`

### Layout
- [ ] Screen uses `"screen-body center"` — content is centred both vertically and horizontally
- [ ] No step indicator is present anywhere on the screen

### Timmy
- [ ] `<Timmy size={140} state="idle" label />` renders with the label visible below the avatar

### Heading and sub-copy
- [ ] Title is `"Ready to start the interview"` with class `screen-title mt-32`
- [ ] Subtitle is `"Choose how you'd like Timmy to conduct the interview."` with class `screen-sub` and `maxWidth: 500`

### Mode cards
- [ ] Two mode cards render in order: Voice only, then Voice + Screen recording
- [ ] Voice only is pre-selected (`.selected` class, `.mode-radio.checked`) on first render
- [ ] Clicking a non-selected card selects it and deselects the other
- [ ] Each card shows the correct icon, title, and description text

### Summary chips
- [ ] Chip 1 shows the correct `goals.length` count
- [ ] Chip 2 shows `"Context loaded"` when `project.contextBlob` is truthy
- [ ] Chip 2 shows `"No context"` when `project.contextBlob` is falsy
- [ ] Chip 3 always shows `"Voice: ElevenLabs"` regardless of mode

### Start button behaviour
- [ ] Button label is `"▶ Start interview"` initially
- [ ] Button is not disabled on initial render
- [ ] Clicking the button sets `starting = true`, disabling it and changing the label to `"◌ Starting…"`
- [ ] `updateProject` is called with `{ interviewMode: mode, status: 'interviewing' }` on click
- [ ] After the 400 ms delay, the app navigates to `/projects/:id/live`
- [ ] The 400 ms setTimeout is present and not removed

### Back button
- [ ] Clicking `"← Back to goals"` navigates to `/projects/:id/goals`
- [ ] The back button is never disabled

### Nav breadcrumbs
- [ ] Crumb 0: `"Process Discovery"`
- [ ] Crumb 1: `"{clientName} · {processName}"` (dynamic, uses centre-dot)
- [ ] Crumb 2: `"Interview"`

### What must NOT be present
- [ ] No step indicator or numbered flow bar
- [ ] No Google Meet URL input or any URL field
- [ ] No Recall.ai, screen recording service, or external meeting bot references
- [ ] No loading spinner on mount
- [ ] No confirmation dialog before starting

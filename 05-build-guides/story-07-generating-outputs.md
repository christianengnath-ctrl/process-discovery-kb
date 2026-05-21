# Story 07 — Generating Outputs

**Screen:** `GeneratingOutputs`
**Route:** `/projects/:id/generating`
**File:** `src/screens/GeneratingOutputs.jsx`
**Status:** Does NOT exist — build from scratch

---

## What this screen does

A transitional loading screen shown immediately after the user ends an interview. It bridges the gap between `InterviewInProgress` and the `Outputs` view by simulating a 4-step generation process with a timed animation. Each step ticks through one by one every 800ms. Once all four steps complete, the screen automatically navigates to the outputs route after an additional 600ms pause. There is no manual "Continue" button — the user just watches and waits.

---

## Technical anatomy

### File location
```
src/
  screens/
    GeneratingOutputs.jsx   ← create this file (new)
  App.jsx                   ← add import + route (modify)
  screens/
    InterviewInProgress.jsx ← change handleEnd navigate target (modify)
  index.css                 ← add .generating-step* classes (modify)
```

### Route registration (add to App.jsx)
```jsx
// Add this import at the top of App.jsx with the other screen imports:
import { GeneratingOutputs } from './screens/GeneratingOutputs';

// Add this route between the /live route and the /outputs route:
<Route path="/projects/:id/generating" element={<GeneratingOutputs />} />
```

### Change to InterviewInProgress.jsx
In `handleEnd`, change the final `navigate(...)` call from:
```js
navigate(`/projects/${id}/outputs`);
```
to:
```js
navigate(`/projects/${id}/generating`);
```
No other changes to `InterviewInProgress.jsx` are needed.

### Imports required
```jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { Timmy } from '../components/Timmy';
import { useStore } from '../store';
```

---

## Data contract

The screen reads one project from the Zustand store by `id` from the URL params:

```jsx
const { projects } = useStore();
const project = projects.find(p => p.id === id);
```

Fields used on this screen: `id`, `clientName`, `processName`.

**Guard:** If `project` is undefined (e.g. bad URL, cleared store), immediately navigate to `/` and return null:
```jsx
if (!project) { navigate('/'); return null; }
```

---

## Steps constant

Defined at module level, outside the component:

```js
const STEPS = [
  { id: 'flowchart',  label: 'Building process flowchart…' },
  { id: 'sipoc',      label: 'Generating SIPOC table…' },
  { id: 'sop',        label: 'Writing SOP document…' },
  { id: 'transcript', label: 'Transcribing interview…' },
];
```

This constant does not change and must not be defined inside the component body.

---

## Local state

One piece of local state only:

```jsx
const [step, setStep] = useState(0);
```

- `step` is an integer starting at 0
- It increments by 1 every 800ms until it reaches `STEPS.length` (4)
- When it equals `STEPS.length`, the 600ms exit timer fires

---

## Timer logic

A single `useEffect` drives the entire animation. It depends on `[step]` and fires on every increment:

```jsx
useEffect(() => {
  if (step < STEPS.length) {
    const t = setTimeout(() => setStep(s => s + 1), 800);
    return () => clearTimeout(t);
  } else {
    const t = setTimeout(() => navigate(`/projects/${id}/outputs`), 600);
    return () => clearTimeout(t);
  }
}, [step]);
```

Total wall-clock time from mount to navigation: 4 × 800ms + 600ms = **3 800ms**.

The effect returns a cleanup function in both branches so timers are cancelled if the component unmounts early (e.g. user navigates away manually).

---

## Navigation map

```
Screen mounts                    → step ticker starts (step = 0)
step increments through 0–3     → each step becomes 'active' then 'done'
step reaches 4 (STEPS.length)   → 600ms hold, then navigate to outputs

Navigating directly to this URL  → same timer fires; auto-advances to outputs
  (e.g. from a complete project bookmark)

project not found in store       → navigate('/') immediately
```

There is no user-triggered navigation on this screen.

---

## Step visual states

Each step renders in one of three CSS states based on its index relative to `step`:

| Condition | Class modifier | Icon | Text colour |
|---|---|---|---|
| `i < step` (already done) | `done` | `✓` | `var(--beam-green-soft)` |
| `i === step` (currently active) | `active` | `◌` | `var(--fg-on-dark-1)` (white) |
| `i > step` (not yet started) | `pending` | `○` | `var(--fg-on-dark-3)` (muted) |

On mount, `step === 0`, so: step 0 is `active`, steps 1–3 are `pending`.

---

## Layout

Use the `center` modifier on `screen-body`:

```jsx
<div className="screen-body center">
```

This centres content horizontally and vertically. There is no left sidebar, no step indicator strip, and no secondary panel on this screen.

---

## UI elements (top to bottom)

1. **Timmy avatar** — `<Timmy size={120} state="speaking" label={false} />` — shown above everything else
2. **Heading** — `"Generating your outputs"` — class `screen-title mt-32`
3. **Sub-heading** — `"This takes about 20 seconds."` — class `screen-sub` (muted)
4. **Step list** — vertical column, class `col gap-12 mt-32`, `width: '100%'`, `maxWidth: 400`

---

## Step list markup

```jsx
<div className="col gap-12 mt-32" style={{ width: '100%', maxWidth: 400 }}>
  {STEPS.map((s, i) => (
    <div key={s.id} className={`generating-step ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
      <span className="generating-step-icon">
        {i < step ? '✓' : i === step ? '◌' : '○'}
      </span>
      <span className="generating-step-label">{s.label}</span>
    </div>
  ))}
</div>
```

The ternary for the class and the ternary for the icon must stay in sync — both use the same `i < step` / `i === step` / else logic.

---

## CSS classes to add to index.css

Add these rules to `src/index.css`. Do not scope them inside a component selector — they are utility classes like all others in the file:

```css
.generating-step {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--fg-on-dark-3);
  transition: color 0.3s;
}
.generating-step.done {
  color: var(--beam-green-soft);
}
.generating-step.active {
  color: var(--fg-on-dark-1);
}
.generating-step-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
  font-family: var(--font-mono);
}
.generating-step-label {
  font-size: 14px;
}
```

The `transition: color 0.3s` on `.generating-step` ensures the colour shift from `pending` → `active` → `done` is smooth rather than a hard cut.

---

## Full component

```jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { Timmy } from '../components/Timmy';
import { useStore } from '../store';

const STEPS = [
  { id: 'flowchart',  label: 'Building process flowchart…' },
  { id: 'sipoc',      label: 'Generating SIPOC table…' },
  { id: 'sop',        label: 'Writing SOP document…' },
  { id: 'transcript', label: 'Transcribing interview…' },
];

export function GeneratingOutputs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects } = useStore();
  const project = projects.find(p => p.id === id);
  const [step, setStep] = useState(0);

  if (!project) { navigate('/'); return null; }

  useEffect(() => {
    if (step < STEPS.length) {
      const t = setTimeout(() => setStep(s => s + 1), 800);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => navigate(`/projects/${id}/outputs`), 600);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="app-shell">
      <AppNav crumbs={['Process Discovery', `${project.clientName} · ${project.processName}`, 'Generating']} />
      <div className="screen-body center">
        <Timmy size={120} state="speaking" label={false} />

        <h2 className="screen-title mt-32">Generating your outputs</h2>
        <p className="screen-sub">This takes about 20 seconds.</p>

        <div className="col gap-12 mt-32" style={{ width: '100%', maxWidth: 400 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} className={`generating-step ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
              <span className="generating-step-icon">
                {i < step ? '✓' : i === step ? '◌' : '○'}
              </span>
              <span className="generating-step-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Summary of all file changes

| File | Change type | What to do |
|---|---|---|
| `src/screens/GeneratingOutputs.jsx` | **Create** | Full component above |
| `src/App.jsx` | **Modify** | Add import + route between `/live` and `/outputs` |
| `src/screens/InterviewInProgress.jsx` | **Modify** | Change `navigate(…/outputs)` to `navigate(…/generating)` in `handleEnd` |
| `src/index.css` | **Modify** | Add `.generating-step*` CSS rules |

---

## Exact copy (all user-visible strings)

| Location | String |
|---|---|
| Nav breadcrumb [0] | `Process Discovery` |
| Nav breadcrumb [1] | `${project.clientName} · ${project.processName}` |
| Nav breadcrumb [2] | `Generating` |
| Screen heading | `Generating your outputs` |
| Screen sub-heading | `This takes about 20 seconds.` |
| Step 1 label | `Building process flowchart…` |
| Step 2 label | `Generating SIPOC table…` |
| Step 3 label | `Writing SOP document…` |
| Step 4 label | `Transcribing interview…` |
| Done icon | `✓` |
| Active icon | `◌` |
| Pending icon | `○` |

---

## Constraints — do NOT build these

- **No "Continue" button** — navigation is fully automatic, triggered only by the timer
- **No manual skip** — the user cannot jump past the animation
- **No real API calls** — the steps are cosmetic; the actual `updateProject` call already happened in `InterviewInProgress.jsx` before navigating here
- **No loading spinner separate from the step list** — the step list IS the progress indicator
- **No percentage counter or progress bar track** — steps only, no numeric progress
- **No sound or haptic** — visual animation only
- **No error state** — if something went wrong upstream, the outputs screen handles it
- **No retry button** — this screen is one-way
- **No step duration countdown** — "This takes about 20 seconds." is a static string, not a live timer

---

## Definition of Done

### Routing
- [ ] Navigating to `/projects/:id/generating` renders `GeneratingOutputs` for a valid project id
- [ ] Navigating with an invalid or missing project id redirects to `/`

### Entry point
- [ ] After ending an interview in `InterviewInProgress`, the app navigates to `/projects/:id/generating` (not `/outputs`)
- [ ] The `updateProject(id, { status: 'complete', pctUnderstood: 72 })` call in `InterviewInProgress` is unchanged — only the navigate target changes

### Step animation
- [ ] On mount, step 0 is `active` (white text, ◌ icon) and steps 1–3 are `pending` (muted text, ○ icon)
- [ ] After ~800ms, step 0 becomes `done` (green text, ✓ icon) and step 1 becomes `active`
- [ ] After ~1 600ms, step 1 becomes `done` and step 2 becomes `active`
- [ ] After ~2 400ms, step 2 becomes `done` and step 3 becomes `active`
- [ ] After ~3 200ms, step 3 becomes `done`; all four steps are in `done` state
- [ ] After an additional ~600ms (total ~3 800ms), the screen auto-navigates to `/projects/:id/outputs`

### Visual states
- [ ] `pending` steps render with `var(--fg-on-dark-3)` colour and ○ icon
- [ ] `active` step renders with `var(--fg-on-dark-1)` colour and ◌ icon
- [ ] `done` steps render with `var(--beam-green-soft)` colour and ✓ icon
- [ ] Colour transitions are smooth (0.3s CSS transition), not hard cuts

### Layout
- [ ] Timmy avatar (`size=120`, `state="speaking"`, `label=false`) is visible above the heading
- [ ] Heading "Generating your outputs" appears with `screen-title mt-32` styling
- [ ] Sub-heading "This takes about 20 seconds." appears with `screen-sub` styling (muted)
- [ ] Step list is centred, max-width 400px
- [ ] The layout uses `screen-body center` — content is centred, no left sidebar

### Direct URL navigation
- [ ] Navigating directly to `/projects/:id/generating` in the browser (e.g. from a bookmark) still auto-advances to outputs after ~3 800ms

### Timer cleanup
- [ ] If the user manually navigates away before the timer completes, no timer fires after unmount (cleanup functions work)

### What must NOT be present
- [ ] No "Continue" or "Skip" button anywhere on the screen
- [ ] No loading spinner outside the step list
- [ ] No progress bar track or percentage number
- [ ] No real network request or API call triggered from this screen
- [ ] No error state or retry affordance

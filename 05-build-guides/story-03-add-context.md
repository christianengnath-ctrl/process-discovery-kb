# Story 03 — Add Context

**Screen:** `AddContext`
**Route:** `/projects/:id/context`
**File:** `src/screens/AddContext.jsx`
**Status:** Exists — verify it matches this spec exactly, fix any gaps

---

## What this screen does

Step 2 of the project setup wizard. The engineer pastes raw background material — SOPs, emails, Notion exports, notes — so Timmy can read it before the interview starts. The screen pre-fills from the store so navigating back never wipes work. Both "Skip for now" and "Continue →" do the same thing: save whatever is in the textarea (including an empty string) and advance to the Goals screen.

---

## Technical anatomy

### File location
```
src/
  screens/
    AddContext.jsx    ← this story
  components/
    AppNav.jsx
    Timmy.jsx
  store.js
  App.jsx             ← route is already registered here
```

### Route registration (already in App.jsx — do not change)
```jsx
<Route path="/projects/:id/context" element={<AddContext />} />
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

## Data contract

The screen reads `id` from the URL param, looks up the matching project from the store, and reads/writes `contextBlob`.

```typescript
interface Project {
  id: string;
  clientName: string;
  processName: string;
  contextBlob: string;   // raw pasted text — this is the field this screen owns
  // ...other fields not used here
}
```

Fields used on this screen: `id`, `clientName`, `processName`, `contextBlob`.

---

## Store contract

```jsx
const { projects, setContextBlob } = useStore();
```

- `projects: Project[]` — array of all projects
- `setContextBlob(id: string, blob: string): void` — saves the pasted text back to the project

Store implementation (do not change):
```js
setContextBlob: (id, blob) => {
  get().updateProject(id, { contextBlob: blob });
},
```

### Local state

One piece of local state, initialised from the store:
```jsx
const [text, setText] = useState(project?.contextBlob ?? '');
```

This means navigating back after pasting content will restore the textarea — the user never loses their work.

---

## Guard clause

If the URL contains an `id` that does not match any project, redirect to home and return null immediately:

```jsx
if (!project) { navigate('/'); return null; }
```

This must run before any JSX is returned.

---

## Navigation map

```
User clicks "← Back"         → navigate('/')
                                (not back to CreateProject — this is intentional)

User clicks "Skip for now"   → setContextBlob(id, text) → navigate(`/projects/${id}/goals`)
User clicks "Continue →"     → setContextBlob(id, text) → navigate(`/projects/${id}/goals`)
```

Both "Skip for now" and "Continue →" call the **same** `handleContinue()` function. There is no distinction between skipping and continuing — saving an empty string is valid.

```jsx
function handleContinue() {
  setContextBlob(id, text);
  navigate(`/projects/${id}/goals`);
}
```

---

## Token estimator

A lightweight token count is derived from the textarea value and shown as a chip when text is present:

```jsx
const tokenEst = Math.round(text.length / 4);
```

This value is recomputed on every render from `text`. No memoisation needed.

---

## Layout

```
app-shell
  AppNav (crumbs: ['Process Discovery', '{clientName} · {processName}', 'Context'])
  screen-body
    └── div (maxWidth: 720, margin: 0 auto)
          ├── Step indicator
          ├── Row: Timmy avatar (left) + heading block (right)
          ├── col gap-16 mt-32
          │     ├── Textarea field (label + input + helper)
          │     └── Token chips (only when text.length > 0)
          └── Row between mt-48: "← Back" (left) | "Skip for now" + "Continue →" (right)
```

---

## Step indicator

Class: `step-indicator`. The active step has class `active`. Separators are `›` characters rendered as plain `<span>` elements.

```jsx
<div className="step-indicator">
  <span>Project</span><span>›</span>
  <span className="active">Context</span><span>›</span>
  <span>Goals</span><span>›</span>
  <span>Interview</span>
</div>
```

Steps: `Project › Context (active) › Goals › Interview`

---

## Timmy + heading row

```jsx
<div className="row gap-16" style={{ alignItems: 'center', marginBottom: 16 }}>
  <Timmy size={56} state="idle" label={false} />
  <div>
    <h2 className="screen-title" style={{ fontSize: 26 }}>Give Timmy some background</h2>
    <p className="muted" style={{ fontSize: 14, margin: 0 }}>
      He'll read this before the interview starts. The more context, the sharper his questions.
    </p>
  </div>
</div>
```

Timmy props: `size={56}`, `state="idle"`, `label={false}`. No other props.

---

## Textarea field

```jsx
<div>
  <label className="input-label">Existing documentation</label>
  <textarea
    className="input"
    placeholder="Paste any existing process documentation, emails, Notion exports, SOP drafts, or notes here…"
    value={text}
    onChange={e => setText(e.target.value)}
  />
  <div className="input-helper">Plain text only for now — file upload coming soon. Anything you paste stays in this project.</div>
</div>
```

The textarea is a **controlled component**: `value={text}`, `onChange={e => setText(e.target.value)}`.

---

## Token chips (conditional)

Renders only when `text.length > 0`. When the textarea is empty, this entire block is absent from the DOM.

```jsx
{text.length > 0 && (
  <div className="row gap-8">
    <span className="chip"><span className="dot" /> {text.split('\n').filter(Boolean).length} lines pasted</span>
    <span className="chip muted">≈ {tokenEst.toLocaleString()} tokens</span>
  </div>
)}
```

- Chip 1: class `chip`, contains a `.dot` span followed by `{N} lines pasted`. Line count is `text.split('\n').filter(Boolean).length` — blank lines do not count.
- Chip 2: class `chip muted`, content is `≈ {tokenEst.toLocaleString()} tokens`. Note the `≈` character and the `.toLocaleString()` call (adds commas for large numbers).

---

## Footer button row

```jsx
<div className="row between mt-48" style={{ alignItems: 'center' }}>
  <button className="btn ghost" onClick={() => navigate('/')}>← Back</button>
  <div className="row gap-16">
    <button className="btn ghost" onClick={handleContinue}>Skip for now</button>
    <button className="btn primary" onClick={handleContinue}>Continue →</button>
  </div>
</div>
```

- "← Back": class `btn ghost`, navigates to `'/'`
- "Skip for now": class `btn ghost`, calls `handleContinue()`
- "Continue →": class `btn primary`, calls `handleContinue()`

All three buttons are always rendered. There are no disabled states.

---

## Exact copy (all user-visible strings)

| Location | String |
|---|---|
| Nav breadcrumb [0] | `Process Discovery` |
| Nav breadcrumb [1] | `{project.clientName} · {project.processName}` |
| Nav breadcrumb [2] | `Context` |
| Step indicator step 1 | `Project` |
| Step indicator step 2 (active) | `Context` |
| Step indicator step 3 | `Goals` |
| Step indicator step 4 | `Interview` |
| Screen heading | `Give Timmy some background` |
| Screen subheading | `He'll read this before the interview starts. The more context, the sharper his questions.` |
| Textarea label | `Existing documentation` |
| Textarea placeholder | `Paste any existing process documentation, emails, Notion exports, SOP drafts, or notes here…` |
| Textarea helper | `Plain text only for now — file upload coming soon. Anything you paste stays in this project.` |
| Chip 1 (when text present) | `{N} lines pasted` |
| Chip 2 (when text present) | `≈ {tokenEst.toLocaleString()} tokens` |
| Back button | `← Back` |
| Skip button | `Skip for now` |
| Continue button | `Continue →` |

---

## Constraints — do NOT build these

- **No file upload** — the helper copy says "coming soon". Do not render a file input or drag-drop target.
- **No loading state** — the store is synchronous; there is no async operation on this screen.
- **No error state** — saving an empty string is valid; there is nothing to validate.
- **No character limit** — do not cap the textarea or warn about length.
- **No auto-save** — context is only written to the store when `handleContinue` is called.
- **No markdown preview** — the textarea accepts plain text only.
- **No confirmation dialog** on "← Back" — navigating away silently discards unsaved changes.
- **No disabled state** on Continue — the button is always active even when the textarea is empty.

---

## Full component (exact source)

```jsx
// src/screens/AddContext.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { Timmy } from '../components/Timmy';
import { useStore } from '../store';

export function AddContext() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, setContextBlob } = useStore();
  const project = projects.find(p => p.id === id);
  const [text, setText] = useState(project?.contextBlob ?? '');

  if (!project) { navigate('/'); return null; }

  function handleContinue() {
    setContextBlob(id, text);
    navigate(`/projects/${id}/goals`);
  }

  const tokenEst = Math.round(text.length / 4);

  return (
    <div className="app-shell">
      <AppNav crumbs={['Process Discovery', `${project.clientName} · ${project.processName}`, 'Context']} />
      <div className="screen-body">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="step-indicator">
            <span>Project</span><span>›</span>
            <span className="active">Context</span><span>›</span>
            <span>Goals</span><span>›</span>
            <span>Interview</span>
          </div>

          <div className="row gap-16" style={{ alignItems: 'center', marginBottom: 16 }}>
            <Timmy size={56} state="idle" label={false} />
            <div>
              <h2 className="screen-title" style={{ fontSize: 26 }}>Give Timmy some background</h2>
              <p className="muted" style={{ fontSize: 14, margin: 0 }}>He'll read this before the interview starts. The more context, the sharper his questions.</p>
            </div>
          </div>

          <div className="col gap-16 mt-32">
            <div>
              <label className="input-label">Existing documentation</label>
              <textarea
                className="input"
                placeholder="Paste any existing process documentation, emails, Notion exports, SOP drafts, or notes here…"
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <div className="input-helper">Plain text only for now — file upload coming soon. Anything you paste stays in this project.</div>
            </div>

            {text.length > 0 && (
              <div className="row gap-8">
                <span className="chip"><span className="dot" /> {text.split('\n').filter(Boolean).length} lines pasted</span>
                <span className="chip muted">≈ {tokenEst.toLocaleString()} tokens</span>
              </div>
            )}
          </div>

          <div className="row between mt-48" style={{ alignItems: 'center' }}>
            <button className="btn ghost" onClick={() => navigate('/')}>← Back</button>
            <div className="row gap-16">
              <button className="btn ghost" onClick={handleContinue}>Skip for now</button>
              <button className="btn primary" onClick={handleContinue}>Continue →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Definition of Done

### Routing and guard
- [ ] Navigating to `/projects/:id/context` with a valid project id renders `AddContext`
- [ ] Navigating to `/projects/nonexistent-id/context` immediately redirects to `/`

### Pre-fill behaviour
- [ ] If `project.contextBlob` is a non-empty string, the textarea renders with that text already populated
- [ ] If `project.contextBlob` is `''` or undefined, the textarea is empty on load

### Step indicator
- [ ] Four steps are shown: `Project`, `Context`, `Goals`, `Interview`
- [ ] `Context` has class `active`; the other three do not
- [ ] Separators between steps are `›` characters

### Timmy avatar
- [ ] `<Timmy size={56} state="idle" label={false} />` renders in the heading row
- [ ] Timmy appears to the left of the heading text

### Heading
- [ ] Title is "Give Timmy some background" with class `screen-title` and `fontSize: 26`
- [ ] Subtitle is "He'll read this before the interview starts. The more context, the sharper his questions." with class `muted` and `fontSize: 14`

### Textarea
- [ ] Label reads "Existing documentation" with class `input-label`
- [ ] Textarea has class `input` and the exact placeholder string
- [ ] Helper text reads "Plain text only for now — file upload coming soon. Anything you paste stays in this project."
- [ ] Typing in the textarea updates `text` state immediately (controlled component)

### Token chips
- [ ] When the textarea is empty, no chips are rendered
- [ ] When text is present, chip 1 shows the non-blank line count with a `.dot` span and the text `{N} lines pasted`
- [ ] When text is present, chip 2 shows `≈ {tokenEst.toLocaleString()} tokens` with class `chip muted`
- [ ] Deleting all text causes both chips to disappear

### Navigation
- [ ] "← Back" button navigates to `/` (not to `/new` or the previous browser entry)
- [ ] "Skip for now" calls `setContextBlob(id, text)` then navigates to `/projects/:id/goals`
- [ ] "Continue →" calls `setContextBlob(id, text)` then navigates to `/projects/:id/goals`
- [ ] Both "Skip for now" and "Continue →" save even when the textarea is empty
- [ ] After clicking Continue, the store's `contextBlob` for this project equals the textarea value at the time of the click

### What must NOT be present
- [ ] No file upload button or drag-drop zone
- [ ] No loading spinner
- [ ] No error messages or validation warnings
- [ ] No character counter or length warning
- [ ] No markdown preview toggle
- [ ] No confirmation dialog when clicking "← Back"
- [ ] No disabled state on any button

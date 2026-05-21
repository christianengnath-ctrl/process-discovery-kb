# Story 04 — Goal Definition

**Screen:** `GoalDefinition`
**Route:** `/projects/:id/goals`
**File:** `src/screens/GoalDefinition.jsx`
**Status:** Exists — verify it matches this spec exactly, fix any gaps

---

## What this screen does

Step 3 of the project setup wizard. It presents a short list of interview goals that Timmy will pursue during the discovery session. Goals are generated client-side — no LLM call — either from a set of defaults or from context-aware templates when the project has a context blob. The engineer can edit, remove, or add goals (up to 5) before starting the interview. Confirmed goals are persisted to the store and the user advances to the setup screen.

---

## Technical anatomy

### File location
```
src/
  screens/
    GoalDefinition.jsx   ← this story
  components/
    AppNav.jsx
    Timmy.jsx
  store.js
  App.jsx               ← route is already registered here
```

### Route registration (already in App.jsx — do not change)
```jsx
<Route path="/projects/:id/goals" element={<GoalDefinition />} />
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

### Goal shape
```typescript
interface Goal {
  id: string;       // String(index) for generated goals; crypto.randomUUID() for user-added goals
  text: string;     // editable free text
  covered: boolean; // always false at creation; updated later during interview
}
```

### Project fields consumed on this screen

| Field | Type | Use |
|---|---|---|
| `id` | string | read from URL params via `useParams()` |
| `clientName` | string | nav breadcrumb |
| `processName` | string | nav breadcrumb + context-aware goal text |
| `contextBlob` | string | truthy check to pick goal set |
| `goals` | Goal[] | initial state when back-navigating to a previously saved screen |

---

## Store contract

```jsx
const { projects, setGoals } = useStore();
```

- `projects: Project[]` — array read to find the current project by `id`
- `setGoals(id: string, goals: Goal[]): void` — persists the goal list to the project

```js
// store implementation
setGoals: (id, goals) => {
  get().updateProject(id, { goals });
},
```

`setGoals` is called only in `handleStart`, immediately before navigating away. It receives the goals array filtered to remove any goals with empty text.

---

## Goal generation (client-side, no LLM)

```jsx
const DEFAULT_GOALS = [
  'Walk me through the process end to end',
  'Who are the people involved and what do they each do?',
  'What systems or tools are used at each step?',
];

function generateGoals(project) {
  if (!project.contextBlob) return DEFAULT_GOALS;
  return [
    `Map the end-to-end flow for ${project.processName}`,
    'Identify which steps are manual vs. system-automated today',
    'Capture the decision criteria applied at key steps',
    'Surface exceptions, edge cases, and known failure modes',
  ];
}
```

Rules:
- If `project.contextBlob` is falsy (empty string, null, undefined): returns `DEFAULT_GOALS` — 3 items.
- If `project.contextBlob` has any truthy value: returns the 4-item context-aware array, where `goal[0]` interpolates `project.processName`.
- This function is called once during initial state initialisation only. It is not reactive.

---

## Local state

Three `useState` variables. No derived or external async state.

```jsx
const [goals, setLocalGoals] = useState(() => {
  if (project?.goals?.length) return project.goals;
  return generateGoals(project).map((text, i) => ({ id: String(i), text, covered: false }));
});
const [editingId, setEditingId] = useState(null);
const [editText, setEditText]   = useState('');
```

| Variable | Type | Purpose |
|---|---|---|
| `goals` | `Goal[]` | The current list of goals rendered on screen |
| `editingId` | `string \| null` | ID of the goal currently being edited; `null` when no edit is active |
| `editText` | `string` | Controlled value for the active inline input |

**Back-navigation preservation:** If `project.goals` already has items (user pressed Back from the setup screen), the saved goals are used as initial state — `generateGoals` is not called again.

---

## Guard — missing project

```jsx
if (!project) { navigate('/'); return null; }
```

If no project with the given `id` exists in the store, redirect immediately to `/` and render nothing.

---

## Navigation map

```
← Back button                          → navigate(`/projects/${id}/context`)
Start interview → button (canStart)    → setGoals(id, goals.filter(g => g.text.trim()))
                                         then navigate(`/projects/${id}/setup`)
```

---

## canStart guard

```jsx
const canStart = goals.some(g => g.text.trim());
```

The "Start interview →" button is `disabled` when `canStart` is false (all goals have been removed or all remaining goals have blank text).

---

## UI layout

```
app-shell
  AppNav
  screen-body
    div (maxWidth: 760, margin: 0 auto)
      step-indicator
      row [Timmy + heading block]
      col gap-8 mt-32
        goal-item × N
        card-dashed "Add a goal" (when goals.length < 5)
      row between mt-48 [Back | counter + Start]
```

---

## AppNav

```jsx
<AppNav crumbs={['Process Discovery', `${project.clientName} · ${project.processName}`, 'Goals']} />
```

Three breadcrumb segments. The second segment concatenates `clientName` and `processName` with ` · ` (space-middot-space).

---

## Step indicator

```jsx
<div className="step-indicator">
  <span>Project</span><span>›</span>
  <span>Context</span><span>›</span>
  <span className="active">Goals</span><span>›</span>
  <span>Interview</span>
</div>
```

"Goals" carries the `active` class. Four steps total: Project, Context, Goals, Interview.

---

## Timmy + heading block

```jsx
<div className="row gap-16" style={{ alignItems: 'center', marginBottom: 16 }}>
  <Timmy size={56} state="idle" label={false} />
  <div>
    <h2 className="screen-title" style={{ fontSize: 26 }}>Here's what Timmy will explore</h2>
    <p className="muted" style={{ fontSize: 14, margin: 0 }}>
      Generated from your context. Edit, remove, or add — up to 5 goals.
    </p>
  </div>
</div>
```

Timmy props: `size={56}`, `state="idle"`, `label={false}`.

---

## Goal item (card goal-item)

Each goal renders as a `div` with classes `card goal-item`. Key structural elements:

| Zone | Content |
|---|---|
| Left | `div.goal-num` — 1-based integer index |
| Middle (`flex: 1`) | Inline edit input **or** plain text span — see below |
| Right (`flexShrink: 0`, `marginLeft: 8`) | "✎ Edit" button + "✕" button |

### View mode (editingId !== g.id)
```jsx
<span style={{ fontSize: 14, lineHeight: 1.45 }}>{g.text}</span>
```

### Edit mode (editingId === g.id)
```jsx
<input
  className="input"
  value={editText}
  onChange={e => setEditText(e.target.value)}
  onKeyDown={e => { if (e.key === 'Enter') saveEdit(g.id); if (e.key === 'Escape') setEditingId(null); }}
  onBlur={() => saveEdit(g.id)}
  autoFocus
  style={{ padding: '8px 12px', fontSize: 14 }}
/>
```

Keyboard behaviour:
- `Enter` → saves and exits edit mode
- `Escape` → cancels and exits edit mode (text reverts to previous value; `editingId` set to null without calling `saveEdit`)
- `onBlur` → saves (same as Enter)

### Action buttons
```jsx
<div className="row gap-8" style={{ flexShrink: 0, marginLeft: 8 }}>
  <button className="btn ghost sm" onClick={() => startEdit(g)}>✎ Edit</button>
  <button className="btn ghost sm" style={{ color: 'rgb(255,150,150)' }} onClick={() => removeGoal(g.id)}>✕</button>
</div>
```

The delete button uses an inline colour override (`rgb(255,150,150)`) — this is intentional, do not replace with a CSS class.

---

## Goal CRUD handlers

### startEdit
```jsx
function startEdit(g) {
  setEditingId(g.id);
  setEditText(g.text);
}
```
Copies the current text into `editText` before entering edit mode so the input starts with the existing value.

### saveEdit
```jsx
function saveEdit(gId) {
  setLocalGoals(gs => gs.map(g => g.id === gId ? { ...g, text: editText } : g));
  setEditingId(null);
}
```
Writes `editText` back into the goal with the matching id, then closes the editor.

### removeGoal
```jsx
function removeGoal(gId) {
  setLocalGoals(gs => gs.filter(g => g.id !== gId));
}
```
Removes the goal permanently from local state. If the removed goal was being edited, `editingId` will dangle harmlessly (no matching goal will render the input).

### addGoal
```jsx
function addGoal() {
  if (goals.length >= 5) return;
  const newG = { id: crypto.randomUUID(), text: '', covered: false };
  setLocalGoals(gs => [...gs, newG]);
  setEditingId(newG.id);
  setEditText('');
}
```
Guard: if already at 5 goals, do nothing. Otherwise, append a new goal with a UUID id, blank text, `covered: false`, and immediately enter edit mode for it. `editText` is reset to empty string so the input starts blank.

---

## Add goal trigger (card-dashed)

Shown only when `goals.length < 5`. Clicking anywhere on the div calls `addGoal()`.

```jsx
{goals.length < 5 && (
  <div
    className="card-dashed"
    style={{
      padding: '13px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      color: 'var(--fg-on-dark-3)',
      fontSize: 14,
      cursor: 'pointer',
    }}
    onClick={addGoal}
  >
    <span style={{ fontSize: 18 }}>+</span>
    <span>Add a goal ({goals.length}/5)</span>
  </div>
)}
```

The counter `(goals.length/5)` is always the current count before the new goal is added, so it shows e.g. "(3/5)" when 3 goals exist.

---

## Footer row

```jsx
<div className="row between mt-48" style={{ alignItems: 'center' }}>
  <button className="btn ghost" onClick={() => navigate(`/projects/${id}/context`)}>← Back</button>
  <div className="row gap-16" style={{ alignItems: 'center' }}>
    <span className="muted" style={{ fontSize: 13 }}>
      {goals.filter(g => g.text).length} goals · Timmy will cover them in order
    </span>
    <button className="btn primary" disabled={!canStart} onClick={handleStart}>
      Start interview →
    </button>
  </div>
</div>
```

The counter in the footer counts goals with any non-empty text (unfiltered by `.trim()`). The "Start interview →" button is `disabled` when `canStart` is false.

### handleStart
```jsx
function handleStart() {
  setGoals(id, goals.filter(g => g.text.trim()));
  navigate(`/projects/${id}/setup`);
}
```

Persists only goals with non-empty trimmed text. Navigates to the setup screen.

---

## Exact copy (all user-visible strings)

| Location | String |
|---|---|
| Nav breadcrumb [0] | `Process Discovery` |
| Nav breadcrumb [1] | `${project.clientName} · ${project.processName}` |
| Nav breadcrumb [2] | `Goals` |
| Step indicator (inactive) | `Project`, `Context`, `Interview` |
| Step indicator (active) | `Goals` |
| Screen title | `Here's what Timmy will explore` |
| Screen subtitle | `Generated from your context. Edit, remove, or add — up to 5 goals.` |
| Edit button | `✎ Edit` |
| Delete button | `✕` |
| Add goal trigger | `Add a goal ({N}/5)` |
| Footer counter | `{N} goals · Timmy will cover them in order` |
| Back button | `← Back` |
| Start button | `Start interview →` |
| Default goal 0 | `Walk me through the process end to end` |
| Default goal 1 | `Who are the people involved and what do they each do?` |
| Default goal 2 | `What systems or tools are used at each step?` |
| Context goal 0 | `Map the end-to-end flow for ${project.processName}` |
| Context goal 1 | `Identify which steps are manual vs. system-automated today` |
| Context goal 2 | `Capture the decision criteria applied at key steps` |
| Context goal 3 | `Surface exceptions, edge cases, and known failure modes` |

---

## Constraints — do NOT build these

- **No LLM API call** — goals are generated by a pure JS function, not by any model.
- **No async operations** — all state changes are synchronous.
- **No confirmation dialog** on remove — the ✕ button removes immediately.
- **No drag-to-reorder** — goals stay in insertion order.
- **No goal cap error message** — the add trigger simply disappears when `goals.length >= 5`.
- **No undo** for removed goals.
- **No loading state** — the store is synchronous.
- **No error state** — if the project is missing, the screen redirects to `/` and returns null.
- **No "covered" toggle** on this screen — the `covered` field is managed by the interview screen, not here.

---

## Full component skeleton

```jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { Timmy } from '../components/Timmy';
import { useStore } from '../store';

const DEFAULT_GOALS = [
  'Walk me through the process end to end',
  'Who are the people involved and what do they each do?',
  'What systems or tools are used at each step?',
];

function generateGoals(project) {
  if (!project.contextBlob) return DEFAULT_GOALS;
  return [
    `Map the end-to-end flow for ${project.processName}`,
    'Identify which steps are manual vs. system-automated today',
    'Capture the decision criteria applied at key steps',
    'Surface exceptions, edge cases, and known failure modes',
  ];
}

export function GoalDefinition() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, setGoals } = useStore();
  const project = projects.find(p => p.id === id);

  const [goals, setLocalGoals] = useState(() => {
    if (project?.goals?.length) return project.goals;
    return generateGoals(project).map((text, i) => ({ id: String(i), text, covered: false }));
  });
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  if (!project) { navigate('/'); return null; }

  function startEdit(g) {
    setEditingId(g.id);
    setEditText(g.text);
  }

  function saveEdit(gId) {
    setLocalGoals(gs => gs.map(g => g.id === gId ? { ...g, text: editText } : g));
    setEditingId(null);
  }

  function removeGoal(gId) {
    setLocalGoals(gs => gs.filter(g => g.id !== gId));
  }

  function addGoal() {
    if (goals.length >= 5) return;
    const newG = { id: crypto.randomUUID(), text: '', covered: false };
    setLocalGoals(gs => [...gs, newG]);
    setEditingId(newG.id);
    setEditText('');
  }

  function handleStart() {
    setGoals(id, goals.filter(g => g.text.trim()));
    navigate(`/projects/${id}/setup`);
  }

  const canStart = goals.some(g => g.text.trim());

  return (
    <div className="app-shell">
      <AppNav crumbs={['Process Discovery', `${project.clientName} · ${project.processName}`, 'Goals']} />
      <div className="screen-body">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Step indicator */}
          <div className="step-indicator">
            <span>Project</span><span>›</span>
            <span>Context</span><span>›</span>
            <span className="active">Goals</span><span>›</span>
            <span>Interview</span>
          </div>

          {/* Timmy + heading */}
          <div className="row gap-16" style={{ alignItems: 'center', marginBottom: 16 }}>
            <Timmy size={56} state="idle" label={false} />
            <div>
              <h2 className="screen-title" style={{ fontSize: 26 }}>Here's what Timmy will explore</h2>
              <p className="muted" style={{ fontSize: 14, margin: 0 }}>
                Generated from your context. Edit, remove, or add — up to 5 goals.
              </p>
            </div>
          </div>

          {/* Goal list */}
          <div className="col gap-8 mt-32">
            {goals.map((g, i) => (
              <div key={g.id} className="card goal-item">
                <div className="goal-num">{i + 1}</div>
                <div style={{ flex: 1 }}>
                  {editingId === g.id ? (
                    <input
                      className="input"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit(g.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      onBlur={() => saveEdit(g.id)}
                      autoFocus
                      style={{ padding: '8px 12px', fontSize: 14 }}
                    />
                  ) : (
                    <span style={{ fontSize: 14, lineHeight: 1.45 }}>{g.text}</span>
                  )}
                </div>
                <div className="row gap-8" style={{ flexShrink: 0, marginLeft: 8 }}>
                  <button className="btn ghost sm" onClick={() => startEdit(g)}>✎ Edit</button>
                  <button
                    className="btn ghost sm"
                    style={{ color: 'rgb(255,150,150)' }}
                    onClick={() => removeGoal(g.id)}
                  >✕</button>
                </div>
              </div>
            ))}

            {goals.length < 5 && (
              <div
                className="card-dashed"
                style={{
                  padding: '13px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: 'var(--fg-on-dark-3)',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
                onClick={addGoal}
              >
                <span style={{ fontSize: 18 }}>+</span>
                <span>Add a goal ({goals.length}/5)</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="row between mt-48" style={{ alignItems: 'center' }}>
            <button className="btn ghost" onClick={() => navigate(`/projects/${id}/context`)}>← Back</button>
            <div className="row gap-16" style={{ alignItems: 'center' }}>
              <span className="muted" style={{ fontSize: 13 }}>
                {goals.filter(g => g.text).length} goals · Timmy will cover them in order
              </span>
              <button className="btn primary" disabled={!canStart} onClick={handleStart}>
                Start interview →
              </button>
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

### Routing
- [ ] Navigating to `/projects/:id/goals` renders `GoalDefinition`
- [ ] An unknown `id` redirects to `/` and renders nothing

### Goal initialisation
- [ ] When `project.goals` is empty/absent and `project.contextBlob` is falsy: 3 default goals appear
- [ ] When `project.goals` is empty/absent and `project.contextBlob` has content: 4 context-aware goals appear, goal[0] includes `project.processName`
- [ ] When `project.goals` already has items (back-navigation): the saved goals are restored, `generateGoals` is not called

### Step indicator
- [ ] "Goals" step has the `active` class
- [ ] All four steps render: Project, Context, Goals, Interview

### Timmy
- [ ] Timmy renders at `size=56`, `state="idle"`, `label={false}`

### Goal items
- [ ] Each goal shows its 1-based index in `goal-num`
- [ ] Clicking "✎ Edit" enters edit mode for that goal and autoFocuses the input
- [ ] The input initialises with the goal's current text
- [ ] Pressing Enter saves and exits edit mode
- [ ] Pressing Escape exits edit mode without saving
- [ ] Blurring the input saves and exits edit mode
- [ ] Clicking "✕" removes the goal immediately
- [ ] The delete button renders in `rgb(255,150,150)`

### Add goal
- [ ] The card-dashed add trigger is visible when `goals.length < 5`
- [ ] The add trigger is hidden when `goals.length === 5`
- [ ] Clicking the add trigger appends a new blank goal and immediately enters edit mode for it
- [ ] The counter in the trigger shows the current count before adding (e.g. "3/5")
- [ ] The new goal has a UUID id and `covered: false`

### canStart and footer
- [ ] "Start interview →" is disabled when all goals have empty/blank text
- [ ] "Start interview →" is enabled as soon as at least one goal has non-blank text
- [ ] The footer counter shows the count of goals with any non-empty text
- [ ] Clicking "← Back" navigates to `/projects/${id}/context`
- [ ] Clicking "Start interview →" calls `setGoals` with only non-blank goals, then navigates to `/projects/${id}/setup`

### What must NOT be present
- [ ] No LLM API call anywhere on this screen
- [ ] No async operations or loading spinner
- [ ] No confirmation dialog before removing a goal
- [ ] No drag-to-reorder handle
- [ ] No "covered" toggle or checkbox
- [ ] No error state (missing project redirects to `/`, nothing else errors)

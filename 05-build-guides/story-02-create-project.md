# Story 02 — Create Project

**Screen:** `CreateProject`
**Route:** `/new`
**File:** `src/screens/CreateProject.jsx`
**Status:** Exists — verify it matches this spec exactly, fix any gaps

---

## What this screen does

The project creation form. A solutions engineer fills in three fields — client name, process name, and a one-line goal — and clicks "Create project →". The store assigns a UUID, sets the project to `status: 'setup'`, and the app immediately navigates to the new project's context-briefing screen. This is the only entry point for new projects.

---

## Technical anatomy

### File location
```
src/
  screens/
    CreateProject.jsx   ← this story
  store.js
  App.jsx               ← route is already registered here
```

### Route registration (already in App.jsx — do not change)
```jsx
<Route path="/new" element={<CreateProject />} />
```

### Imports required
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { useStore } from '../store';
```

No other imports needed.

---

## Local state

Three controlled inputs, all plain strings, all initialised to `''`:

```jsx
const [clientName, setClientName]   = useState('');
const [processName, setProcessName] = useState('');
const [goal, setGoal]               = useState('');
```

No other local state. No loading flag, no error flag, no template selection.

---

## Data contract

### Store action consumed
```jsx
const { createProject } = useStore();
```

### `createProject` signature and behaviour
```js
createProject: (clientName, processName, goal) => {
  const id = crypto.randomUUID();
  const project = {
    id,
    clientName,
    processName,
    goal,
    status: 'setup',
    contextBlob: '',
    goals: [],
    kb: [],
    meetUrl: '',
    interviewMode: 'voice',
    outputs: { flowchart: { nodes: [], edges: [] }, sipoc: null, sop: null, transcript: { turns: [] } },
    pctUnderstood: 0,
    lastActivity: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    seed: false,
  };
  set(s => ({ projects: [...s.projects, project], currentProjectId: id }));
  return id;
},
```

The action returns the new project's UUID. The screen passes all three `.trim()`-ed values and uses the returned `id` to construct the navigation target.

---

## Submit guard

```jsx
const canSubmit = clientName.trim() && processName.trim() && goal.trim();
```

- `canSubmit` is truthy only when all three fields contain at least one non-whitespace character.
- The "Create project →" button is `disabled={!canSubmit}` — no submission is possible until all three fields are filled.
- Whitespace-only input is blocked by the `.trim()` guard, not by additional validation logic.

---

## Submit handler

```jsx
function handleCreate(e) {
  e.preventDefault();
  const id = createProject(clientName.trim(), processName.trim(), goal.trim());
  navigate(`/projects/${id}/context`);
}
```

- `e.preventDefault()` stops the browser from reloading the page.
- Values are trimmed before being passed to the store.
- Navigation happens synchronously after `createProject` returns the new id.
- The new project always lands on the `/context` sub-route regardless of any other state.

---

## Navigation map

```
User clicks "← Back"         → navigate('/')
                               (type="button" — does NOT submit the form)

User submits the form:
  all three fields non-empty  → createProject(…) → navigate(`/projects/${id}/context`)
  any field empty             → button is disabled; form cannot be submitted
```

---

## UI layout

```
app-shell
  AppNav (crumbs: ['Process Discovery', 'New project'])
  screen-body  (display: flex, alignItems: flex-start, justifyContent: center)
    div (width: 100%, maxWidth: 600, paddingTop: 16)
      h2.screen-title   "New discovery project"
      p.screen-sub      "Tell Timmy who he's interviewing and what process to explore."
      form.col.gap-24
        ├── Client name field
        ├── Process name field
        ├── One-line goal field (+ helper text)
        └── Button row (Back left, Create right)
```

The outer `screen-body` is flex with `alignItems: 'flex-start'` and `justifyContent: 'center'` so the form column is horizontally centred but top-aligned. The inner div is capped at `maxWidth: 600` with `width: '100%'` so it narrows gracefully.

---

## Form fields

All three fields share the `input` class and are fully controlled via `onChange`.

### Field 1 — Client name
| Property | Value |
|---|---|
| Label text | `Client name` |
| Label class | `input-label` |
| Input class | `input` |
| Placeholder | `e.g. Northwind Health` |
| Value | `clientName` |
| onChange | `e => setClientName(e.target.value)` |
| autoFocus | yes — this field receives focus on mount |
| Helper text | none |

### Field 2 — Process name
| Property | Value |
|---|---|
| Label text | `Process name` |
| Label class | `input-label` |
| Input class | `input` |
| Placeholder | `e.g. Refund request handling` |
| Value | `processName` |
| onChange | `e => setProcessName(e.target.value)` |
| autoFocus | no |
| Helper text | none |

### Field 3 — One-line goal
| Property | Value |
|---|---|
| Label text | `One-line goal` |
| Label class | `input-label` |
| Input class | `input` |
| Placeholder | `e.g. Understand how refund requests are processed end to end` |
| Value | `goal` |
| onChange | `e => setGoal(e.target.value)` |
| autoFocus | no |
| Helper text | `What does the solutions engineer need to walk away knowing?` |

The helper text uses class `input-helper` and sits immediately below the `<input>` element, inside the same `<div>` wrapper as the label and input.

---

## Button row

```jsx
<div className="row between mt-16" style={{ alignItems: 'center' }}>
  <button type="button" className="btn ghost" onClick={() => navigate('/')}>
    ← Back
  </button>
  <button type="submit" className="btn primary" disabled={!canSubmit}>
    Create project →
  </button>
</div>
```

| Button | Type | Class | Disabled | Action |
|---|---|---|---|---|
| `← Back` | `button` | `btn ghost` | never | `navigate('/')` |
| `Create project →` | `submit` | `btn primary` | when `!canSubmit` | triggers `handleCreate` via form `onSubmit` |

`← Back` must be `type="button"` — without it, clicking inside a `<form>` would trigger submission.

---

## Exact copy (all user-visible strings)

| Location | String |
|---|---|
| Nav breadcrumb [0] | `Process Discovery` |
| Nav breadcrumb [1] | `New project` |
| Screen title | `New discovery project` |
| Screen subtitle | `Tell Timmy who he's interviewing and what process to explore.` |
| Field label 1 | `Client name` |
| Placeholder 1 | `e.g. Northwind Health` |
| Field label 2 | `Process name` |
| Placeholder 2 | `e.g. Refund request handling` |
| Field label 3 | `One-line goal` |
| Placeholder 3 | `e.g. Understand how refund requests are processed end to end` |
| Helper text | `What does the solutions engineer need to walk away knowing?` |
| Back button | `← Back` |
| Submit button | `Create project →` |

---

## Constraints — do NOT build these

- **No template cards** — Ontora has them; they are explicitly out of scope here.
- **No loading state** — `createProject` is synchronous; navigation happens immediately.
- **No error state** — there is no async operation that can fail.
- **No character count or length validation** — the only guard is non-empty after trim.
- **No multi-step wizard** — all three fields appear on a single screen.
- **No autosave or draft persistence** — local state is discarded if the user navigates away.
- **No Cancel button or modal** — "← Back" is the only escape hatch, using `navigate('/')`.
- **No field-level error messages** — the submit button being disabled is the sole signal.

---

## Full component (canonical source)

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { useStore } from '../store';

export function CreateProject() {
  const navigate = useNavigate();
  const { createProject } = useStore();
  const [clientName, setClientName]   = useState('');
  const [processName, setProcessName] = useState('');
  const [goal, setGoal]               = useState('');

  const canSubmit = clientName.trim() && processName.trim() && goal.trim();

  function handleCreate(e) {
    e.preventDefault();
    const id = createProject(clientName.trim(), processName.trim(), goal.trim());
    navigate(`/projects/${id}/context`);
  }

  return (
    <div className="app-shell">
      <AppNav crumbs={['Process Discovery', 'New project']} />
      <div className="screen-body" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 600, paddingTop: 16 }}>
          <h2 className="screen-title">New discovery project</h2>
          <p className="screen-sub">Tell Timmy who he's interviewing and what process to explore.</p>

          <form className="col gap-24" onSubmit={handleCreate}>
            <div>
              <label className="input-label">Client name</label>
              <input
                className="input"
                placeholder="e.g. Northwind Health"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="input-label">Process name</label>
              <input
                className="input"
                placeholder="e.g. Refund request handling"
                value={processName}
                onChange={e => setProcessName(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">One-line goal</label>
              <input
                className="input"
                placeholder="e.g. Understand how refund requests are processed end to end"
                value={goal}
                onChange={e => setGoal(e.target.value)}
              />
              <div className="input-helper">
                What does the solutions engineer need to walk away knowing?
              </div>
            </div>

            <div className="row between mt-16" style={{ alignItems: 'center' }}>
              <button type="button" className="btn ghost" onClick={() => navigate('/')}>
                ← Back
              </button>
              <button type="submit" className="btn primary" disabled={!canSubmit}>
                Create project →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

---

## Definition of Done

### Routing
- [ ] Navigating to `/new` renders `CreateProject`
- [ ] After successful submission, the browser URL changes to `/projects/<new-uuid>/context`
- [ ] Clicking "← Back" navigates to `/` without submitting

### Fields
- [ ] All three fields render with the correct labels, placeholders, and classes
- [ ] `clientName` field receives focus automatically on mount (autoFocus)
- [ ] All three inputs are controlled — typing updates local state, value reflects state
- [ ] The helper text "What does the solutions engineer need to walk away knowing?" appears below the goal input

### Submit guard
- [ ] "Create project →" is disabled when any field is empty or whitespace-only
- [ ] "Create project →" becomes enabled only when all three fields have at least one non-whitespace character
- [ ] Filling all three fields then clearing one re-disables the button

### Submission
- [ ] Clicking "Create project →" (when enabled) calls `createProject` with trimmed values
- [ ] The store receives trimmed strings — leading/trailing whitespace is stripped before passing to the store
- [ ] The new project's id is used to navigate to `/projects/<id>/context`
- [ ] The new project appears in `ProjectList` with `status: 'setup'` and `pctUnderstood: 0`

### Navigation
- [ ] "← Back" is `type="button"` — it does not submit the form
- [ ] "← Back" returns to the project list at `/`
- [ ] Pressing Enter in any field while `canSubmit` is false does not submit or throw

### Layout
- [ ] The form column is horizontally centred in the viewport
- [ ] The form column is capped at `maxWidth: 600`
- [ ] The button row has "← Back" on the left and "Create project →" on the right

### What must NOT be present
- [ ] No template cards or preset options
- [ ] No loading spinner at any point
- [ ] No field-level error messages
- [ ] No character count indicators
- [ ] No Cancel button or modal confirmation
- [ ] No multi-step layout or step indicator

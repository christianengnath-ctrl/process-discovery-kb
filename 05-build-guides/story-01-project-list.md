# Story 01 — Project List

**Screen:** `ProjectList`
**Route:** `/`
**File:** `src/screens/ProjectList.jsx`
**Status:** Exists — verify it matches this spec exactly, fix any gaps

---

## What this screen does

The home screen. It lists every discovery project and lets the engineer start a new one. Clicking a project card resumes it at the right step based on where it is in the workflow. This is the only screen that does not require a project id in the URL.

---

## Technical anatomy

### File location
```
src/
  screens/
    ProjectList.jsx   ← this story
  store.js
  App.jsx             ← route is already registered here
```

### Route registration (already in App.jsx — do not change)
```jsx
<Route path="/" element={<ProjectList />} />
```

### Imports required
```jsx
import { useNavigate } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { useStore } from '../store';
```

No other imports needed. Do not import useState — this screen has no local state.

---

## Data contract

The screen reads from the Zustand store. Every project object has this shape:

```typescript
interface Project {
  id: string;                           // crypto.randomUUID()
  clientName: string;                   // e.g. "Acme Logistics"
  processName: string;                  // e.g. "Refund request handling"
  goal: string;                         // one-line goal, not displayed on this screen
  status: 'setup' | 'interviewing' | 'complete';
  contextBlob: string;                  // raw text, not displayed here
  goals: Goal[];                        // not displayed here
  kb: KbEntry[];                        // not displayed here
  interviewMode: 'voice' | 'voice+screen'; // not displayed here
  outputs: Outputs;                     // not displayed here
  pctUnderstood: number;                // 0–100, integer
  lastActivity: string;                 // display string, e.g. "Mar 14"
  seed: boolean;                        // true only for the pre-seeded demo project
}
```

Fields used on this screen: `id`, `clientName`, `processName`, `status`, `pctUnderstood`, `lastActivity`, `seed`.

### The pre-seeded demo project (already in store.js — do not touch)
```js
{
  id: 'seed-refund',
  clientName: 'Acme Logistics',
  processName: 'Refund request handling',
  status: 'complete',
  pctUnderstood: 100,
  lastActivity: 'Mar 14',
  seed: true,
}
```
This project must appear on first load without any user action.

---

## Store contract

```jsx
const { projects, setCurrentProject } = useStore();
```

- `projects: Project[]` — array of all projects in insertion order
- `setCurrentProject(id: string): void` — sets the active project id in the store

**Do not call** `createProject` from this screen — navigating to `/new` is sufficient.

---

## Navigation map

Every navigation call must call `setCurrentProject(project.id)` first, then navigate.

```
User clicks "New project" button     → navigate('/new')
                                       (no setCurrentProject — no project exists yet)

User clicks a project row:
  project.status === 'setup'         → navigate(`/projects/${project.id}/context`)
  project.status === 'interviewing'  → navigate(`/projects/${project.id}/live`)
  project.status === 'complete'      → navigate(`/projects/${project.id}/outputs`)
```

Implement as one `handleOpen(project)` function:
```jsx
function handleOpen(project) {
  setCurrentProject(project.id);
  const routes = {
    setup:       `/projects/${project.id}/context`,
    interviewing: `/projects/${project.id}/live`,
    complete:    `/projects/${project.id}/outputs`,
  };
  navigate(routes[project.status] ?? '/');
}
```

---

## Display order

Show projects in **reverse insertion order** (most recently created at top):
```jsx
const sorted = [...projects].reverse();
```
The seed project was added first, so it appears at the bottom once new projects exist. When it is the only project, it appears at the top.

---

## UI State A — Populated list (one or more projects)

**Layout:**
```
AppNav (crumbs: ['Process Discovery', 'Projects'])
screen-body
  ├── Row: heading block (left) + "New project" button (right)
  └── Card (no padding, overflow hidden)
        ├── Table header row
        └── Project row × N
```

**Heading block:**
- Title: "Discovery projects" (class `screen-title`)
- Subtitle: "Active and recent process discovery sessions." (class `screen-sub`, no bottom margin)

**"New project" button:**
- Class: `btn primary`
- Label: `+ New project`
- onClick: `navigate('/new')`

**Table header row** (class `project-table-header`):

| Width | Label |
|---|---|
| 24% | Client |
| 32% | Process |
| 20% | % Understood |
| 12% | Last activity |
| 12% | Status |

**Project row** (class `project-table-row`, onClick: `handleOpen(project)`):

| Column | Width | Content |
|---|---|---|
| Client | 24% | 30×30 avatar placeholder (solid box, `var(--beam-w-10)` bg, 1px border `var(--beam-w-12)`, border-radius 8px) + `project.clientName` in `font-weight: 500` |
| Process | 32% | `project.processName` in `var(--fg-on-dark-2)`; if `project.seed === true`, append a "SEED" badge immediately after the name |
| % Understood | 20% | Progress bar track + fill + numeric label |
| Last activity | 12% | `project.lastActivity` string; `var(--fg-on-dark-3)`, `font-size: 13px` |
| Status | 12% (right-aligned) | Status chip |

---

## Progress bar spec

```jsx
<div className="progress-bar-track">
  <div
    className="progress-bar-fill"
    style={{
      width: `${p.pctUnderstood}%`,
      background: p.pctUnderstood === 100
        ? 'var(--beam-green-soft)'
        : 'var(--beam-blue-300)',
    }}
  />
</div>
<span style={{ fontSize: 12, color: 'var(--fg-on-dark-3)', minWidth: 32,
  fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
  {p.pctUnderstood}%
</span>
```

---

## Status chip spec

| `project.status` | Chip class | Dot style | Label |
|---|---|---|---|
| `'setup'` | `chip` | default (blue-300) | `Draft` |
| `'interviewing'` | `chip live` | green glowing (automatic from `.chip.live .dot`) | `In progress` |
| `'complete'` | `chip` | `background: var(--beam-green-soft)` | `Complete` |

Chip size: `padding: '4px 10px'`, `font-size: 11px`.

```jsx
const STATUS_LABEL = { setup: 'Draft', interviewing: 'In progress', complete: 'Complete' };
const STATUS_DOT = { complete: { background: 'var(--beam-green-soft)' } };

<span
  className={`chip ${p.status === 'interviewing' ? 'live' : ''}`}
  style={{ padding: '4px 10px', fontSize: 11 }}
>
  <span className="dot" style={STATUS_DOT[p.status] ?? {}} />
  {STATUS_LABEL[p.status] ?? p.status}
</span>
```

---

## SEED badge spec

Shown only when `project.seed === true`, inline after the process name:

```jsx
{p.seed && (
  <span style={{
    fontSize: 10,
    padding: '2px 7px',
    border: '1px solid var(--beam-w-16)',
    borderRadius: 4,
    color: 'var(--fg-on-dark-3)',
    letterSpacing: '0.04em',
    marginLeft: 8,
  }}>
    SEED
  </span>
)}
```

---

## UI State B — Empty list (zero projects)

This state is only possible if the store's projects array is empty. In practice, the seed project always exists, so this state will only appear if the store is cleared or for a truly fresh install with no seed data.

**Layout:** Full-width dashed card, content centred vertically and horizontally.

```jsx
<div className="card-dashed" style={{ padding: '80px 32px', textAlign: 'center',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

  {/* Icon box */}
  <div style={{ width: 88, height: 88, borderRadius: 22,
    background: 'var(--beam-w-06)', border: '1px solid var(--beam-w-12)',
    display: 'grid', placeItems: 'center',
    color: 'var(--fg-on-dark-3)', fontSize: 32 }}>
    ◇
  </div>

  {/* Copy */}
  <div>
    <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>
      No discovery projects yet
    </div>
    <div className="muted" style={{ fontSize: 14, maxWidth: 400, lineHeight: 1.5 }}>
      Create your first project to brief Timmy before a client call.
    </div>
  </div>

  {/* CTA */}
  <button className="btn primary lg" onClick={() => navigate('/new')}>
    + New project
  </button>
</div>
```

There is **no loading state** on this screen — the store is synchronous (no async reads).
There is **no error state** — if the store is corrupted, projects will be an empty array, which renders State B.

---

## Exact copy (all user-visible strings)

| Location | String |
|---|---|
| Nav breadcrumb [0] | `Process Discovery` |
| Nav breadcrumb [1] | `Projects` |
| Screen title | `Discovery projects` |
| Screen subtitle | `Active and recent process discovery sessions.` |
| New project button | `+ New project` |
| Table col 1 | `Client` |
| Table col 2 | `Process` |
| Table col 3 | `% Understood` |
| Table col 4 | `Last activity` |
| Table col 5 | `Status` |
| Seed badge | `SEED` |
| Status: setup | `Draft` |
| Status: interviewing | `In progress` |
| Status: complete | `Complete` |
| Empty title | `No discovery projects yet` |
| Empty subtitle | `Create your first project to brief Timmy before a client call.` |
| Empty CTA | `+ New project` |

---

## Constraints — do NOT build these

- **No search input** — the wireframe shows one but it is explicitly out of scope. Do not render it.
- **No filtering or sorting controls** — reverse insertion order only.
- **No delete or archive** — rows are click-to-open only, no secondary actions.
- **No pagination** — render all projects in a single flat list.
- **No loading spinner** — store reads are synchronous.
- **No hover tooltip or popover** on rows.
- **No project count badge** in the header.
- **No column sort on click** — headers are labels, not controls.

---

## Full component skeleton

```jsx
import { useNavigate } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { useStore } from '../store';

const STATUS_LABEL = { setup: 'Draft', interviewing: 'In progress', complete: 'Complete' };
const STATUS_DOT   = { complete: { background: 'var(--beam-green-soft)' } };

export function ProjectList() {
  const navigate = useNavigate();
  const { projects, setCurrentProject } = useStore();

  function handleOpen(project) {
    setCurrentProject(project.id);
    const routes = {
      setup:        `/projects/${project.id}/context`,
      interviewing: `/projects/${project.id}/live`,
      complete:     `/projects/${project.id}/outputs`,
    };
    navigate(routes[project.status] ?? '/');
  }

  const sorted = [...projects].reverse();

  return (
    <div className="app-shell">
      <AppNav crumbs={['Process Discovery', 'Projects']} />
      <div className="screen-body">

        {/* Header */}
        <div className="row between" style={{ marginBottom: 32, alignItems: 'flex-end' }}>
          <div>
            <h2 className="screen-title">Discovery projects</h2>
            <p className="screen-sub" style={{ marginBottom: 0 }}>
              Active and recent process discovery sessions.
            </p>
          </div>
          <button className="btn primary" onClick={() => navigate('/new')}>
            + New project
          </button>
        </div>

        {/* Content: empty OR populated */}
        {sorted.length === 0 ? (
          /* ---- State B: empty ---- */
          <div className="card-dashed" style={{ /* see State B spec */ }}>
            {/* ... */}
          </div>
        ) : (
          /* ---- State A: table ---- */
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="project-table-header">
              {/* column headers */}
            </div>
            {sorted.map(p => (
              <div key={p.id} className="project-table-row" onClick={() => handleOpen(p)}>
                {/* Client | Process | % Understood | Last activity | Status */}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
```

---

## Definition of Done

### Routing
- [ ] Navigating to `/` renders `ProjectList`
- [ ] Any unknown route redirects to `/` (handled by `App.jsx` — do not change)

### Seed project
- [ ] On fresh load, the Acme Logistics / Refund request handling project appears in the list without any user action
- [ ] It shows `pctUnderstood: 100`, progress bar filled green, status chip "Complete"
- [ ] It shows the "SEED" badge next to the process name
- [ ] Clicking it navigates to `/projects/seed-refund/outputs`

### Empty state
- [ ] If `projects[]` is empty, the dashed card renders with the exact copy and the "+ New project" CTA
- [ ] Clicking "+ New project" in the empty state navigates to `/new`
- [ ] The empty state is never a blank page

### Populated state
- [ ] When projects exist, the table renders with all five columns at the specified widths
- [ ] The "+ New project" button in the header is always visible regardless of list length
- [ ] Rows appear in reverse insertion order (most recently created at the top)

### Row behaviour
- [ ] Each row shows: avatar placeholder + clientName (bold), processName + optional SEED badge, progress bar + %, lastActivity, status chip
- [ ] Clicking any row calls `setCurrentProject(id)` then navigates to the correct route for that project's status
- [ ] `status: 'setup'` rows navigate to `/projects/:id/context`
- [ ] `status: 'interviewing'` rows navigate to `/projects/:id/live`
- [ ] `status: 'complete'` rows navigate to `/projects/:id/outputs`

### Progress bar
- [ ] Progress bar fill is `var(--beam-blue-300)` when `pctUnderstood < 100`
- [ ] Progress bar fill is `var(--beam-green-soft)` when `pctUnderstood === 100`
- [ ] The numeric percentage is shown to the right of the bar

### Status chips
- [ ] `setup` → chip (default), blue dot, label "Draft"
- [ ] `interviewing` → chip.live, glowing green dot, label "In progress"
- [ ] `complete` → chip (default), green-soft dot, label "Complete"

### What must NOT be present
- [ ] No search input field anywhere on this screen
- [ ] No filter or sort controls
- [ ] No delete/archive actions on rows
- [ ] No loading spinner
- [ ] No pagination controls

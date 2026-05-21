import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { useStore } from '../store';

export function CreateProject() {
  const navigate = useNavigate();
  const { createProject } = useStore();
  const [clientName, setClientName] = useState('');
  const [processName, setProcessName] = useState('');
  const [goal, setGoal] = useState('');

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
              <div className="input-helper">What does the solutions engineer need to walk away knowing?</div>
            </div>

            <div className="row between mt-16" style={{ alignItems: 'center' }}>
              <button type="button" className="btn ghost" onClick={() => navigate('/')}>← Back</button>
              <button type="submit" className="btn primary" disabled={!canSubmit}>Create project →</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

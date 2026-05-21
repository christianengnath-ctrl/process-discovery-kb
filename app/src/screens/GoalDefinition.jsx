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
          <div className="step-indicator">
            <span>Project</span><span>›</span>
            <span>Context</span><span>›</span>
            <span className="active">Goals</span><span>›</span>
            <span>Interview</span>
          </div>

          <div className="row gap-16" style={{ alignItems: 'center', marginBottom: 16 }}>
            <Timmy size={56} state="idle" label={false} />
            <div>
              <h2 className="screen-title" style={{ fontSize: 26 }}>Here's what Timmy will explore</h2>
              <p className="muted" style={{ fontSize: 14, margin: 0 }}>Generated from your context. Edit, remove, or add — up to 5 goals.</p>
            </div>
          </div>

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
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit(g.id); if (e.key === 'Escape') setEditingId(null); }}
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
                  <button className="btn ghost sm" style={{ color: 'rgb(255,150,150)' }} onClick={() => removeGoal(g.id)}>✕</button>
                </div>
              </div>
            ))}

            {goals.length < 5 && (
              <div
                className="card-dashed"
                style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, color: 'var(--fg-on-dark-3)', fontSize: 14, cursor: 'pointer' }}
                onClick={addGoal}
              >
                <span style={{ fontSize: 18 }}>+</span>
                <span>Add a goal ({goals.length}/5)</span>
              </div>
            )}
          </div>

          <div className="row between mt-48" style={{ alignItems: 'center' }}>
            <button className="btn ghost" onClick={() => navigate(`/projects/${id}/context`)}>← Back</button>
            <div className="row gap-16" style={{ alignItems: 'center' }}>
              <span className="muted" style={{ fontSize: 13 }}>{goals.filter(g => g.text).length} goals · Timmy will cover them in order</span>
              <button className="btn primary" disabled={!canStart} onClick={handleStart}>Start interview →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

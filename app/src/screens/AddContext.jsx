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

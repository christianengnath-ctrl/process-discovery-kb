import { useState, useEffect, useRef } from 'react';
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

        <div className="timer mt-32">{timer}</div>
        <p className="muted mt-8" style={{ fontSize: 14 }}>
          Timmy is on the call. The page won't update until the interview ends.
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

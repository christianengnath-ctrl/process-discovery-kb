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

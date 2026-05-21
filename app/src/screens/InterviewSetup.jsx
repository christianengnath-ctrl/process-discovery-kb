import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { Timmy } from '../components/Timmy';
import { useStore } from '../store';

export function InterviewSetup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, setMeetUrl, updateProject } = useStore();
  const project = projects.find(p => p.id === id);
  const [meetUrl, setUrl] = useState(project?.meetUrl ?? '');
  const [launching, setLaunching] = useState(false);

  if (!project) { navigate('/'); return null; }

  const validUrl = meetUrl.trim().startsWith('https://meet.google.com/');

  async function handleLaunch() {
    setLaunching(true);
    setMeetUrl(id, meetUrl.trim());
    // Simulated bot join — wire real Recall.ai call here
    await new Promise(r => setTimeout(r, 1400));
    updateProject(id, { status: 'interviewing' });
    navigate(`/projects/${id}/live`);
  }

  return (
    <div className="app-shell">
      <AppNav crumbs={['Process Discovery', `${project.clientName} · ${project.processName}`, 'Interview']} />
      <div className="screen-body center">
        <Timmy size={140} state="idle" label />

        <h2 className="screen-title mt-32">Ready to start the interview</h2>
        <p className="screen-sub" style={{ maxWidth: 500 }}>
          Timmy will join the call as a participant and conduct the interview.
          You'll see his status here while the session runs.
        </p>

        <div style={{ width: '100%', maxWidth: 520 }}>
          <label className="input-label" style={{ textAlign: 'left' }}>Google Meet link</label>
          <div className="row gap-8">
            <input
              className="input grow"
              placeholder="https://meet.google.com/abc-defg-hij"
              value={meetUrl}
              onChange={e => setUrl(e.target.value)}
            />
          </div>
          <div className="input-helper" style={{ textAlign: 'left' }}>
            Timmy will request entry as <b style={{ color: 'var(--fg-on-dark-2)' }}>Timmy (Beam AI)</b>. Admit him from the waiting room.
          </div>
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
            disabled={!validUrl || launching}
            onClick={handleLaunch}
          >
            {launching ? '◌ Joining…' : '▶ Launch Timmy'}
          </button>
        </div>

        {!validUrl && meetUrl.length > 0 && (
          <p style={{ marginTop: 12, fontSize: 13, color: 'rgb(255,150,150)' }}>
            Please enter a valid meet.google.com link
          </p>
        )}
      </div>
    </div>
  );
}

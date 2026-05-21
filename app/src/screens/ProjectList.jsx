import { useNavigate } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { useStore } from '../store';

export function ProjectList() {
  const navigate = useNavigate();
  const { projects, createProject, setCurrentProject } = useStore();

  function handleNew() {
    navigate('/new');
  }

  function handleOpen(project) {
    setCurrentProject(project.id);
    if (project.status === 'complete') {
      navigate(`/projects/${project.id}/outputs`);
    } else if (project.status === 'interviewing') {
      navigate(`/projects/${project.id}/live`);
    } else {
      navigate(`/projects/${project.id}/context`);
    }
  }

  const statusLabel = (s) => ({ setup: 'Draft', interviewing: 'In progress', complete: 'Complete' }[s] ?? s);

  return (
    <div className="app-shell">
      <AppNav crumbs={['Process Discovery', 'Projects']} />
      <div className="screen-body">
        <div className="row between" style={{ marginBottom: 32, alignItems: 'flex-end' }}>
          <div>
            <h2 className="screen-title">Discovery projects</h2>
            <p className="screen-sub" style={{ marginBottom: 0 }}>Active and recent process discovery sessions.</p>
          </div>
          <div className="row gap-8" style={{ alignItems: 'center' }}>
            <input className="input" placeholder="Search projects…" style={{ width: 220, padding: '9px 14px', fontSize: 13 }} />
            <button className="btn primary" onClick={handleNew}>+ New project</button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="card-dashed" style={{ padding: '80px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 88, height: 88, borderRadius: 22, background: 'var(--beam-w-06)', border: '1px solid var(--beam-w-12)', display: 'grid', placeItems: 'center', color: 'var(--fg-on-dark-3)', fontSize: 32 }}>◇</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>No discovery projects yet</div>
              <div className="muted" style={{ fontSize: 14, maxWidth: 400, lineHeight: 1.5 }}>
                Create your first project to brief Timmy before a client call.
              </div>
            </div>
            <button className="btn primary lg" onClick={handleNew}>+ New project</button>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="project-table-header">
              <div style={{ width: '24%' }}>Client</div>
              <div style={{ width: '32%' }}>Process</div>
              <div style={{ width: '20%' }}>% Understood</div>
              <div style={{ width: '12%' }}>Last activity</div>
              <div style={{ width: '12%', textAlign: 'right' }}>Status</div>
            </div>
            {projects.map((p) => (
              <div key={p.id} className="project-table-row" onClick={() => handleOpen(p)}>
                <div style={{ width: '24%', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--beam-w-10)', border: '1px solid var(--beam-w-12)', flexShrink: 0 }} />
                  <span style={{ fontWeight: 500 }}>{p.clientName}</span>
                </div>
                <div style={{ width: '32%', color: 'var(--fg-on-dark-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {p.processName}
                  {p.seed && (
                    <span style={{ fontSize: 10, padding: '2px 7px', border: '1px solid var(--beam-w-16)', borderRadius: 4, color: 'var(--fg-on-dark-3)', letterSpacing: '0.04em' }}>SEED</span>
                  )}
                </div>
                <div style={{ width: '20%', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${p.pctUnderstood}%`, background: p.pctUnderstood === 100 ? 'var(--beam-green-soft)' : 'var(--beam-blue-300)' }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--fg-on-dark-3)', minWidth: 32, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{p.pctUnderstood}%</span>
                </div>
                <div style={{ width: '12%', color: 'var(--fg-on-dark-3)', fontSize: 13 }}>{p.lastActivity}</div>
                <div style={{ width: '12%', textAlign: 'right' }}>
                  <span className={`chip ${p.status === 'interviewing' ? 'live' : ''}`} style={{ padding: '4px 10px', fontSize: 11 }}>
                    <span className="dot" style={p.status === 'complete' ? { background: 'var(--beam-green-soft)' } : {}} />
                    {statusLabel(p.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

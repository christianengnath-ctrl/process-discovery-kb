import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppNav } from '../components/AppNav';
import { useStore } from '../store';

const CLASS_COLOR = {
  Deterministic: { stripe: 'var(--beam-blue-300)',   text: 'var(--beam-blue-200)' },
  Agentic:       { stripe: 'rgb(200,130,255)',        text: 'rgb(220,180,255)' },
  'RPA Bridge':  { stripe: 'var(--beam-green-soft)', text: 'var(--beam-green-soft)' },
};

const NODES = [
  { name: 'Intake form submitted',   actor: 'Client portal',   kind: 'Deterministic', conf: 96, x: 12,  y: 52,  w: 188, h: 88 },
  { name: 'Auto-classify request',   actor: 'Triage AI',       kind: 'Agentic',       conf: 88, x: 228, y: 52,  w: 188, h: 88 },
  { name: 'Pull patient records',    actor: 'EHR connector',   kind: 'RPA Bridge',    conf: 72, x: 444, y: 0,   w: 188, h: 88 },
  { name: 'Clinical reviewer check', actor: 'Reviewer',        kind: 'Agentic',       conf: 81, x: 444, y: 116, w: 188, h: 88 },
  { name: 'Decision & notification', actor: 'Comms agent',     kind: 'Agentic',       conf: 78, x: 660, y: 52,  w: 188, h: 88 },
  { name: 'Log audit trail',         actor: 'Compliance',      kind: 'Deterministic', conf: 95, x: 876, y: 52,  w: 188, h: 88 },
];

const SIPOC_ROWS = [
  ['Referring physician', 'Auth request form',  'Intake → classify', 'Routed ticket',      'Triage AI'],
  ['Patient',             'Insurance details',  'Auto-classify',     'Tier assignment',    'Clinical reviewer'],
  ['EHR system',          'Patient record',     'Pull records',      'Bundled record set', 'Clinical reviewer'],
  ['Clinical reviewer',   'Bundled record set', 'Decision & notify', 'Approval / denial',  'Patient · Physician'],
  ['Comms agent',         'Decision payload',   'Send notifications','Email · SMS',        'Patient · Physician'],
];

const SOP_SECTIONS = [
  { h: '1. Purpose', body: 'Standardize how refund requests are processed from intake through resolution, ensuring auditability and consistent turnaround.' },
  { h: '2. Scope',   body: 'Applies to all refund requests submitted via the customer portal or by phone/email and routed to the AP team.' },
  { h: '3. Roles',   body: 'AP Clerk (logging), AP Manager (approval for amounts >$500), Finance (payout), Comms (customer notification).' },
  { h: '4. Steps',   body: '4.1 Request received via email/portal · 4.2 AP Clerk logs in SAP · 4.3 Confirmation sent to customer · 4.4 AP Manager reviews if >$500 · 4.5 Approved → Finance initiates payout · 4.6 Payout processed within 3–5 business days · 4.7 Customer notified.' },
  { h: '5. Exceptions', body: 'Amounts >$2,000 require VP sign-off. Duplicate requests are flagged and held pending review. Missing invoice → request returned to sender.' },
  { h: '6. Systems', body: 'SAP (logging + payout) · Email (comms) · Customer portal · Finance reporting dashboard.' },
  { h: '7. Approvals', body: 'Process owner: AP Manager. Reviewed quarterly.' },
];

function FlowNode({ name, actor, kind, conf, x, y, w, h }) {
  const c = CLASS_COLOR[kind];
  return (
    <div className="flow-node" style={{ left: x, top: y, width: w, height: h }}>
      <div className="flow-node-stripe" style={{ background: c.stripe }} />
      <div>
        <div className="flow-node-kind" style={{ color: c.text }}>{kind}</div>
        <div className="flow-node-name">{name}</div>
      </div>
      <div className="flow-node-footer">
        <span className="flow-node-actor">{actor}</span>
        <span className="flow-node-conf">{conf}%</span>
      </div>
    </div>
  );
}

function FlowchartView() {
  return (
    <div>
      <div className="row between" style={{ marginBottom: 20, alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>Refund request handling — process map</div>
          <div className="muted" style={{ fontSize: 13 }}>6 steps · 5 actors · classified by automation strategy</div>
        </div>
        <div className="row gap-16">
          {Object.entries(CLASS_COLOR).map(([k, c]) => (
            <div key={k} className="row gap-8" style={{ alignItems: 'center', fontSize: 12 }}>
              <span style={{ width: 14, height: 4, borderRadius: 2, background: c.stripe, display: 'block' }} />
              <span className="muted">{k}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flow-canvas">
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
          <defs>
            <pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.12)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="rgba(255,255,255,0.4)" />
            </marker>
          </defs>
          <g stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none">
            <path d="M212 108 L236 108" markerEnd="url(#arr)" />
            <path d="M428 100 Q444 80 444 52" markerEnd="url(#arr)" />
            <path d="M428 116 Q444 136 444 160" markerEnd="url(#arr)" />
            <path d="M644 52 Q660 72 660 108" markerEnd="url(#arr)" />
            <path d="M644 160 Q660 140 660 112" markerEnd="url(#arr)" />
            <path d="M860 108 L884 108" markerEnd="url(#arr)" />
          </g>
        </svg>
        {NODES.map((n, i) => <FlowNode key={i} {...n} />)}
      </div>

      <div className="row gap-16 mt-24" style={{ alignItems: 'stretch' }}>
        <div className="card padded grow">
          <div className="muted" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Selected step</div>
          <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 12 }}>AP Manager approval</div>
          <div className="col gap-8">
            {[['Actor', 'AP Manager'], ['Inputs', 'Refund request · invoice · amount'], ['Confidence', '81% — approval threshold unclear for edge amounts']].map(([k, v]) => (
              <div key={k} className="row gap-16">
                <span className="muted" style={{ fontSize: 12, width: 100, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 13 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card padded" style={{ width: 260 }}>
          <div className="muted" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Coverage</div>
          <div className="row" style={{ alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--beam-blue-300)' }}>72%</span>
            <span className="muted" style={{ fontSize: 13 }}>process understood</span>
          </div>
          <p className="muted mt-16" style={{ fontSize: 12, lineHeight: 1.5 }}>
            Timmy is confident on intake and logging. Two agentic branches still have unresolved exception paths worth a follow-up.
          </p>
        </div>
      </div>
    </div>
  );
}

function SipocView() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>SIPOC — Refund request handling</div>
        <div className="muted" style={{ fontSize: 13 }}>Share this with the client to confirm scope before agent build.</div>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="sipoc-table">
          <thead>
            <tr>{['Suppliers','Inputs','Process','Outputs','Customers'].map(c => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {SIPOC_ROWS.map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SopView() {
  return (
    <div>
      <div className="row between" style={{ marginBottom: 20, alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>SOP — Refund request handling</div>
          <div className="muted" style={{ fontSize: 13 }}>Draft v1.0 · auto-generated from interview · ready for client review</div>
        </div>
        <span className="chip" style={{ fontSize: 11, padding: '4px 10px' }}><span className="dot" /> 7 sections</span>
      </div>
      <div className="card padded" style={{ maxHeight: 460, overflowY: 'auto' }}>
        <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Refund request handling</div>
        <div className="muted" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24 }}>Acme Logistics · Standard Operating Procedure</div>
        {SOP_SECTIONS.map((s, i) => (
          <div key={i} className="sop-section">
            <h3>{s.h}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Outputs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects } = useStore();
  const project = projects.find(p => p.id === id);
  const [tab, setTab] = useState('flowchart');

  if (!project) { navigate('/'); return null; }

  const tabs = [
    { id: 'flowchart', label: 'Flowchart',  sub: 'Process map' },
    { id: 'sipoc',     label: 'SIPOC',      sub: 'Share with client' },
    { id: 'sop',       label: 'SOP',        sub: "Client's records" },
  ];

  function getContent() {
    if (tab === 'flowchart') return tab === 'flowchart' ? 'Flowchart content copied.' : '';
    if (tab === 'sipoc') {
      return SIPOC_ROWS.map(r => r.join('\t')).join('\n');
    }
    return SOP_SECTIONS.map(s => `${s.h}\n${s.body}`).join('\n\n');
  }

  function copyTab() {
    navigator.clipboard.writeText(getContent()).catch(() => {});
  }

  return (
    <div className="app-shell">
      <AppNav crumbs={['Process Discovery', `${project.clientName} · ${project.processName}`, 'Outputs']} />

      <div className="output-tabs-bar">
        <div className="row" style={{ gap: 0 }}>
          {tabs.map(t => (
            <button key={t.id} className={`output-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <div>{t.label}</div>
              <div className="output-tab-sub">{t.sub}</div>
            </button>
          ))}
        </div>
        <div className="row gap-8" style={{ alignItems: 'center' }}>
          <button className="btn sm" onClick={copyTab}>⧉ Copy</button>
          <button className="btn ghost sm" onClick={() => navigate('/')}>← Projects</button>
        </div>
      </div>

      <div className="screen-body" style={{ padding: '28px 32px 40px' }}>
        {tab === 'flowchart' && <FlowchartView />}
        {tab === 'sipoc'     && <SipocView />}
        {tab === 'sop'       && <SopView />}
      </div>
    </div>
  );
}

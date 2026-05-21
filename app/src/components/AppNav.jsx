import logo from '../assets/logo-beam-white.png';

export function AppNav({ crumbs = [] }) {
  return (
    <nav className="app-nav">
      <img src={logo} alt="Beam" className="app-nav-logo" />
      <div className="app-nav-crumb">
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'contents' }}>
            {i > 0 && <span className="sep">/</span>}
            {i === crumbs.length - 1 ? <b>{c}</b> : <span>{c}</span>}
          </span>
        ))}
      </div>
      <div className="app-nav-spacer" />
      <span className="app-nav-user">SE · Beam</span>
      <div className="app-nav-avatar" />
    </nav>
  );
}

export function Timmy({ size = 120, state = 'idle', label = true }) {
  const gradId = `tg-${state}`;
  const eyeGradId = `te-${state}`;
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <svg
        width={size} height={size} viewBox="0 0 120 120" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: state === 'speaking' ? 'drop-shadow(0 0 24px rgba(0,97,255,0.6))' : 'drop-shadow(0 8px 20px rgba(0,0,0,0.5))' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#3381ff" />
            <stop offset="55%" stopColor="#0061ff" />
            <stop offset="100%" stopColor="#0e2f71" />
          </linearGradient>
          <radialGradient id={eyeGradId} cx="0.4" cy="0.35" r="0.8">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cfe2ff" />
          </radialGradient>
          <linearGradient id={`${gradId}-band`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a3e" />
            <stop offset="100%" stopColor="#02050f" />
          </linearGradient>
        </defs>
        {/* Antenna */}
        <line x1="60" y1="10" x2="60" y2="24" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="8" r="3.5" fill="#40ff1a">
          {state === 'speaking' && (
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          )}
        </circle>
        {/* Head */}
        <rect x="22" y="24" width="76" height="68" rx="22" ry="22" fill={`url(#${gradId})`} />
        <rect x="22" y="24" width="76" height="68" rx="22" ry="22" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <rect x="26" y="28" width="68" height="14" rx="14" fill="rgba(255,255,255,0.08)" />
        {/* Eyes */}
        <circle cx="46" cy="56" r="7" fill={`url(#${eyeGradId})`} />
        <circle cx="74" cy="56" r="7" fill={`url(#${eyeGradId})`} />
        <circle cx="46" cy="56" r="3" fill="#0a1a3e" />
        <circle cx="74" cy="56" r="3" fill="#0a1a3e" />
        <circle cx="48" cy="54" r="1.2" fill="#fff" />
        <circle cx="76" cy="54" r="1.2" fill="#fff" />
        {/* Smile */}
        <path
          d={state === 'speaking' ? 'M46 74 Q60 86 74 74' : 'M50 76 Q60 80 70 76'}
          stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" fill="none"
        />
        {/* Headphones */}
        <path d="M22 48 Q22 24 60 24 Q98 24 98 48" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
        <rect x="14" y="46" width="10" height="20" rx="4" fill={`url(#${gradId}-band)`} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <rect x="96" y="46" width="10" height="20" rx="4" fill={`url(#${gradId}-band)`} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        {/* Body */}
        <path d="M28 96 Q28 112 50 112 L70 112 Q92 112 92 96 Z" fill={`url(#${gradId}-band)`} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        {/* Clipboard */}
        <rect x="74" y="90" width="24" height="28" rx="3" fill="rgba(255,255,255,0.95)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
        <rect x="80" y="87" width="12" height="6" rx="1.5" fill="#0a1a3e" />
        <line x1="78" y1="100" x2="94" y2="100" stroke="#0a1a3e" strokeWidth="1" opacity="0.5" />
        <line x1="78" y1="105" x2="92" y2="105" stroke="#0a1a3e" strokeWidth="1" opacity="0.5" />
        <line x1="78" y1="110" x2="90" y2="110" stroke="#0a1a3e" strokeWidth="1" opacity="0.5" />
        {/* Speaking pulse */}
        {state === 'speaking' && (
          <g>
            <circle cx="104" cy="36" r="5" fill="#40ff1a">
              <animate attributeName="r" values="4;7;4" dur="1.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="1.4s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </svg>
      {label && (
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, letterSpacing: '0.04em', color: 'var(--fg-on-dark-2)' }}>
          Timmy
        </div>
      )}
    </div>
  );
}

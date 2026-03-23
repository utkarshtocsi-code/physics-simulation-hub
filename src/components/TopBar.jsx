// src/components/TopBar.jsx
import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, subtitle, breadcrumb, color, onBack }) {
  const navigate = useNavigate()

  return (
    <header style={{
      padding: '14px 28px',
      background: 'var(--navy-950)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexShrink: 0,
    }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-2)', fontSize: 12, fontWeight: 500,
            transition: 'all var(--transition)',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.color = 'var(--text-1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--surface)'
            e.currentTarget.style.color = 'var(--text-2)'
          }}
        >
          ← Back
        </button>
      )}

      {/* Breadcrumb */}
      {breadcrumb && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-3)' }}>
          <span
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', transition: 'color var(--transition)' }}
            onMouseEnter={e => e.target.style.color = 'var(--text-1)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
          >
            Home
          </span>
          {breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>›</span>
              {crumb.path ? (
                <span
                  onClick={() => navigate(crumb.path)}
                  style={{ cursor: 'pointer', transition: 'color var(--transition)' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-1)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
                >
                  {crumb.label}
                </span>
              ) : (
                <span style={{ color: 'var(--text-2)' }}>{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{
          fontFamily: 'Syne', fontWeight: 700, fontSize: 16,
          color: color || 'var(--text-1)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {title}
        </h1>
        {subtitle && (
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>
            {subtitle}
          </div>
        )}
      </div>
    </header>
  )
}

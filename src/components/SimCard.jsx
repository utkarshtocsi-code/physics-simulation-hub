// src/components/SimCard.jsx
import { useNavigate } from 'react-router-dom'
import { getBranchInfo } from '../data/SimulationData.js'

const diffBadge = {
  Beginner:     { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e', label: 'Beginner' },
  Intermediate: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Intermediate' },
  Advanced:     { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', label: 'Advanced' },
}

export default function SimCard({ sim }) {
  const navigate   = useNavigate()
  const branchInfo = getBranchInfo(sim.branch)
  const badge      = diffBadge[sim.difficulty]

  return (
    <article
      className="fade-up"
      onClick={() => navigate(`/simulation/${sim.id}`)}
      style={{
        background: 'var(--navy-800)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${branchInfo?.color}44`
        e.currentTarget.style.borderColor = `${branchInfo?.color}55`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      {/* Color Banner */}
      <div style={{
        height: 90,
        background: `linear-gradient(135deg, ${branchInfo?.color}33 0%, ${branchInfo?.color}11 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px',
        borderBottom: `1px solid ${branchInfo?.color}22`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background number */}
        <span style={{
          position: 'absolute', right: -4, bottom: -14,
          fontFamily: 'Syne', fontSize: 72, fontWeight: 800,
          color: `${branchInfo?.color}12`, lineHeight: 1, userSelect: 'none',
          pointerEvents: 'none',
        }}>
          {String(sim.id).padStart(2, '0')}
        </span>

        <span style={{ fontSize: 36 }}>{branchInfo?.icon}</span>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 8px',
            borderRadius: 99, background: badge.bg, color: badge.color,
          }}>
            {badge.label}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 7px',
            borderRadius: 99,
            background: `${branchInfo?.color}22`, color: branchInfo?.color,
          }}>
            {branchInfo?.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3 style={{
          fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
          color: 'var(--text-1)', lineHeight: 1.3,
        }}>
          {sim.title}
        </h3>
        <p style={{
          fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55,
          flex: 1,
        }}>
          {sim.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
          {sim.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 99,
              background: 'var(--surface)', color: 'var(--text-3)',
              border: '1px solid var(--border)',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Launch button */}
        <button
          onClick={e => { e.stopPropagation(); navigate(`/simulation/${sim.id}`) }}
          style={{
            marginTop: 8, width: '100%', padding: '9px',
            borderRadius: 'var(--radius-sm)', border: 'none',
            background: `linear-gradient(135deg, ${branchInfo?.color}, ${branchInfo?.color}cc)`,
            color: 'white', fontSize: 12, fontWeight: 600, fontFamily: 'Syne',
            letterSpacing: '0.3px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'opacity var(--transition)',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          ▶ Launch Simulation
        </button>
      </div>
    </article>
  )
}

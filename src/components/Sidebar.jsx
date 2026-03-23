// src/components/Sidebar.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { branches, simulations } from '../data/SimulationData.js'

const difficultyColor = { Beginner: '#22c55e', Intermediate: '#f59e0b', Advanced: '#ef4444' }

export default function Sidebar({ searchQuery, setSearchQuery }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [expanded, setExpanded] = useState({})

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  // Filter sims by search
  const filtered = searchQuery
    ? simulations.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : null

  const isActive = (path) => location.pathname === path

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      minWidth: 'var(--sidebar-w)',
      height: '100vh',
      background: 'var(--navy-950)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>⚛️</div>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>
              Physics Hub
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>
              66 Simulations
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            fontSize: 14, color: 'var(--text-3)', pointerEvents: 'none',
          }}>🔍</span>
          <input
            type="text"
            placeholder="Search simulations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '8px 10px 8px 32px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text-1)',
              fontSize: 13, outline: 'none',
              transition: 'border-color var(--transition)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border)'}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--text-3)',
              fontSize: 14, padding: 0,
            }}>✕</button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>

        {/* ── Search results ── */}
        {filtered && (
          <div style={{ padding: '0 10px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600,
              letterSpacing: '1px', padding: '6px 8px 8px', textTransform: 'uppercase' }}>
              {filtered.length} results
            </div>
            {filtered.map(sim => (
              <SidebarSimRow key={sim.id} sim={sim} navigate={navigate} isActive={isActive} />
            ))}
          </div>
        )}

        {/* ── Branch tree ── */}
        {!filtered && branches.map(branch => {
          const sims = simulations.filter(s => s.branch === branch.id)
          const open = expanded[branch.id]
          const isBranchActive = location.pathname === `/branch/${branch.id}`

          return (
            <div key={branch.id}>
              {/* Branch header */}
              <div
                onClick={() => { toggle(branch.id); navigate(`/branch/${branch.id}`) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 14px', margin: '1px 8px', borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  background: isBranchActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                  borderLeft: isBranchActive ? `2px solid ${branch.color}` : '2px solid transparent',
                  transition: 'all var(--transition)',
                }}
                onMouseEnter={e => { if (!isBranchActive) e.currentTarget.style.background = 'var(--surface)' }}
                onMouseLeave={e => { if (!isBranchActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{branch.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600,
                    color: isBranchActive ? 'var(--text-1)' : 'var(--text-2)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {branch.label}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '1px 6px',
                    borderRadius: 99, background: `${branch.color}22`, color: branch.color,
                  }}>{sims.length}</span>
                  <span style={{
                    fontSize: 10, color: 'var(--text-3)',
                    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    display: 'inline-block',
                  }}>▶</span>
                </div>
              </div>

              {/* Expanded sim list */}
              {open && (
                <div style={{ paddingLeft: 14, marginBottom: 4 }}>
                  {sims.map(sim => (
                    <SidebarSimRow key={sim.id} sim={sim} navigate={navigate} isActive={isActive} compact />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer stats */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid var(--border)',
        display: 'flex', gap: 16, flexShrink: 0,
      }}>
        {[
          { label: 'Branches', val: branches.length },
          { label: 'Total Sims', val: simulations.length },
        ].map(({ label, val }) => (
          <div key={label} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: 'var(--accent-2)' }}>{val}</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>{label}</div>
          </div>
        ))}
      </div>
    </aside>
  )
}

function SidebarSimRow({ sim, navigate, isActive, compact }) {
  const active = isActive(`/simulation/${sim.id}`)
  const branch = { Mechanics:'⚙️', Thermodynamics:'🌡️', 'Waves & Optics':'🌊',
    'Electricity & Magnetism':'⚡', 'Modern Physics':'⚛️',
    'Fluid Mechanics':'💧', Gravitation:'🪐', 'Oscillations & SHM':'〰️' }

  return (
    <div
      onClick={() => navigate(`/simulation/${sim.id}`)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: compact ? '6px 10px' : '7px 10px',
        borderRadius: 'var(--radius-sm)', margin: '1px 0',
        cursor: 'pointer',
        background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
        transition: 'all var(--transition)',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: active ? 'var(--accent)' : 'var(--text-3)',
      }}/>
      <span style={{
        fontSize: 12,
        color: active ? 'var(--text-1)' : 'var(--text-2)',
        flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {sim.title}
      </span>
      <span style={{
        fontSize: 9, padding: '1px 5px', borderRadius: 99, flexShrink: 0,
        background: sim.difficulty === 'Beginner' ? '#16a34a22'
          : sim.difficulty === 'Intermediate' ? '#d9770622' : '#dc262622',
        color: sim.difficulty === 'Beginner' ? '#22c55e'
          : sim.difficulty === 'Intermediate' ? '#f59e0b' : '#ef4444',
      }}>{sim.difficulty[0]}</span>
    </div>
  )
}

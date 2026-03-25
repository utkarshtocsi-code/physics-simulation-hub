// src/pages/Dashboard.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { branches, simulations, getByDifficulty } from '../data/SimulationData.js'
import { pdfModules } from '../data/PDFData.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    { label: 'Total Simulations', val: simulations.length, icon: '🔬' },
    { label: 'Physics Branches',  val: branches.length,    icon: '📚' },
    { label: 'PDF Modules',       val: pdfModules.length,  icon: '📄', action: () => navigate('/pdfs') },
    { label: 'Advanced Level',    val: getByDifficulty('Advanced').length, icon: '🔴' },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Hero Header */}
        <div style={{
          padding: '36px 32px 28px',
          background: 'linear-gradient(180deg, var(--navy-950) 0%, var(--navy-900) 100%)',
          borderBottom: '1px solid var(--border)', flexShrink: 0,
        }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 12px', borderRadius: 99,
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
              fontSize: 11, fontWeight: 600, color: 'var(--accent-2)',
              letterSpacing: '0.5px', marginBottom: 14,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%',
                background: 'var(--accent)', animation: 'pulse-dot 2s ease-in-out infinite' }}/>
              INTERACTIVE PHYSICS LABORATORY
            </div>
            <h1 style={{
              fontFamily: 'Syne', fontWeight: 800, fontSize: 34,
              color: 'var(--text-1)', lineHeight: 1.1, marginBottom: 10, letterSpacing: '-0.5px',
            }}>
              Physics Simulation Hub
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 520 }}>
              {simulations.length} interactive simulations + {pdfModules.length} PDF modules —
              Class 11, 12, JEE aur NEET ke liye.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label}
                onClick={s.action}
                style={{
                  padding: '12px 18px', background: 'var(--surface)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: s.action ? 'pointer' : 'default',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (s.action) {
                  e.currentTarget.style.borderColor = '#84cc1655'
                  e.currentTarget.style.background = 'rgba(132,204,22,0.06)'
                }}}
                onMouseLeave={e => { if (s.action) {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--surface)'
                }}}
              >
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 22,
                    color: s.action ? '#84cc16' : 'var(--accent-2)', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '28px 32px', flex: 1 }}>

          {/* ── PDF Section ── */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(132,204,22,0.08) 0%, rgba(132,204,22,0.03) 100%)',
            border: '1px solid rgba(132,204,22,0.25)',
            borderRadius: 'var(--radius-lg)', padding: '20px 24px',
            marginBottom: 28, display: 'flex', alignItems: 'center', gap: 20,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onClick={() => navigate('/pdfs')}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(132,204,22,0.14) 0%, rgba(132,204,22,0.06) 100%)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(132,204,22,0.08) 0%, rgba(132,204,22,0.03) 100%)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Icon */}
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'rgba(132,204,22,0.15)', border: '1px solid rgba(132,204,22,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, flexShrink: 0,
            }}>📄</div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17,
                color: 'var(--text-1)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                PDF Study Modules
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 99,
                  background: 'rgba(132,204,22,0.2)', color: '#84cc16', fontWeight: 700,
                }}>NEW</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
                {pdfModules.length} modules available — Notes, Formula Sheets, Question Banks
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {['📖 Notes', '📐 Formula Sheets', '❓ Question Banks'].map(tag => (
                  <span key={tag} style={{
                    fontSize: 11, padding: '2px 10px', borderRadius: 99,
                    background: 'rgba(132,204,22,0.1)', color: '#84cc16',
                    border: '1px solid rgba(132,204,22,0.2)',
                  }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div style={{
              fontSize: 24, color: '#84cc16', fontWeight: 700, flexShrink: 0,
            }}>→</div>
          </div>

          {/* ── Branch Cards ── */}
          <h2 style={{
            fontFamily: 'Syne', fontWeight: 700, fontSize: 18,
            color: 'var(--text-1)', marginBottom: 20,
          }}>
            Explore by Branch
          </h2>
          <div className="stagger" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 18,
          }}>
            {branches.map(branch => {
              const count = simulations.filter(s => s.branch === branch.id).length
              return (
                <BranchCard key={branch.id} branch={branch} count={count}
                  onClick={() => navigate(`/branch/${branch.id}`)} />
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

function BranchCard({ branch, count, onClick }) {
  return (
    <div className="fade-up" onClick={onClick} style={{
      background: 'var(--navy-800)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '22px 22px 20px',
      cursor: 'pointer', transition: 'all 0.22s ease',
      position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.borderColor = `${branch.color}55`
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px ${branch.color}33`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        position: 'absolute', right: -16, top: -16,
        width: 88, height: 88, borderRadius: '50%',
        background: `${branch.color}14`, pointerEvents: 'none',
      }}/>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 'var(--radius-md)',
          background: `${branch.color}22`, border: `1px solid ${branch.color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
        }}>{branch.icon}</div>
        <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 26,
          color: branch.color, lineHeight: 1 }}>
          {count}
          <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-3)',
            display: 'block', marginTop: 1 }}>sims</span>
        </div>
      </div>

      <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16,
        color: 'var(--text-1)', marginTop: 14, marginBottom: 5 }}>
        {branch.label}
      </h3>
      <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
        {branch.desc}
      </p>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 12, fontWeight: 600, color: branch.color }}>
        Explore all {count} →
      </div>
    </div>
  )
}

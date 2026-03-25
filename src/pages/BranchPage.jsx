// src/pages/BranchPage.jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import SimCard from '../components/SimCard.jsx'
import TopBar from '../components/TopBar.jsx'
import { getByBranch, getBranchInfo } from '../data/SimulationData.js'

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function BranchPage() {
  const { branchId } = useParams()
  const navigate     = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [diffFilter,  setDiffFilter]  = useState('All')

  const branch = getBranchInfo(branchId)
  const sims   = getByBranch(branchId)

  const filtered = sims.filter(s => {
    const matchDiff  = diffFilter === 'All' || s.difficulty === diffFilter
    const matchSearch = !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchDiff && matchSearch
  })

  if (!branch) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', color: 'var(--text-2)', fontFamily: 'Syne' }}>
      Branch not found
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar
          title={`${branch.icon} ${branch.label}`}
          subtitle={`${branch.desc} · ${sims.length} simulations`}
          breadcrumb={[{ label: branch.label }]}
          color={branch.color}
          onBack={() => navigate('/')}
        />

        {/* Filter bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 28px',
          background: 'var(--navy-900)',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)', marginRight: 4 }}>Difficulty:</span>
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              style={{
                padding: '5px 14px', borderRadius: 99,
                border: `1px solid ${diffFilter === d ? branch.color : 'var(--border)'}`,
                background: diffFilter === d ? `${branch.color}22` : 'var(--surface)',
                color: diffFilter === d ? branch.color : 'var(--text-2)',
                fontSize: 12, fontWeight: 500,
                transition: 'all var(--transition)',
              }}
            >
              {d}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-3)' }}>
            {filtered.length} of {sims.length} shown
          </span>
        </div>

        {/* Cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontFamily: 'Syne', fontSize: 16 }}>No simulations match your filter</div>
            </div>
          ) : (
            <div
              className="stagger"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 18,
              }}
            >
              {filtered.map(sim => <SimCard key={sim.id} sim={sim} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

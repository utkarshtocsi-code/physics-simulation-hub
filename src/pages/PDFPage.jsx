// src/pages/PDFPage.jsx
// PDF Modules browser — branch filter, type filter, inline viewer

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import TopBar from '../components/TopBar.jsx'
import { pdfModules, pdfTypes, getPDFTypeInfo } from '../data/PDFData.js'
import { branches } from '../data/SimulationData.js'

export default function PDFPage({ onlinePdfs = [], searchQuery, setSearchQuery }) {
  const navigate       = useNavigate()
  const [branchFilter, setBranchFilter] = useState('all')
  const [typeFilter,   setTypeFilter]   = useState('all')
  const [viewing,      setViewing]      = useState(null)  // currently open PDF

  // Merge offline + online PDFs
  const allPdfs = [
    ...pdfModules,
    ...onlinePdfs.map(p => ({ ...p, source: 'online' })),
  ]

  const filtered = allPdfs.filter(p => {
    const matchBranch = branchFilter === 'all' || p.branch === branchFilter
    const matchType   = typeFilter   === 'all' || p.type   === typeFilter
    const matchSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchBranch && matchType && matchSearch
  })

  // PDF ka src path banana
  const getPDFSrc = (pdf) => {
    if (pdf.source === 'online') return pdf.url  // online PDFs ka direct URL
    // Electron ya browser — relative path
    if (window.electronAPI?.isElectron) {
      return `pdflocal://${pdf.filename}`
    }
    return `/pdfs/${pdf.filename}`
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left panel: PDF list ── */}
        <div style={{
          width: viewing ? '380px' : '100%',
          minWidth: viewing ? '320px' : undefined,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          borderRight: viewing ? '1px solid var(--border)' : 'none',
          transition: 'width 0.3s ease',
        }}>
          <TopBar
            title="📄 PDF Modules"
            subtitle={`${filtered.length} modules available`}
            onBack={() => navigate('/')}
          />

          {/* Filter bar */}
          <div style={{
            padding: '10px 16px', borderBottom: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0,
            background: 'var(--navy-900)',
          }}>
            {/* Branch filter */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <FilterBtn active={branchFilter === 'all'} onClick={() => setBranchFilter('all')} color="#3b82f6">All Branches</FilterBtn>
              {branches.map(b => (
                <FilterBtn key={b.id} active={branchFilter === b.id} onClick={() => setBranchFilter(b.id)} color={b.color}>
                  {b.icon} {b.label}
                </FilterBtn>
              ))}
            </div>
            {/* Type filter */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <FilterBtn active={typeFilter === 'all'} onClick={() => setTypeFilter('all')} color="#6366f1">All Types</FilterBtn>
              {pdfTypes.map(t => (
                <FilterBtn key={t.id} active={typeFilter === t.id} onClick={() => setTypeFilter(t.id)} color={t.color}>
                  {t.icon} {t.label}
                </FilterBtn>
              ))}
            </div>
          </div>

          {/* PDF cards */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontFamily: 'Syne', fontSize: 15 }}>Koi PDF nahi mili</div>
                <div style={{ fontSize: 12, marginTop: 6 }}>Filter change karein ya PDF files add karein</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map(pdf => (
                  <PDFCard
                    key={pdf.id}
                    pdf={pdf}
                    isActive={viewing?.id === pdf.id}
                    onClick={() => setViewing(viewing?.id === pdf.id ? null : pdf)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right panel: PDF viewer ── */}
        {viewing && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Viewer header */}
            <div style={{
              padding: '10px 16px', background: 'var(--navy-950)',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
            }}>
              <button onClick={() => setViewing(null)} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                color: 'var(--text-2)', padding: '5px 12px', borderRadius: 'var(--radius-sm)',
                fontSize: 12, cursor: 'pointer',
              }}>✕ Close</button>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--text-1)', flex: 1 }}>
                {viewing.title}
              </div>
              <a
                href={getPDFSrc(viewing)}
                download={viewing.title + '.pdf'}
                style={{
                  background: '#3b82f6', color: 'white', padding: '5px 14px',
                  borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600,
                  fontFamily: 'Syne', textDecoration: 'none',
                }}
              >
                ⬇ Download
              </a>
            </div>

            {/* iframe PDF viewer */}
            <iframe
              src={getPDFSrc(viewing)}
              title={viewing.title}
              style={{ flex: 1, border: 'none', width: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function PDFCard({ pdf, isActive, onClick }) {
  const typeInfo   = getPDFTypeInfo(pdf.type)
  const branchInfo = branches.find(b => b.id === pdf.branch)

  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? 'rgba(59,130,246,0.1)' : 'var(--navy-800)',
        border: `1px solid ${isActive ? '#3b82f6' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-2)' }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {/* Icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 8, flexShrink: 0,
        background: `${typeInfo?.color}22`, border: `1px solid ${typeInfo?.color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>
        {typeInfo?.icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: 'var(--text-1)',
          }}>{pdf.title}</span>
          {pdf.source === 'online' && (
            <span style={{
              fontSize: 9, padding: '1px 6px', borderRadius: 99,
              background: 'rgba(16,185,129,0.15)', color: '#10b981',
              border: '1px solid rgba(16,185,129,0.3)', fontWeight: 600,
            }}>ONLINE</span>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6, lineHeight: 1.4 }}>
          {pdf.description}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, padding: '2px 7px', borderRadius: 99,
            background: `${branchInfo?.color}22`, color: branchInfo?.color,
          }}>{branchInfo?.icon} {branchInfo?.label}</span>
          <span style={{
            fontSize: 10, padding: '2px 7px', borderRadius: 99,
            background: `${typeInfo?.color}18`, color: typeInfo?.color,
          }}>{typeInfo?.label}</span>
          {pdf.pages && (
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 99,
              background: 'var(--surface)', color: 'var(--text-3)',
              border: '1px solid var(--border)',
            }}>{pdf.pages} pages</span>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterBtn({ children, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500,
      border: `1px solid ${active ? color : 'var(--border)'}`,
      background: active ? `${color}22` : 'transparent',
      color: active ? color : 'var(--text-3)',
      cursor: 'pointer', transition: 'all 0.15s',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </button>
  )
}

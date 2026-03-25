import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import { simulations, getBranchInfo } from '../data/SimulationData.js'

function getSimSrc(simPath) {
  // simPath = "/simulations/mechanics/projectile-motion.html"
  if (window.electronAPI?.isElectron) {
    // "sim://" + "mechanics/projectile-motion.html"
    // simPath se "/simulations/" remove karo
    const cleanPath = simPath.replace('/simulations/', '')
    return 'sim://' + cleanPath
  }
  return simPath
}

export default function SimulationPage() {
  const { simId }  = useParams()
  const navigate   = useNavigate()
  const iframeRef  = useRef(null)
  const [searchQuery, setSearchQuery]     = useState('')
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [isLoading, setIsLoading]         = useState(true)

  const sim    = simulations.find(s => s.id === parseInt(simId))
  const branch = sim ? getBranchInfo(sim.branch) : null

  const branchSims   = sim ? simulations.filter(s => s.branch === sim.branch) : []
  const currentIndex = branchSims.findIndex(s => s.id === sim?.id)
  const prevSim      = branchSims[currentIndex - 1]
  const nextSim      = branchSims[currentIndex + 1]

  if (!sim) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', color:'var(--text-2)', flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:48 }}>🔭</div>
      <div style={{ fontFamily:'Syne', fontSize:20 }}>Simulation not found</div>
      <button onClick={() => navigate('/')} style={{
        padding:'10px 20px', borderRadius:'var(--radius-md)',
        background:'var(--accent)', border:'none', color:'white',
        fontFamily:'Syne', fontWeight:600, fontSize:14, cursor:'pointer',
      }}>← Back to Dashboard</button>
    </div>
  )

  const diffColors = { Beginner:'#22c55e', Intermediate:'#f59e0b', Advanced:'#ef4444' }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      {!sidebarHidden && <Sidebar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Top bar */}
        <div style={{
          display:'flex', alignItems:'center', gap:12, padding:'10px 18px',
          background:'var(--navy-950)', borderBottom:`1px solid ${branch?.color}33`,
          flexShrink:0, minHeight:54,
        }}>
          <button onClick={() => setSidebarHidden(p => !p)} style={{
            width:32, height:32, borderRadius:'var(--radius-sm)',
            background:'var(--surface)', border:'1px solid var(--border)',
            color:'var(--text-2)', fontSize:14, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            {sidebarHidden ? '▶' : '◀'}
          </button>

          <button onClick={() => navigate(`/branch/${sim.branch}`)} style={{
            display:'flex', alignItems:'center', gap:5, padding:'5px 12px',
            borderRadius:'var(--radius-sm)', border:'1px solid var(--border)',
            background:'var(--surface)', color:'var(--text-2)',
            fontSize:12, fontWeight:500, cursor:'pointer', flexShrink:0,
          }}>
            ← {branch?.label}
          </button>

          <div style={{ flex:1, minWidth:0, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:20, flexShrink:0 }}>{branch?.icon}</span>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:'Syne', fontWeight:700, fontSize:14,
                color:'var(--text-1)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {sim.title}
              </div>
              <div style={{ fontSize:11, color:'var(--text-3)' }}>
                {branch?.label} · #{String(sim.id).padStart(2,'0')}
              </div>
            </div>
            <span style={{ fontSize:10, padding:'2px 8px', borderRadius:99, flexShrink:0,
              background:`${diffColors[sim.difficulty]}18`, color:diffColors[sim.difficulty], fontWeight:600 }}>
              {sim.difficulty}
            </span>
          </div>

          <div style={{ display:'flex', gap:6, flexShrink:0 }}>
            <button onClick={() => prevSim && navigate(`/simulation/${prevSim.id}`)} disabled={!prevSim}
              style={{ padding:'5px 10px', borderRadius:'var(--radius-sm)',
                border:'1px solid var(--border)', background:'var(--surface)',
                color:prevSim ? 'var(--text-2)' : 'var(--text-3)',
                fontSize:12, cursor:prevSim ? 'pointer' : 'default', opacity:prevSim ? 1 : 0.4 }}>
              ‹ Prev
            </button>
            <button onClick={() => nextSim && navigate(`/simulation/${nextSim.id}`)} disabled={!nextSim}
              style={{ padding:'5px 10px', borderRadius:'var(--radius-sm)',
                border:'1px solid var(--border)', background:'var(--surface)',
                color:nextSim ? 'var(--text-2)' : 'var(--text-3)',
                fontSize:12, cursor:nextSim ? 'pointer' : 'default', opacity:nextSim ? 1 : 0.4 }}>
              Next ›
            </button>
          </div>

          <button onClick={() => iframeRef.current?.requestFullscreen()} style={{
            padding:'6px 14px', borderRadius:'var(--radius-sm)', border:'none',
            background:`linear-gradient(135deg, ${branch?.color}, ${branch?.color}cc)`,
            color:'white', fontSize:12, fontWeight:600, fontFamily:'Syne',
            cursor:'pointer', flexShrink:0,
          }}>
            ⛶ Fullscreen
          </button>
        </div>

        {/* iFrame */}
        <div style={{ flex:1, position:'relative', background:'#000', overflow:'hidden' }}>
          {isLoading && (
            <div style={{ position:'absolute', inset:0, zIndex:10,
              display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', background:'var(--navy-900)', gap:16 }}>
              <span style={{ fontSize:40 }}>{branch?.icon}</span>
              <div style={{ fontFamily:'Syne', fontSize:16, color:'var(--text-2)' }}>
                Loading {sim.title}…
              </div>
              <div style={{ width:200, height:3, background:'var(--surface)',
                borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:99,
                  background:`linear-gradient(90deg, transparent, ${branch?.color}, transparent)`,
                  backgroundSize:'200% 100%', animation:'shimmer 1.4s ease-in-out infinite' }}/>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={getSimSrc(sim.path)}
            title={sim.title}
            onLoad={() => setIsLoading(false)}
            allow="fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            style={{ width:'100%', height:'100%', border:'none', display:'block' }}
          />
        </div>

        {/* Bottom bar */}
        <div style={{ padding:'8px 20px', background:'var(--navy-950)',
          borderTop:'1px solid var(--border)', display:'flex', alignItems:'center',
          gap:16, fontSize:11, color:'var(--text-3)', flexShrink:0 }}>
          <span style={{ color:branch?.color }}>{branch?.icon} {branch?.label}</span>
          <span>·</span>
          <span>{sim.description}</span>
          <span style={{ marginLeft:'auto', display:'flex', gap:8 }}>
            {sim.tags.map(t => (
              <span key={t} style={{ padding:'1px 7px', borderRadius:99,
                background:'var(--surface)', border:'1px solid var(--border)' }}>{t}</span>
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}

// src/components/UpdateDialog.jsx
// Beautiful update notification with:
//   - "Update available" banner with release notes
//   - Download progress bar
//   - "Restart to install" button
//   - Manual "Check for updates" option

import { useState, useEffect } from 'react'

export default function UpdateDialog() {
  const [state, setState] = useState('idle')
  // idle | available | downloading | downloaded | error
  const [updateInfo,  setUpdateInfo]  = useState(null)
  const [progress,    setProgress]    = useState(0)
  const [speed,       setSpeed]       = useState(0)
  const [dismissed,   setDismissed]   = useState(false)
  const [manualCheck, setManualCheck] = useState(false)

  const isElectron = !!window.electronAPI?.isElectron

  useEffect(() => {
    if (!isElectron) return

    window.electronAPI.onUpdateAvailable((info) => {
      setUpdateInfo(info)
      setState('available')
      setDismissed(false)
    })

    window.electronAPI.onUpdateProgress((p) => {
      setState('downloading')
      setProgress(p.percent)
      setSpeed(p.bytesPerSecond)
    })

    window.electronAPI.onUpdateDownloaded((info) => {
      setState('downloaded')
      setProgress(100)
    })

    return () => window.electronAPI.removeUpdateListeners?.()
  }, [])

  const handleDownload = async () => {
    setState('downloading')
    setProgress(0)
    await window.electronAPI.downloadUpdate()
  }

  const handleInstall = () => {
    window.electronAPI.installUpdate()
  }

  const handleManualCheck = async () => {
    setManualCheck(true)
    const result = await window.electronAPI.checkForUpdates()
    setManualCheck(false)
    if (result?.error || !result?.version) {
      // Show "up to date" briefly
      setState('uptodate')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  const formatSpeed = (bps) => {
    if (bps > 1024 * 1024) return `${(bps / 1024 / 1024).toFixed(1)} MB/s`
    if (bps > 1024)        return `${(bps / 1024).toFixed(0)} KB/s`
    return `${bps} B/s`
  }

  // ── "Up to date" toast ────────────────────────────────────────────────────
  if (state === 'uptodate') {
    return (
      <div style={bannerStyle('#065f46')}>
        <span style={{ fontSize: 16 }}>✅</span>
        <span style={{ flex: 1, fontSize: 13, color: 'white', fontFamily: 'Syne', fontWeight: 600 }}>
          App latest version par hai!
        </span>
      </div>
    )
  }

  // ── Update available ──────────────────────────────────────────────────────
  if (state === 'available' && !dismissed) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #1a2744 100%)',
        borderBottom: '1px solid rgba(59,130,246,0.4)',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}>
        {/* Icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>🆕</div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'white',
          }}>
            New Update Available — v{updateInfo?.version}
          </div>
          {updateInfo?.releaseNotes && (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              {typeof updateInfo.releaseNotes === 'string'
                ? updateInfo.releaseNotes.replace(/<[^>]+>/g, '').slice(0, 120)
                : 'Bug fixes aur improvements'}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setDismissed(true)}
            style={{
              padding: '6px 12px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent', color: 'rgba(255,255,255,0.6)',
              fontSize: 12, cursor: 'pointer',
            }}
          >
            Baad Mein
          </button>
          <button
            onClick={handleDownload}
            style={{
              padding: '6px 16px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white', fontSize: 12, fontWeight: 700,
              fontFamily: 'Syne', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            ⬇ Download Now
          </button>
        </div>

        <button onClick={() => setDismissed(true)} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
          fontSize: 18, cursor: 'pointer', padding: '0 4px', flexShrink: 0,
        }}>✕</button>
      </div>
    )
  }

  // ── Downloading ───────────────────────────────────────────────────────────
  if (state === 'downloading') {
    return (
      <div style={{
        background: '#0d1a2e',
        borderBottom: '1px solid rgba(59,130,246,0.3)',
        padding: '10px 20px', flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8,
        }}>
          <span style={{ fontSize: 14 }}>⬇</span>
          <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: 'white' }}>
            Downloading update...
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            {progress}% · {formatSpeed(speed)}
          </span>
        </div>
        {/* Progress bar */}
        <div style={{
          height: 6, background: 'rgba(255,255,255,0.1)',
          borderRadius: 99, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
            width: `${progress}%`,
            transition: 'width 0.3s ease',
          }}/>
        </div>
      </div>
    )
  }

  // ── Downloaded — ready to install ─────────────────────────────────────────
  if (state === 'downloaded') {
    return (
      <div style={bannerStyle('#065f46')}>
        <span style={{ fontSize: 16 }}>✅</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: 'white' }}>
            Update ready! App restart karo install ke liye.
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
            App quit hone par automatically install hoga
          </div>
        </div>
        <button
          onClick={handleInstall}
          style={{
            padding: '7px 16px', borderRadius: 8, border: 'none',
            background: '#22c55e', color: 'white',
            fontSize: 12, fontWeight: 700, fontFamily: 'Syne', cursor: 'pointer',
          }}
        >
          🔄 Restart & Install
        </button>
      </div>
    )
  }

  // ── Idle — show nothing (manual check button in Settings) ─────────────────
  return null
}

// ── Standalone "Check for Updates" button (use in Settings/About page) ───────
export function CheckUpdateButton() {
  const [checking, setChecking] = useState(false)
  const [result,   setResult]   = useState(null)

  const check = async () => {
    setChecking(true)
    setResult(null)
    try {
      const r = await window.electronAPI?.checkForUpdates()
      if (r?.error) setResult({ type: 'error', msg: 'Check failed. Internet check karo.' })
      else if (!r?.version) setResult({ type: 'ok', msg: 'App latest version par hai ✅' })
      else setResult({ type: 'update', msg: `v${r.version} available!` })
    } catch {
      setResult({ type: 'error', msg: 'Error occurred' })
    } finally {
      setChecking(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        onClick={check}
        disabled={checking}
        style={{
          padding: '8px 18px', borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--text-2)', fontSize: 13, cursor: 'pointer',
          opacity: checking ? 0.6 : 1,
        }}
      >
        {checking ? '🔍 Checking...' : '🔄 Check for Updates'}
      </button>
      {result && (
        <span style={{
          fontSize: 12,
          color: result.type === 'ok' ? '#22c55e'
               : result.type === 'error' ? '#ef4444' : '#f59e0b',
        }}>
          {result.msg}
        </span>
      )}
    </div>
  )
}

// Helper
function bannerStyle(bg) {
  return {
    background: bg,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    padding: '10px 20px',
    display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
  }
}

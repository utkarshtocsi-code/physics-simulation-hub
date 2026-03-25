// src/components/UpdateNotification.jsx
// Shows app update available + new content notification banners

import { useState } from 'react'

// ── App Update Banner (electron-updater se) ───────────────────────────────────
export function AppUpdateBanner() {
  const [updateInfo, setUpdateInfo] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Electron IPC events listen karo
  if (typeof window !== 'undefined' && window.electronAPI?.isElectron) {
    // Yeh real Electron app mein kaam karega
    window.electronAPI?.onUpdateAvailable?.((info) => {
      setUpdateInfo(info)
    })
    window.electronAPI?.onUpdateDownloaded?.(() => {
      setDownloading(false)
    })
  }

  if (!updateInfo || dismissed) return null

  return (
    <div style={{
      background: 'linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%)',
      padding: '10px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      flexShrink: 0,
      zIndex: 100,
    }}>
      <span style={{ fontSize: 16 }}>🆕</span>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Syne' }}>
          New Version Available — v{updateInfo.version}
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginLeft: 10 }}>
          {updateInfo.releaseNotes || 'Bug fixes aur improvements'}
        </span>
      </div>
      <button
        onClick={() => {
          setDownloading(true)
          window.electronAPI?.downloadUpdate?.()
        }}
        disabled={downloading}
        style={{
          padding: '6px 14px', borderRadius: 8, border: 'none',
          background: 'white', color: '#1d4ed8',
          fontSize: 12, fontWeight: 700, fontFamily: 'Syne',
          cursor: downloading ? 'default' : 'pointer',
          opacity: downloading ? 0.7 : 1,
        }}
      >
        {downloading ? '⬇ Downloading...' : '⬇ Update Now'}
      </button>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'transparent', border: 'none',
          color: 'rgba(255,255,255,0.6)', fontSize: 16, cursor: 'pointer', padding: '0 4px',
        }}
      >✕</button>
    </div>
  )
}

// ── New Content Banner (online content check se) ──────────────────────────────
export function NewContentBanner({ hasNewContent, onDismiss, onView }) {
  if (!hasNewContent) return null

  return (
    <div style={{
      background: 'linear-gradient(90deg, #065f46 0%, #047857 100%)',
      padding: '9px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 16 }}>✨</span>
      <span style={{ flex: 1, fontSize: 13, color: 'white', fontFamily: 'Syne', fontWeight: 600 }}>
        Nayi simulations aur PDFs available hain!
      </span>
      <button onClick={onView} style={{
        padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.4)',
        background: 'transparent', color: 'white',
        fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Syne',
      }}>
        View New Content
      </button>
      <button onClick={onDismiss} style={{
        background: 'transparent', border: 'none',
        color: 'rgba(255,255,255,0.6)', fontSize: 16, cursor: 'pointer',
      }}>✕</button>
    </div>
  )
}

// ── Announcement Banner ───────────────────────────────────────────────────────
export function AnnouncementBanner({ message, onDismiss }) {
  if (!message) return null

  return (
    <div style={{
      background: 'linear-gradient(90deg, #7c3aed 0%, #6d28d9 100%)',
      padding: '9px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 16 }}>📢</span>
      <span style={{ flex: 1, fontSize: 13, color: 'white' }}>{message}</span>
      <button onClick={onDismiss} style={{
        background: 'transparent', border: 'none',
        color: 'rgba(255,255,255,0.6)', fontSize: 16, cursor: 'pointer',
      }}>✕</button>
    </div>
  )
}

// ── Online Status Indicator ───────────────────────────────────────────────────
export function OnlineStatus({ isOnline, isChecking }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      fontSize: 10, color: 'var(--text-3)',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: isChecking ? '#f59e0b' : isOnline ? '#22c55e' : '#ef4444',
        animation: isChecking ? 'pulse-dot 1s infinite' : 'none',
      }}/>
      {isChecking ? 'Checking...' : isOnline ? 'Online' : 'Offline'}
    </div>
  )
}

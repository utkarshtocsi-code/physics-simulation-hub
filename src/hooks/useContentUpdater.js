// src/hooks/useContentUpdater.js
// Checks GitHub for new simulations/PDFs and merges with local data

import { useState, useEffect, useCallback } from 'react'

// ── CONFIG — Yahan apna GitHub username aur repo name daalein ──────────────
const GITHUB_USER    = 'YOUR_GITHUB_USERNAME'   // ← replace karein
const GITHUB_REPO    = 'physics-sim-content'    // ← replace karein
const CONTENT_URL    = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/content.json`
const STORAGE_KEY    = 'psh_online_content'
const LAST_CHECK_KEY = 'psh_last_check'
const CHECK_INTERVAL = 1000 * 60 * 60 * 6  // 6 ghante mein ek baar check

export function useContentUpdater(localSimulations, localBranches) {
  const [onlineContent, setOnlineContent]   = useState(null)
  const [isChecking,    setIsChecking]       = useState(false)
  const [hasNewContent, setHasNewContent]    = useState(false)
  const [announcement,  setAnnouncement]     = useState('')
  const [isOnline,      setIsOnline]         = useState(navigator.onLine)

  // ── Online/offline detect ──────────────────────────────────────────────
  useEffect(() => {
    const goOnline  = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online',  goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online',  goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // ── Fetch online content.json from GitHub ─────────────────────────────
  const checkForUpdates = useCallback(async (force = false) => {
    if (!isOnline) return

    // Throttle: 6 ghante se pehle dobara check nahi
    const lastCheck = localStorage.getItem(LAST_CHECK_KEY)
    if (!force && lastCheck && Date.now() - parseInt(lastCheck) < CHECK_INTERVAL) {
      // Cached data use karo
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        try {
          const data = JSON.parse(cached)
          setOnlineContent(data)
          if (data.announcement) setAnnouncement(data.announcement)
        } catch {}
      }
      return
    }

    setIsChecking(true)
    try {
      const res  = await fetch(CONTENT_URL + '?t=' + Date.now())
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY,    JSON.stringify(data))
      localStorage.setItem(LAST_CHECK_KEY, String(Date.now()))

      setOnlineContent(data)

      // Announcement check
      if (data.announcement) setAnnouncement(data.announcement)

      // New content check — local mein nahi hai jo online mein hai
      const localIds = new Set(localSimulations.map(s => s.id))
      const newSims  = (data.simulations || []).filter(s => !localIds.has(s.id))
      const localPdfIds = new Set() // future use
      const newPdfs  = (data.pdfs || []).length > 0

      if (newSims.length > 0 || newPdfs) {
        setHasNewContent(true)
      }
    } catch (err) {
      console.warn('Content update check failed:', err.message)
      // Offline fallback — cached data use karo
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        try { setOnlineContent(JSON.parse(cached)) } catch {}
      }
    } finally {
      setIsChecking(false)
    }
  }, [isOnline, localSimulations])

  // ── Auto-check on mount aur jab online ho ─────────────────────────────
  useEffect(() => {
    if (isOnline) checkForUpdates()
  }, [isOnline])

  // ── Merge local + online data ──────────────────────────────────────────
  const mergedSimulations = (() => {
    if (!onlineContent?.simulations?.length) return localSimulations
    const localIds = new Set(localSimulations.map(s => s.id))
    const extra    = onlineContent.simulations.filter(s => !localIds.has(s.id))
    return [...localSimulations, ...extra.map(s => ({ ...s, source: 'online' }))]
  })()

  const mergedBranches = (() => {
    if (!onlineContent?.branches?.length) return localBranches
    const localIds = new Set(localBranches.map(b => b.id))
    const extra    = onlineContent.branches.filter(b => !localIds.has(b.id))
    return [...localBranches, ...extra]
  })()

  const onlinePdfs = onlineContent?.pdfs || []

  return {
    mergedSimulations,
    mergedBranches,
    onlinePdfs,
    isOnline,
    isChecking,
    hasNewContent,
    announcement,
    checkForUpdates,
    dismissNewContent: () => setHasNewContent(false),
    dismissAnnouncement: () => setAnnouncement(''),
  }
}

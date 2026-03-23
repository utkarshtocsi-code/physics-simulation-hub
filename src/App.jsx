import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Dashboard      from './pages/Dashboard.jsx'
import BranchPage     from './pages/BranchPage.jsx'
import SimulationPage from './pages/SimulationPage.jsx'
import PDFPage        from './pages/PDFPage.jsx'
import UpdateDialog   from './components/UpdateDialog.jsx'
import { AnnouncementBanner, NewContentBanner } from './components/UpdateNotification.jsx'
import { useContentUpdater } from './hooks/useContentUpdater.js'
import { simulations, branches } from './data/SimulationData.js'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const {
    mergedSimulations, mergedBranches, onlinePdfs,
    isOnline, isChecking, hasNewContent, announcement,
    dismissNewContent, dismissAnnouncement,
  } = useContentUpdater(simulations, branches)

  const shared = {
    searchQuery, setSearchQuery,
    simulations: mergedSimulations,
    branches: mergedBranches,
    isOnline, isChecking,
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>
      {/* ── Update banners — always on top ── */}
      <UpdateDialog />
      <AnnouncementBanner message={announcement} onDismiss={dismissAnnouncement} />
      <NewContentBanner hasNewContent={hasNewContent} onDismiss={dismissNewContent} onView={dismissNewContent} />

      {/* ── Pages ── */}
      <div style={{ flex:1, overflow:'hidden' }}>
        <Routes>
          <Route path="/"                  element={<Dashboard      {...shared} />} />
          <Route path="/branch/:branchId"  element={<BranchPage     {...shared} />} />
          <Route path="/simulation/:simId" element={<SimulationPage {...shared} />} />
          <Route path="/pdfs"              element={<PDFPage onlinePdfs={onlinePdfs} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        </Routes>
      </div>
    </div>
  )
}

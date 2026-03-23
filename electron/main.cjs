const { app, BrowserWindow, protocol, net, ipcMain, shell } = require('electron')
const path = require('path')
const url  = require('url')
const fs   = require('fs')

let autoUpdater = null
try { autoUpdater = require('electron-updater').autoUpdater } catch(e) {}

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function getSimPath() {
  if (isDev) return path.join(__dirname, '..', 'public', 'simulations')
  return path.join(process.resourcesPath, 'simulations')
}

function getPdfPath() {
  if (isDev) return path.join(__dirname, '..', 'public', 'pdfs')
  return path.join(process.resourcesPath, 'pdfs')
}

app.whenReady().then(() => {

  // sim:// protocol — FIXED path parsing
  protocol.handle('sim', (request) => {
    try {
      const reqUrl = request.url
      // reqUrl = "sim:///simulations/mechanics/projectile-motion.html"
      // ya      = "sim://simulations/mechanics/projectile-motion.html"
      
      // sim:// ke baad sab kuch lo
      let simRelPath = reqUrl.replace(/^sim:\/\/+/, '')
      // simRelPath = "simulations/mechanics/projectile-motion.html"
      // ya         = "/simulations/mechanics/projectile-motion.html"
      
      // Leading slash hatao
      simRelPath = simRelPath.replace(/^\/+/, '')
      // simRelPath = "simulations/mechanics/projectile-motion.html"
      
      // "simulations/" prefix hatao agar hai
      if (simRelPath.startsWith('simulations/')) {
        simRelPath = simRelPath.replace('simulations/', '')
      }
      // simRelPath = "mechanics/projectile-motion.html"
      
      // Windows path separators
      const normalizedPath = simRelPath.split('/').join(path.sep)
      const filePath = path.join(getSimPath(), normalizedPath)
      
      console.log('sim:// request:', reqUrl)
      console.log('Resolved path:', filePath)
      console.log('File exists:', fs.existsSync(filePath))
      
      if (fs.existsSync(filePath)) {
        return net.fetch(url.pathToFileURL(filePath).toString())
      }
      
      // File nahi mili — helpful error page
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="background:#0a0f1e;color:#ef4444;font-family:sans-serif;
          display:flex;align-items:center;justify-content:center;height:100vh;
          flex-direction:column;gap:12px;text-align:center;padding:20px">
          <div style="font-size:48px">⚠️</div>
          <div style="font-size:20px;color:white">Simulation file nahi mili</div>
          <div style="font-size:12px;color:#94a3b8;background:#1e293b;padding:12px;border-radius:8px;max-width:600px;word-break:break-all">
            ${filePath}
          </div>
          <div style="font-size:13px;color:#64748b">
            Simulations folder: ${getSimPath()}
          </div>
        </body>
        </html>
      `, { status: 404, headers: { 'Content-Type': 'text/html' } })
      
    } catch(err) {
      console.error('sim:// error:', err)
      return new Response('Error: ' + err.message, { status: 500 })
    }
  })

  // pdflocal:// protocol
  protocol.handle('pdflocal', (request) => {
    try {
      let pdfRelPath = request.url.replace(/^pdflocal:\/\/+/, '').replace(/^\/+/, '')
      const filePath = path.join(getPdfPath(), pdfRelPath.split('/').join(path.sep))
      if (fs.existsSync(filePath)) {
        return net.fetch(url.pathToFileURL(filePath).toString())
      }
      return new Response('PDF not found: ' + filePath, { status: 404 })
    } catch(err) {
      return new Response('Error: ' + err.message, { status: 500 })
    }
  })

  createWindow()
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow() })
})

let mainWindow = null
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400, height: 900, minWidth: 900, minHeight: 600,
    title: 'Physics Simulation Hub',
    backgroundColor: '#0a0f1e',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (!isDev && autoUpdater) setTimeout(() => setupAutoUpdater(), 3000)
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

function setupAutoUpdater() {
  if (!autoUpdater) return
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true
  setTimeout(() => autoUpdater.checkForUpdates().catch(() => {}), 3000)
  setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 4 * 60 * 60 * 1000)
  autoUpdater.on('update-available', info =>
    mainWindow?.webContents.send('update-available', { version: info.version, releaseNotes: info.releaseNotes || '' }))
  autoUpdater.on('download-progress', p => {
    mainWindow?.webContents.send('update-progress', { percent: Math.round(p.percent), bytesPerSecond: p.bytesPerSecond })
    mainWindow?.setProgressBar(p.percent / 100)
  })
  autoUpdater.on('update-downloaded', info => {
    mainWindow?.setProgressBar(-1)
    mainWindow?.webContents.send('update-downloaded', { version: info.version })
  })
  autoUpdater.on('error', err => { mainWindow?.setProgressBar(-1); console.error('Updater:', err.message) })
}

ipcMain.handle('get-version',       ()    => app.getVersion())
ipcMain.handle('open-external',     (_, u) => shell.openExternal(u))
ipcMain.handle('download-update',   ()    => autoUpdater?.downloadUpdate())
ipcMain.handle('install-update',    ()    => autoUpdater?.quitAndInstall(false, true))
ipcMain.handle('check-for-updates', async () => {
  if (!autoUpdater) return { error: 'not available' }
  try { return { version: (await autoUpdater.checkForUpdates())?.updateInfo?.version } }
  catch(e) { return { error: e.message } }
})

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('web-contents-created', (_, c) => {
  c.setWindowOpenHandler(({ url: u }) => { if (u.startsWith('http')) shell.openExternal(u); return { action: 'deny' } })
})

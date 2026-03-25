// electron/preload.cjs
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron:       true,
  platform:         process.platform,
  getVersion:       ()    => ipcRenderer.invoke('get-version'),
  openExternal:     (url) => ipcRenderer.invoke('open-external', url),
  checkForUpdates:  ()    => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate:   ()    => ipcRenderer.invoke('download-update'),
  installUpdate:    ()    => ipcRenderer.invoke('install-update'),
  // Events from main → renderer
  onUpdateAvailable:  (cb) => ipcRenderer.on('update-available',  (_, d) => cb(d)),
  onUpdateProgress:   (cb) => ipcRenderer.on('update-progress',   (_, d) => cb(d)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', (_, d) => cb(d)),
  removeUpdateListeners: () => {
    ipcRenderer.removeAllListeners('update-available')
    ipcRenderer.removeAllListeners('update-progress')
    ipcRenderer.removeAllListeners('update-downloaded')
  }
})

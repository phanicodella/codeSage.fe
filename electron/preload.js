// Path: codeSage.fe/electron/preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  store: {
    get: (key) => ipcRenderer.invoke('store:get', key),
    set: (key, value) => ipcRenderer.invoke('store:set', key, value)
  }
});
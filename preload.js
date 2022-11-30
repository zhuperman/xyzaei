const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('items', {
  fetch: (type) => ipcRenderer.invoke('fetch', type)
});

contextBridge.exposeInMainWorld('launcher', {
  run: (type, target) => ipcRenderer.invoke('run', type, target),
  exit: () => ipcRenderer.invoke("exit")
});
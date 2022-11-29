const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('items', {
  fetch: (type) => ipcRenderer.invoke('getItems', type)
});

contextBridge.exposeInMainWorld('launcher', {
  launch: (type, target) => ipcRenderer.invoke('launchItem', type, target)
});
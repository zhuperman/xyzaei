const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
let fs = require('fs');
let child = require('child_process').exec;

const createWindow = () => {
  const {width, height} = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: width,
    height: height,
    fullscreen: true,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('fetch', (_, type) => {
  let data = JSON.parse(fs.readFileSync(`D:\\Documents\\xyzaei\\${type}.json`));
  return data;
});

ipcMain.handle('run', (_, type, target) => {
  let vlc = "C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe";
  let cmd = `start "" ${type == "movies" ? '"' + vlc + '"' : ""} "${target}" ${type == "movies" ? "--fullscreen" : ""}`;
  child(cmd, function(err, _) {
    if (err) {
      console.log(err);
    } else {
      app.quit();
    }
  });
});

ipcMain.handle('exit', () => {
  app.quit();
});

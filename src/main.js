const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process').exec;
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, "..", "config", ".env") });

const createWindow = () => {
  const {width, height} = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: width,
    height: height,
    fullscreen: true,
    resizable: false,
    icon: path.join(__dirname, "..", "resources", "icons", "xyzaei.ico"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
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
  
  let data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", `${type}.json`)));
  return data;
});

ipcMain.handle('run', (_, type, target) => {
  const escapedString = str => `'${str}'`;
  const escapedFilePath = str => `\\\"${str}\\\"`;

  let args = [];
  if (type === "movies") {
    executable = process.env.VIDEO_PLAYER_PATH;
    args.push(escapedFilePath(target));
    args.push("/fullscreen");
  } else {
    executable = target;
  }
  args = args.map(escapedString);

  let directory = executable.split("\\").slice(0, -1).join("\\");
  let workingDirectory = directory ? `-WorkingDirectory ${escapedFilePath(directory)}` : "";
  let filePath = executable ? `-FilePath ${escapedFilePath(executable)}` : "";
  let argumentList = args.length ? `-ArgumentList ${args.join(',')}` : "";
  let powershell_cmd = `Start-Process ${workingDirectory} ${filePath} ${argumentList}`;
  let cmd = `powershell -command "${powershell_cmd}"`;

  childProcess(cmd, function(err, _) {
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

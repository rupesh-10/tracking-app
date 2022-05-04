/* eslint-disable no-unused-vars */
'use strict'

import { app, protocol, BrowserWindow,globalShortcut,Menu, nativeImage, Tray } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
let win;
require('@electron/remote/main').initialize()
let isQuiting;
const path = require('path')

const gotTheLock = app.requestSingleInstanceLock()
    
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

app.allowRendererProcessReuse = false

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

app.on('before-quit', function () {
  isQuiting = true;
});

let tray = null
function createTray () {
  const icon = path.join(__dirname, 'wz-logo.ico') // required.
  const trayicon = nativeImage.createFromPath(icon)
  tray = new Tray(trayicon.resize({ width: 16 }))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        win.show()
      }
    },
    {
      label: 'Quit',
      click: () => {
        isQuiting = true;
        app.quit() // actually quit the app.
      }
    },
  ])

  tray.setContextMenu(contextMenu)
}



async function createWindow() {
  if (!tray) { // if tray hasn't been created already.
    createTray()
  }
  // Create the browser window.
   win = new BrowserWindow({
    width: 368,
    height: 630,
    maximizable:false,
    resizable:true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      devTools: true,
    },
    icon:path.join(__dirname, 'wz-logo.ico'),
    title:"Work Zone 1",
  })

  win.on('close', function (event) {
    if(!isQuiting){
        event.preventDefault();
        win.hide();
    }

    return false;
});

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  
    win.webContents.setBackgroundThrottling(false);

}


app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
      await installExtension({
        id: 'ndlbedplllcgconngcnfmkadhokfaaln', // Graphql network Install
        electron: '>=1.2.1'
      })
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  globalShortcut.register('CommandOrControl+Shift+Alt+S',()=>{
    win.webContents.send('timerShortCutPressed')
  })


})






// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}


// Prevent Reloading
if(!isDevelopment){
app.on('browser-window-focus', function () {
  globalShortcut.register("CommandOrControl+R",()=>{});
  globalShortcut.register("CommandOrControl+Shift+R",()=>{});
  globalShortcut.register("F5",()=>{});
}); 


 

app.on('browser-window-blur', function () {
  globalShortcut.unregister('CommandOrControl+R');
  globalShortcut.unregister('CommandOrControl+Shift+R');
  globalShortcut.unregister('F5');
});
}

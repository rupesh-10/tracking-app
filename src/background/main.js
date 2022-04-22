'use strict'

import { app, protocol, BrowserWindow,globalShortcut } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
let win;
require('@electron/remote/main').initialize()

app.allowRendererProcessReuse = false

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
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
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

    // Set a variable when the app is quitting.
    // var isAppQuitting = false;
    // app.on('before-quit', function () {
    //     isAppQuitting = true;
    // });
  
    // win.on('close', function (evt) {
    //     if (!isAppQuitting) {
    //         evt.preventDefault();
    //         win.hide();
    //     }
    // });
  
    win.webContents.setBackgroundThrottling(false);

}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
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

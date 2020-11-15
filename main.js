const {app, BrowserWindow, ipcMain} = require('electron')
    const url = require("url");
    const path = require("path");

    let mainWindow

    function createWindow () {
      mainWindow = new BrowserWindow({
        backgroundColor: '#FFF',
        width: 800,
        height: 600,
        webPreferences: {
          enableRemoteModule: true,
          nodeIntegration: true
        }
      })

      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, `/dist/electron-angular-demo/index.html`),
          protocol: "file:",
          slashes: true
        })
      );
      // Open the DevTools.
      mainWindow.webContents.openDevTools()

      mainWindow.on('closed', function () {
        mainWindow = null
      })
    }

    app.on('ready', createWindow)

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') app.quit()
    })

    app.on('activate', function () {
      if (mainWindow === null) createWindow()
    })


//communcation with angular front-end

//message types

const {POST_REQUEST, POST_RESPONSE, FETCH_POST_KEYS, FETCH_RESPONSE_KEYS, FETCH_POST, FETCH_POST_RESPONSE} = require('./messages/message-types')
const storage = require('electron-json-storage');


ipcMain.on(POST_REQUEST, (event, arg) => {

    const {key} = arg

    storage.set(key, { data: 'hi'}, function(error) {
        if (error) throw error;
        console.log('saved data')
    });


    event.reply(POST_RESPONSE, 'posted')
})

ipcMain.on(FETCH_POST_KEYS, (event) => {

    storage.keys((error, keys) => {
        if(error) throw error

        event.reply(FETCH_RESPONSE_KEYS, keys)

    })

    console.log('sending posts')
})

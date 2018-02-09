const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 600, height: 900, frame:true})
  mainWindow.setMenu(null);
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'site/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
    app.quit()
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// import serialport 
const sp         = require('serialport');
var port_found = false;

// initialize port connection and set up listener for data throughput
var monitor = require('node-usb-detection');

// set up monitor to look at changes on USB device
monitor.change(function(device){
  console.log('detected USB change');
  
  // if we already have an active port, we don't need to query the ports again
  if(!port_found){
        querySerialPorts();
  }
});

// query all the serial ports, in this case naively grabbing the first 
function querySerialPorts() {

    var port_name  = 0;

    // iterate through each of the ports
    sp.list(function(err, ports) {
        for(i = 0; i < ports.length; i++)
        {
            // if the port is not null, and also has a real name
            if (ports[i] && ports[i]['comName']){
                
                // ignore built in ports like bt
                var port_name = ports[i]['comName'];
                if (port_name.toLowerCase().includes('bluetooth'))
                        continue;
            
                // log the port we have found, 
                console.log('Found port: ' + port_name);
                
                // set up this serial port to grab some data
                setupPort(port_name);
                return;
            }
            else{
                // if for whatever reason the ports are null, we should flag it
                mainWindow.webContents.send('set_state', false);
                console.log('NULL PORT: ' + ports[i].toString());
            }
        }
    });

    // if we made it here, set the global port_found to false 
    port_found = false;

}

// set up a serial port to grab raw data
function setupPort(port_name){
    
        // if there is a port to connect to, we'll set it up
        if (port_name){

            // set global port_found to true
            port_found = true;

            // set up serial port params
            var serialport = new sp(port_name, {
                  baudRate: 57600 // should match the micro controller serial baudrate
                });
            var Readline = sp.parsers.Readline;
            var parser = serialport.pipe(new Readline());
            
            // error handling on serial port
            serialport.on('error', function(err) {
                if(err){
                    console.log(err);
                }
            });
            
            // consume input data
            serialport.open(function(){
                
                // log serial port state
                console.log('Serial Port Opened');
                
                // tell application renderer that we're connected
                mainWindow.webContents.send('set_state', true);

                // event handling: on data recieved, send this to the mainwindow
                parser.on('data', function(data){

                    // Send async data to render process
                    mainWindow.webContents.send('stream_data', data);
                });
            });
    }
}

// look for initial connections
querySerialPorts();







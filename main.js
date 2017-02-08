const path = require('path');
const cp = require('child_process');
const {app, dialog, Tray, Menu, BrowserWindow} = require('electron');

const offIcon = path.join(__dirname, 'off.png');
const onIcon = path.join(__dirname, 'on.png');
let appIcon = null;
let win = null;

function turnOn () {
  cp.exec('blueutil off && networksetup -setairportpower airport off', (err, stdout, stderr) => {
    if (err) {
      dialog.showMessageBox({
        type: 'info',
        message: 'Error turning on flight mode:\n' + err.message,
        buttons: ["OK"]
      });
      return;
    }

    console.log(err, stdout, stderr);
    appIcon.setImage(onIcon);
    appIcon.setToolTip('Flight mode is on');
    appIcon.setContextMenu(menuOn);
  });
}

function turnOff () { 
  cp.exec('blueutil on && networksetup -setairportpower airport on', (err, stdout, stderr) => {
    if (err) {
      dialog.showMessageBox({
        type: 'info',
        message: 'Error turning off flight mode:\n' + err.message,
        buttons: ["OK"]
      });
      return;
    }

    console.log(err, stdout, stderr);
    appIcon.setImage(offIcon);
    appIcon.setToolTip('Flight mode is off');
    appIcon.setContextMenu(menuOff);
  });
}

const menuOn = Menu.buildFromTemplate([
  {
    label: 'Turn flight mode off',
    click: turnOff
  }, {
    label: 'Quit',
    selector: 'terminate:',
  }
]);
const menuOff = Menu.buildFromTemplate([
  {
    label: 'Turn flight mode on',
    click: turnOn
  }, {
    label: 'Quit',
    selector: 'terminate:',
  }
]);

app.on('ready', function() {
  win = new BrowserWindow({show: false});
  appIcon = new Tray(offIcon);
  appIcon.setToolTip('Flight mode is off');
  appIcon.setContextMenu(menuOff);
});

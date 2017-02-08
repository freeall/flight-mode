const path = require('path');
const cp = require('child_process');
const sudo = require('sudo-prompt');
const {app, dialog, Tray, Menu} = require('electron');

const offIcon = path.join(__dirname, 'off.png');
const onIcon = path.join(__dirname, 'on.png');
const sudoOptions = {name: 'Flight Mode', icns: path.join(__dirname, 'icon.icns')};
let appIcon = null;

app.dock.hide();

function turnOn () {
  const cmd = '/usr/local/bin/blueutil off && networksetup -setairportpower airport off';
  sudo.exec(cmd, sudoOptions, (err, stdout, stderr) => {
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
  const cmd = '/usr/local/bin/blueutil on && networksetup -setairportpower airport on';
  sudo.exec(cmd, sudoOptions, (err, stdout, stderr) => {
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
  appIcon = new Tray(offIcon);
  appIcon.setToolTip('Flight mode is off');
  appIcon.setContextMenu(menuOff);
});

const electron = require('electron')
// Module to control application life.
const app = electron.app

const Menu = electron.Menu;
const menuTemplate = [
    {
        label: 'HackTable',
        submenu: [
        {
          label: 'Save',
          click: () => {
            alert('dev');
          }
        },
        {
            label: 'About ...',
            click: () => {
                alert('dev');
            }
        }, {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        }]
    }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);
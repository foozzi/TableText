const {remote} = require('electron')
const {Menu, MenuItem} = remote
const m = require('./menuactions');
const Actions = new m();

const menu = new Menu()
var template = [
    { label: "App", submenu: [
        { type: 'normal', label: "About App", click() { console.log('fdgdfg') } },
        { type: 'separator' },
        { type: 'normal', label: "Save", accelerator: 'Command+S', click() { 
            Actions.save_as_tt() 
            return false;
        } },
        { label: 'Save as', submenu: [
        {
            label: 'Save as .txt format',
            click() {
                Actions.save_as_txt()
            }
        },
        {
            label: 'Save as .json format',
            click() {
                alert('in dev')
                return false;
            }
        },
        {
            label: 'Save as Excel format',
            click() {
                alert('in dev')
                return false;
            }
        },
        {
            label: 'Save as .html format',
            click() {
                alert('in dev')
                return false;
            }
        },
        {
            label: 'Save as .csv format',
            click() {
                alert('in dev')
                return false;
            }
        },
        ] },
        { type: 'normal', label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { type: 'normal', label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit(); } }
    ] },
];
Menu.setApplicationMenu(Menu.buildFromTemplate(template));

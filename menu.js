const {remote} = require('electron')
const {Menu, MenuItem, app} = remote
const m = require('./menuactions');
const Actions = new m();

const menu = new Menu()
var template = [
    { label: "App", submenu: [
        { type: 'normal', label: "About App", click() { alert('In Dev :)') } },
        { type: 'separator' },
        { type: 'normal', label: "Save", accelerator: 'Command+S', click() { 
            Actions.save() 
            return false;
        } },
        { label: 'Save as', submenu: [
        {
            label: 'Save as .txt format',
            click() {
                Actions.save('.txt')
            }
        },
        {
            label: 'Save as .json format',
            click() {
                Actions.save('.json')
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
                Actions.save('.html')
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

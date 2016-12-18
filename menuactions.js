"use strict";

const {dialog} = require('electron').remote
const fs = require('fs')
const path = require('path')
const uuid = require('node-uuid')
const mkdirp = require('mkdirp')
const homedir = require('homedir')
let home = homedir()
const config = require('./config.json')

var menuactions = function() {
}
/**
 * Open dialog for save .tt file 
 */
menuactions.prototype.save = function (type) {
	if(type === undefined) {
		type = '.tt';
	}
	var ipc = '.tt'
	switch(type) {
	  case '.txt':  
	    ipc = 'save_text'
	    break
	  case '.json':
	  	ipc = 'save_json'
	  	break
	  case '.html':
	  	ipc = 'save_html'
	  	break
	}
	if($('tbody tr').length < 1) {
		alert('Nothing saving')
		return false;
	}
  	var uniq = uuid.v4();
	$('tbody tr td input').each(function(){
		$(this).attr("value", $(this).val()); 
	})
	var table = $('#main-table').html();
	mkdirp(home+config.tmp+uniq, function (err) {
	    if (err) {
	    	console.log(err)
	    } else {
	    	
	    	fs.writeFile(home+config.tmp+uniq+config.tmp_separator+uniq, table, function(err) {
			    if(err) {
			        console.log(err)
			    }

			    ipcRenderer.send(ipc, {key: uniq, type: type})
			    ipcRenderer.once(ipc, function(event, arg){	
			    	console.log(arg)
			    	dialog.showSaveDialog({defaultPath:(Date.now() / 1000 | 0).toString()+type}, function (fileName) {

				        if (fileName === undefined){
				            console.log("You didn't save the file");
				            return;
				        }

						fs.readFile(arg.path, function(err, data) {
						    fs.writeFile(fileName, data, function (err) {
					           	if(err){
					               	alert("An error ocurred creating the file "+ err.message)
					           	}
								alert("The file has been succesfully saved");
						    });
						});
				      
				       // fileName is a string that contains the path and filename created in the save file dialog.  
				       
					}); 
			    	
			    })
			    console.log('ok')
			}); 
	    }
	});
}

module.exports = menuactions;

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
	  case '.csv':
	  	ipc = 'save_csv'
	  	break
	  case '.xlsx':
	  	ipc = 'save_xlsx'
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
	    	alert(err)
	    	return;
	    } else {
	    	
	    	fs.writeFile(home+config.tmp+uniq+config.tmp_separator+uniq, table, function(err) {
			    if(err) {
			        alert(err)
			        return;
			    }

			    ipcRenderer.send(ipc, {key: uniq, type: type})
			    ipcRenderer.once(ipc, function(event, arg){	
			    	dialog.showSaveDialog({defaultPath:(Date.now() / 1000 | 0).toString()+type}, function (fileName) {

				        if (fileName === undefined){
				            alert('You didn\'t save the file')
				            return;
				        }

						fs.readFile(arg.path, function(err, data) {
						    fs.writeFile(fileName, data, function (err) {
					           	if(err){
					               	alert("An error ocurred creating the file "+ err.message)
					               	return
					           	}
								alert("The file has been succesfully saved");
						    });
						});
				      
				       // fileName is a string that contains the path and filename created in the save file dialog.  
				       
					}); 
			    	
			    })
			}); 
	    }
	});
}

module.exports = menuactions;

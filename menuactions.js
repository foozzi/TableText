"use strict";

const {dialog} = require('electron').remote
const fs = require('fs')
const path = require('path')
const uuid = require('node-uuid');
const mkdirp = require('mkdirp');

var menuactions = function() {
}

/**
 * Open dialog for save .tt file 
 */
menuactions.prototype.save_as_tt = function () {
	if($('tbody tr').length < 1) {
		alert('Nothing saving')
		return false;
	}
  	var uniq = uuid.v4();
	$('tbody tr td input').each(function(){
		$(this).attr("value", $(this).val()); 
	})
	var table = $('#main-table').html();
	mkdirp('db/tmp/'+uniq+'/', function (err) {
	    if (err) {
	    	console.log(err)
	    } else {
	    	
	    	fs.writeFile("db/tmp/"+uniq+"/h-"+uniq, table, function(err) {
			    if(err) {
			        console.log(err)
			    }
			    ipcRenderer.send('save_tt', {key: uniq})
			    ipcRenderer.once('save_tt', function(event, arg){				
			    	dialog.showSaveDialog({defaultPath:(Date.now() / 1000 | 0).toString()+'.tt'}, function (fileName) {
				        if (fileName === undefined){
				            console.log("You didn't save the file");
				            return;
				        }
						fs.readFile('db/'+arg.key+'.tt', function(err, data) {
						    console.log(data);
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

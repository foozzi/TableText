const electron = require('electron')
const ipcMain = electron.ipcMain
const AsciiTable = require('ascii-table')
const fs = require('fs')
const cheerio = require('cheerio')
const targz = require('tar.gz');
const mkdirp = require('mkdirp');
const h = require('./helpers');
const Helpers = new h();

function html2json(html) {
	return new Promise((resolve, reject) => {
		let $ = cheerio.load('html')
		$('thead.tr').forEach(function(){
			console.log(this)
			resolve(this)
		})

	})
}

function create_array(uniq) {
	return new Promise((resolve, reject) => {
		var read = targz().createReadStream('db/'+uniq);
		var write = fs.createWriteStream('db/'+uniq+'.tt');
		read.pipe(write);
		resolve(uniq)
	})
}

function create_space(uniq) {
	return new Promise((resolve, reject) => {
		console.log(uniq)
		mkdirp('db/'+uniq+'/', function (err) {
		    if (err) reject(err)
		    else resolve(true)
		});
	})
}

function open_tmp(uniq) {
	return new Promise((resolve, reject) => {
		fs.readFile('db/tmp/'+uniq+'/h-'+uniq, 'utf8', function (err,data) {
		  	if (err && err.errno === -2) {
		  		reject('No such file or directory')
		  	}
		  	resolve(data)
		});
	})
}

function save_json(uniq, json) {
	return new Promise((resolve, reject) => {
		fs.writeFile("db/"+uniq+"/j-"+uniq, JSON.stringify(json), function(err) {
		    if(err) {
		        reject(err)
		    }
		    resolve();
		}); 
	})
}
function save_text(uniq, text) {
	return new Promise((resolve, reject) => {
		fs.writeFile("db/"+uniq+"/t-"+uniq, text, function(err) {
		    if(err) {
		        reject(err)
		    }
		  	resolve()
		}); 
	})
}

function parse2clear(html) {
	return new Promise((resolve, reject) => {
		let $ = cheerio.load(html)
		var head = [];
		var rows = [];
		$('table thead tr th').each(function(i, e){
			$(this).text().trim().split('\n').forEach(function(u,o){
				if(u.trim() !== '') {
					head.push(u.trim())
				}
			})
		})
		var p = 0;

		$('table tbody tr').each(function(i, e) {
			rows[i] = []
			$('table tbody tr:nth-child('+(parseInt(i)+1)+') td input').each(function(o, e){
				// console.log($(e).val().trim())
				rows[i][o] = $(e).val().trim();
			})
			// rows.push($(this).text())
			// for(var i = 0; rows.length > i; i++) {
			// 	for(var o = 0; rows[i].length > o; o++) {
			// 		rows[i][o] = rows[i][o].trim()
			// 	}
			// }
		})
		resolve({title: 'test', heading: head, rows: rows});
	})
}

ipcMain.on('save_format', function(event, args) {
	this.key = args.key

	create_space(this.key)
		.then(result => {
			if(result) {
				open_tmp(this.key)
					.then(data => {
						return data
					})
					.then(data => {
						return parse2clear(data)
					})
					.then(json => {
						save_json(this.key, json)
							.catch(err => {
								console.log(err)
							})
						return json
					})
					.then(json => {
						var table = new AsciiTable().fromJSON(json)
						return table.render();
					})
					.then(text => {
						save_text(this.key, text)
							.catch(err => {
								console.log(err)
							})
						return;
					})
					.then(_ => {
						create_array(this.key)
							.catch(err => {
								console.log(err)
							})
					})
					.then(clear => {
						Helpers.deleteFile('db/tmp/'+this.key+'/', 'h-'+this.key)
							.then(res => {
								Helpers.deleteDirectory('db/tmp/'+this.key)
									.then()
									.catch(err => {
										console.log(err)
									})
							})
							.catch(err => {
								console.log(err)
							})
						event.sender.send('save_format', {
				            err: 0,
				            key: this.key,
				            result: true
				        });
					})
					.catch(err => {
						console.log(err)
					})
			}
		})
		.catch(err => {
			console.log(err)
		})
})


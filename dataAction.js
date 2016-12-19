const electron = require('electron')
const ipcMain = electron.ipcMain
const AsciiTable = require('ascii-table')
const fs = require('fs')
const cheerio = require('cheerio')
const targz = require('tar.gz');
const mkdirp = require('mkdirp');
const h = require('./helpers');
const Helpers = new h();
const homedir = require('homedir')
let home = homedir()
const config = require('./config.json')
const tidy = require('htmltidy').tidy;
/**
 * Create tag.gz archive in config dir
 * @param string uniq  
 */
function create_archive(uniq) {
	return new Promise((resolve, reject) => {
		var read = targz().createReadStream(home+config.data+uniq);
		var write = fs.createWriteStream(home+config.data+uniq+'.tt');
		read.pipe(write);
		resolve(uniq)
	})
}
/**
 * Create local config dir
 * @param string uniq  
 */
function create_space(uniq) {
	return new Promise((resolve, reject) => {
		mkdirp(home+config.data+uniq, function (err) {
		    if (err) reject(err)
		    else resolve(true)
		});
	})
}
/**
 * Open temp file with html table code
 * @param string uniq  
 */
function open_tmp(uniq) {
	return new Promise((resolve, reject) => {
		fs.readFile(home+config.tmp+uniq+config.tmp_separator+uniq, 'utf8', function (err,data) {
		  	if (err && err.errno === -2) {
		  		reject('No such file or directory')
		  	}
		  	resolve(data)
		});
	})
}
/**
 * Save local file in html format
 * @param string uniq  
 * @param string json
 */
function save_html(uniq, html) {
	return new Promise((resolve, reject) => {
		var path_html = home+config.data+uniq+config.html_separator+uniq;
		let $ = cheerio.load(html)
		$('table tbody tr').each(function(i, e) {
			$('table tbody tr:nth-child('+(parseInt(i)+1)+') td input').each(function(o, e){
				$('table tbody tr:nth-child('+(parseInt(i)+1)+') td:nth-child('+(parseInt(o)+1)+')').text($(e).val().trim())
				if($('table tbody tr:nth-child('+(parseInt(i)+1)+') td').text() === '+' || $('table tbody tr:nth-child('+(parseInt(i)+1)+') td').text() === '-') {
					$('table tbody tr:nth-child('+(parseInt(i)+1)+') td').remove()
				}
			})
		})

		$('table thead tr th:last-child').remove()
		// return false;
		tidy($('table').html(), function(err, html) {
			if(err) {
				reject(err)
			}
		    fs.writeFile(path_html, html, function(err) {
			    if(err) {
			        reject(err)
			    }
			    resolve(path_html);
			}); 
		});
	})
}
/**
 * Save local file in json format
 * @param string uniq  
 * @param string json
 */
function save_json(uniq, json) {
	return new Promise((resolve, reject) => {
		var path_json = home+config.data+uniq+config.json_separator+uniq;
		fs.writeFile(path_json, JSON.stringify(json), function(err) {
		    if(err) {
		        reject(err)
		    }
		    resolve(path_json);
		}); 
	})
}
/**
 * Save local file in text format
 * @param string uniq 
 * @param strin text 
 */
function save_text(uniq, text) {
	return new Promise((resolve, reject) => {
		var path_txt = home+config.data+uniq+config.txt_separator+uniq;
		fs.writeFile(path_txt, text, function(err) {
		    if(err) {
		        reject(err)
		    }
		  	resolve(path_txt)
		}); 
	})
}
/**
 * Parse html table to clear json
 * @param string html  
 */
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
/**
 * Save as .txt
 */
ipcMain.on('save_text', function(event, args) {
	this.key = args.key
	this.type = args.type

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
							.then(path => {
								event.sender.send('save_text', {
						            err: 0,
						            key: this.key,
						            path: path
						        });
							})
							.catch(err => {
								console.log(err)
							})
						// return;
					})
				.catch(err => {
					console.log(err)
				})
			}
	})
})
/**
 * Save as .json
 */
ipcMain.on('save_json', function(event, args) {
	this.key = args.key
	this.type = args.type

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
							.then(path => {
								event.sender.send('save_json', {
						            err: 0,
						            key: this.key,
						            result: true,
						            path: path
						        });
							})
							.catch(err => {
								console.log(err)
							})
						return json
					})
				.catch(err => {
					console.log(err)
				})
			}
	})
})
/**
 * Save as .html
 */
ipcMain.on('save_html', function(event, args) {
	this.key = args.key
	this.type = args.type

	create_space(this.key)
		.then(result => {
			if(result) {
				open_tmp(this.key)
					.then(data => {
						return data
					})			
					.then(html => {
						save_html(this.key, html)
							.then(path => {
								event.sender.send('save_html', {
						            err: 0,
						            key: this.key,
						            result: true,
						            path: path
						        });
							})
							.catch(err => {
								console.log(err)
							})
						return html
					})
				.catch(err => {
					console.log(err)
				})
			}
	})
})
/**
 * Save complete tar.gz archive with data
 */
ipcMain.on('save', function(event, args) {
	this.key = args.key
	this.type = args.type

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
							.then(path => {
								event.sender.send('save', {
						            err: 0,
						            key: this.key,
						            result: true,
						            path: path+this.type
						        });
							})
							.catch(err => {
								console.log(err)
							})
						// return;
					})
					.then(_ => {
						create_archive(this.key)
							.then(archive_path => {
								event.sender.send('save', {
						            err: 0,
						            key: this.key,
						            result: true,
						            path: archive_path
						        });
							})
							.catch(err => {
								console.log(err)
							})
					})
					.then(clear => {
						Helpers.deleteFile(home+config.tmp+this.key, config.tmp_separator+this.key)
							.then(res => {
								Helpers.deleteDirectory(home+config.tmp+this.key)
									.then()
									.catch(err => {
										console.log(err)
									})
							})
							.catch(err => {
								console.log(err)
							})	
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


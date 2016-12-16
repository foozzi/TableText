var AsciiTable = require('ascii-table')
var table = new AsciiTable('A Title')
var uuid = require('node-uuid');
var fs = require('fs');
var targz = require('tar.gz');
var mkdirp = require('mkdirp');
var html2json = require('html-table-to-json');

// @TODO допилить парсинг json в подобный формат для конвертирования в таблицу
// {
//   title: 'Title'
// , heading: [ 'id', 'name' ]
// , rows: [ 
//     [ 1, 'Bob' ]
//   , [ 2, 'Steve' ] 
//   ] 
// }
var table = new AsciiTable().fromJSON(html2jsonf())
console.log(table)
return false;

var uniq = uuid.v4();

table
  .setHeading('#', 'Name', 'Age', 'hash')
  .addRow(1, 'Bob', 52)
  .addRow(2, 'John', 34)
  .addRow(3, 'Jim', 83)
  .addRow(null, null, null, uniq)

create_space(uniq)
    .then(uniq => {
        return uniq
    })
    .then(save_json(uniq))
    .then(uniq => {
    	return uniq
    })
    .then(save_text(uniq))
    .then(uniq => {
    	return uniq
    })
    .then(create_array(uniq))
    .then(uniq => {
    	console.log(uniq)
    })

function create_space(uniq) {
	return new Promise((resolve, reject) => {
		mkdirp('db/'+uniq+'/', function (err) {
		    if (err) reject(err)
		    else resolve(uniq)
		});
	})
}
function save_json(uniq) {
	return new Promise((resolve, reject) => {
		fs.writeFile("./db/"+uniq+"/j-"+uniq, JSON.stringify(table), function(err) {
		    if(err) {
		        reject(err)
		    }
		    resolve();
		}); 
	})
}
function save_text(uniq) {
	return new Promise((resolve, reject) => {
		fs.writeFile("./db/"+uniq+"/t-"+uniq, table.toString(), function(err) {
		    if(err) {
		        reject(err)
		    }
		  	resolve()
		}); 
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


console.log(table.toString())
console.log(JSON.stringify(table))

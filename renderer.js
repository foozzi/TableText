// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

(function(){
	


	const fs = require('fs');
	
	const uuid = require('node-uuid');
	ipcRenderer = require('electron').ipcRenderer	

	
	// const Handlebars = require('handlebars');

	var create_obj_table = function(dom) {
		return new Promise((resolve, reject) => {
			var table = [];
			$(dom).each(function(){
				table.push($(this).text())
			})
			console.log(table)
			resolve(table)
		})
	}

	var create_table = function(table) {
		return new Promise((resolve, reject) => {
			
			$('.create-head').hide();
			$('#main-table').html('').show();
			
			$("#main-table").editTable({
				data: [
					[],
				],
				headerCols: table,
				//maxRows: 3
			});
			resolve(true)
		})
	}

	$.fn.andSelf = function() {
	  return this.addBack.apply(this, arguments);
	}

	document.onreadystatechange = () => {
        if (document.readyState == "complete") {
        	
        	require('./menu');

			$('#new').on('click', function(){
				$('#main-table').hide();
				$('#clean').hide();
				$('.create-head').show();
			})

			$('#add-to-table').on('click', function(){
				var row = $('input[name="name-row-add"]').val().trim();
				$('input[name="name-row-add"]').val('');

				if(row === '') {
					alert('\nRow name is empty')
					return false;
				}
				if(row.length > 20) {
					alert('Rows name over 20 symbols')
					return false;
				}

				if($('.list-rows span').length < 1) {
					$('.list-rows').html('');
				}

				var uniq_row = uuid.v4();
				$('.list-rows').append('<span id="'+uniq_row+'">'+row+'</span> - <a href="#!" id="'+uniq_row+'">delete</a><br />')
			})

			$('#create-table').on('click', function(){
				if($('.list-rows span').length < 2) {
					alert('More 2 rows')
					return false;
				}

				create_obj_table($('.list-rows span'))
					.then(table => {
						create_table(table)
							.then(result => {
								$('.nav-btn').each(function(){
									$(this).removeClass('active')
								})
								$('#tohome').addClass('active')
								$('.list-rows').html('Empty')
								$('#clean').show();
							})
							.catch(err => {
								console.log(err)
							})
					})
					.catch(err => {
						console.log(err)
					})
			})

			$('#clean').on('click', function(){
				$('#main-table').html('').hide();
				return false;
			})

			$('#tohome').on('click', function(){
				if(($('.inputtable').length > 0)) {
					$('#clean').show();
				}
				$('input[name="name-row-add"]').val('');
				$('.list-rows').html('Empty')
				$('.create-head').hide()
				$('#main-table').show();
			})

			$('.nav-btn').on('click', function(){
				$('.nav-btn').each(function(){
					$(this).removeClass('active')
				})
				$(this).addClass('active')
			})
        }
    }
}())
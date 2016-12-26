var express = require('../../node_modules/express');
var fs = require('fs');

function addRoutes(app) {
	// home page
	app.get('/', function (req, res) {
		res.render('apis/index', {
			title: "index"
		});
	});
	
	// all.json page
	app.get('/all.json', function (req, res) {
		fs.access('./views/apis/all.json', fs.constants.R_OK, (err) => {
			if(err) {
				console.log('accessing file ./views/apis/all.json, permission denied.');
				next();
			} else {
				fs.readFile('./views/apis/all.json', (err, data) => {
					if(err) {
						console.log('read error');
						next();
					} else {
						res.status(200);
						res.type('text/palin');
						res.send(data);
					}
				});
			}
		});
	})
	
	// all
	app.all('/*', function (req, res, next) {
		var path = req.path;
		var file = path.replace('/', '');
		var pathToFile = './views/apis/' + file;
		fs.access(pathToFile + '.pug', fs.constants.R_OK, (err) => {
			if(err) {
				console.log("file " + file + ".pug is not exists.");
				next();
			} else {
				res.render('apis/' + file, {
					title: file
				});
			}
		});
	});
	
	// Page 404
	app.use(function (req, res) {
		res.status(404);
		res.render('errors/404', {
			title: "Not Found"
		});
	});
	
	// Page 500
	app.use(function (err, req, res, next) {
		if(err) {
			console.log(err);
		}
		res.status(500);
		res.render('errors/500', {
			title: "Internal Server Error"
		});
	});
}

exports = module.exports = {
	init: function (app) {
		// set seiries
		app.set('views', './views');
		app.set('view engine', 'pug');
		app.set('PORT', process.env.PORT || 80);
		
		// static resources
		app.use(express.static('./static'));
		
		// disabled
		app.disable('x-powered-by');
	},
	addRoutes: addRoutes
}
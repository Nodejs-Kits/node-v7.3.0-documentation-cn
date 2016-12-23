var express = require('express');
var fs = require('fs');

var app = express();

app.set('views', './views');
app.set('view engine', 'pug');
app.set('PORT', process.env.PORT || 3000);

app.use(express.static(__dirname + '/static'));

// home page
app.get('/', function (req, res) {
	res.render('apis/index', {
		title: "index"
	});
});

// all.json page
app.get('/all.json', function (req, res) {
	res.status(200);
	res.type('text/palin');
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
	res.status(500);
	res.render('errors/505', {
		title: "Internal Server Error"
	});
});

// listen port
app.listen(app.get("PORT"), function () {
	console.log('Server is running on localhost:' + app.get("PORT"));
})
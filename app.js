var express = require('express');
var App = require('./libs/app');

var app = express();

// init app settings
App.init(app);

// add routes to app
App.addRoutes(app);

// listen port
app.listen(app.get("PORT"), function () {
	console.log('Server is running on localhost:' + app.get("PORT"));
})
/**
 * @file The main HTTP handler
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

var http = function() {

var express = require('express');
var config = require('../config.json');
var ejs = require('ejs');
var apiRouter = require('./apiRouter.js');
var frontend = require('./frontend.js');
var util = require('../util.js');
var passport = require('passport');
var sessions = require('../sessions.js');

var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');

app.use(require('body-parser').urlencoded({
    extended: true
}));

app.use(passport.initialize());
app.use(function(req, res, next){ sessions.express(req, res, next) });

app.use('/api', apiRouter);

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

frontend(http, app);

http.listen(config.http.port);
util.log('Http server started at port '+config.http.port, true);

};

module.exports = http;

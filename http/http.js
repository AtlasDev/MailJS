/**
 * @file The main HTTP handler
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

var http = function() {

var express = require('express');
var config = require('../config.json');
var ejs = require('ejs');
var session = require('express-session');
var apiRouter = require('./apiRouter.js');
var frontend = require('./frontend.js');
var util = require('../util.js');
var event = require('../event.js');

var app = express();
var http = require('http').Server(app);

app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');

app.use(require('body-parser').urlencoded({
    extended: true
}));

app.use(session({
    secret: require('crypto').randomBytes(32).toString('hex'),
    saveUninitialized: true,
    resave: true
}));

app.use(require('passport').initialize());

app.use('/api', apiRouter);

frontend(http, app);

http.listen(config.http.port);
util.log('Http server started at port '+config.http.port, true);
event.emit('http.started');

};

module.exports = http;

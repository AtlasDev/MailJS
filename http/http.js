(function () {
'use strict';

/**
 * @file The main HTTP handler
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

var http = function() {

var express = require('express');
var passport = require('passport');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('../config.json');
var v1apiRouter = require('./v1/apiRouter.js');
var socketio = require('./socketio.js');
var sys = require('../sys/main.js');
var redisSessions = require("connect-redis-sessions");

var app = express();
var http = require('http').Server(app);

if(config.servePublic !== false) {
    app.use(express.static(__dirname + '/public'));
}

app.use(express.query());
app.use(cookieParser());
app.use(redisSessions({
    app: "MailJS",
    namespace: 'sess',
    host: config.redis.host,
    port: config.redis.port,
    cookie: {
        httpOnly: false
    }
}));

app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(passport.initialize());

app.use(function(err, req, res, next) {
    if(err.name == 'SyntaxError') {
        return res.status(400).json({error: {
            name: 'EINVALID',
            message: 'JSON invalid.'
        }});
    }
    sys.util.error('Express errored:', err);
    res.status(500).send('Internal Server Error');
});

socketio(http, app);

app.use('/api/*', function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

app.use('/api/v1', v1apiRouter);

http.listen(config.http.port);
sys.util.log('HTTP server started at port '+config.http.port, true);

};

module.exports = http;
}());

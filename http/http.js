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
var crypto = require('crypto');
var redis = require('../redis.js');
var RedisStore = require('connect-redis')(session);

var app = express();
var http = require('http').Server(app);

redis.get('settings:sessionKey', function (err, reply) {
    if(reply == null) {
        util.error('Session key missing!', null, true);
    }
    var secret = reply;
    app.set('view engine', 'ejs');
    app.set('views',__dirname + '/views');

    app.use(require('body-parser').urlencoded({
        extended: true
    }));

    app.use(session({
        store: new RedisStore({client: redis, ttl: 86400}),
        secret: secret,
        saveUninitialized: true,
        resave: true
    }));

    app.use(require('passport').initialize());

    app.use('/api', apiRouter);

    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    });

    frontend(http, app);

    http.listen(config.http.port);
    util.log('Http server started at port '+config.http.port, true);
    event.pub('http:started');
});

};

module.exports = http;

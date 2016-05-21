module.exports = function () {

return new Promise(function(resolve, reject) {
'use strict';

var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('config');
var logger = require('../log.js');
var v2apiRouter = require('./v2/apiRouter.js');
var redis = require('../redis.js');
var redisSessions = require("connect-redis-sessions");
var compression = require('compression');
var Limiter = require('express-rate-limiter-redis/limiter');
var RedisStore = require('express-rate-limiter-redis');
var domain = require('../domain.js');
//var ws = require('./ws.js');

var httpApp = express();
var httpsApp = express();
var http = require('http').createServer(httpApp);
var https = require('https').createServer({
    SNICallback: domain.SNI,
    ciphers: [
        "ECDHE-RSA-AES256-SHA384",
        "DHE-RSA-AES256-SHA384",
        "ECDHE-RSA-AES256-SHA256",
        "DHE-RSA-AES256-SHA256",
        "ECDHE-RSA-AES128-SHA256",
        "DHE-RSA-AES128-SHA256",
        "HIGH",
        "!aNULL",
        "!eNULL",
        "!EXPORT",
        "!DES",
        "!RC4",
        "!MD5",
        "!PSK",
        "!SRP",
        "!CAMELLIA"
    ].join(':'),
    honorCipherOrder: true
}, httpsApp);

httpsApp.use(function(req, res, next) {
    if(config.has('generateCerts') && config.get('generateCerts') === false) {
        logger.warn('HSTS disabled to allow connections, please re-enable certificate generation to turn on HSTS.');
    } else {
        res.set('Strict-Transport-Security', 'max-age=31536000');
    }
    res.set('X-Powered-By', 'MailJS');
    res.set('X-Frame-Options', 'DENY');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-XSS-Protection', '1; mode=block');
	res.set('Public-Key-Pins', 'pin-sha256="Vjs8r4z+80wjNcr1YKepWQboSIRi63WsWXhIMN+eWys="; pin-sha256="YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg="; max-age=5184000000');
    res.set('Content-Security-Policy', 'style-src \'unsafe-inline\' \'self\'; img-src https: data: \'self\'; connect-src wss://'+req.headers.host+' \'self\'; default-src \'self\'');
    next();
});

httpApp.use('/.well-known/acme-challenge', domain.checkLE);

httpApp.use(function (req, res, next) {
    return res.redirect('https://'+req.headers.host+req.url);
});

if(config.has('servePublic') && config.get('servePublic') === true) {
	logger.debug('Serving static files');
    httpsApp.use(express.static(__dirname + '/public'));
}

httpsApp.use(express.query());
httpsApp.use(cookieParser());
httpsApp.use(compression());

if(!config.has('db.redis.host') || !config.has('db.redis.port')) {
   	logger.error('Missing Redis config variables');
	return reject();
}

httpsApp.use(redisSessions({
    app: "MailJS",
    namespace: 'sess',
    host: config.get('db.redis.host'),
    port: config.get('db.redis.port'),
	wipe: 6000,
	ttl: 172800,
    cookie: {
        httpOnly: true
    }
}));

httpsApp.set('view engine', require('ejs'));
httpsApp.set('views',__dirname + '/views');

httpsApp.use(bodyParser.json());
httpsApp.use(bodyParser.urlencoded({
    extended: true
}));

if(config.has('trustProxy') && config.get('trustProxy') === true) {
    httpsApp.enable('trust proxy');
    logger.debug('App running in trusted proxy mode, only enable this if nessarry.');
}

httpsApp.use(passport.initialize());

httpsApp.use(function(err, req, res, next) {
    if(err.name == 'SyntaxError') {
        return res.status(400).json({error: {
            name: 'EINVALID',
            message: 'JSON invalid.'
        }});
    }
    logger.error('Express errored.', err);
    res.status(500).send('Internal Server Error');
});

//TODO
//ws.start(https);

var store = new RedisStore({
    client: redis
});

if(!config.has('rateLimit.innerTimeLimit') || !config.has('rateLimit.innerLimit') || !config.has('rateLimit.outerTimeLimit') || !config.has('rateLimit.outerLimit')) {
   	logger.error('Missing rate limiter config variables');
	return reject();
}

var limiter = new Limiter({
    db: store,
    innerTimeLimit: config.get('rateLimit.innerTimeLimit'),
    innerLimit: config.get('rateLimit.innerLimit'),
    outerTimeLimit: config.get('rateLimit.outerTimeLimit'),
    outerLimit: config.get('rateLimit.outerLimit')
});

httpsApp.use('/api/*', limiter.middleware(), function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

httpsApp.use('/api/v2', v2apiRouter);

if(!config.has('http.port') || !config.has('https.port')) {
	logger.error('Missing HTTP config variables');
	return reject();
}

var otherListening = false;
http.listen(config.get('http.port'), config.get('http.host'), function () {
	logger.info('HTTP server started at port '+config.get('http.port'));
	if(otherListening) {
		resolve();
	} else {
		otherListening = true;
	}
});

https.listen(config.get('https.port'), config.get('https.host'), function () {
	logger.info('HTTPS server started at port '+config.get('https.port'));
	if(otherListening) {
		resolve();
	} else {
		otherListening = true;
	}
});

});
}();

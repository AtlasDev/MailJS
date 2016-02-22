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
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('../config.json');
var v1apiRouter = require('./v1/apiRouter.js');
var sys = require('../sys/main.js');
var redisSessions = require("connect-redis-sessions");
var tls = require('tls');
var Limiter = require('express-rate-limiter-redis/limiter');
var RedisStore = require('express-rate-limiter-redis');

require('ejs');

var httpApp = express();
var httpsApp = express();
var http = require('http').createServer(httpApp);
var https = require('https').createServer({
    SNICallback: function (domain, cb) {
        sys.domain.getCert(domain, function (err, cert) {
            if(err) {
                return cb(err);
            }
            var context = tls.createSecureContext({
                key: cert.key,
                cert: cert.cert + '\n' + cert.caCert,
                honorCipherOrder: true
            });
            return cb(null, context);
        });
    },
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

var store = new RedisStore({
    client: sys.redis
});

var limiter = new Limiter({
    db: store,
    innerTimeLimit: config.rateLimit.innerTimeLimit,
    innerLimit: config.rateLimit.innerLimit,
    outerTimeLimit: config.rateLimit.outerTimeLimit,
    outerLimit: config.rateLimit.outerLimit
});

httpsApp.use(limiter.middleware(), function(req, res, next) {
    if(config.generateCerts === false) {
        sys.util.log('HSTS disabled to allow connections, please re-enable certificate generation to turn on HSTS.', false, true);
    } else {
        res.set('Strict-Transport-Security', 'max-age=31536000');
    }
    res.set('X-Powered-By', 'MailJS');
    res.set('X-Frame-Options', 'DENY');
    res.set('Content-Security-Policy', 'style-src \'unsafe-inline\' \'self\'; img-src https: data: \'self\'; connect-src wss://'+req.headers.host+' \'self\'; default-src \'self\'');
    next();
});

httpApp.use('/', express.static(__dirname + '/LE'));

httpApp.use('*', function (req, res, next) {
    return res.redirect('https://'+req.headers.host+req.url);
});

if(config.servePublic !== false) {
    httpsApp.use(express.static(__dirname + '/public'));
}

httpsApp.use(express.query());
httpsApp.use(cookieParser());
httpsApp.use(redisSessions({
    app: "MailJS",
    namespace: 'sess',
    host: config.redis.host,
    port: config.redis.port,
    cookie: {
        httpOnly: false
    }
}));

httpsApp.set('view engine', 'ejs');
httpsApp.set('views',__dirname + '/views');

httpsApp.use(bodyParser.json());
httpsApp.use(bodyParser.urlencoded({
    extended: true
}));

if(config.trustProxy === true) {
    httpsApp.enable('trust proxy');
    sys.util.log('App running in trusted proxy mode, only enable this if nessarry.', false, true);
}

httpsApp.use(passport.initialize());

httpsApp.use(function(err, req, res, next) {
    if(err.name == 'SyntaxError') {
        return res.status(400).json({error: {
            name: 'EINVALID',
            message: 'JSON invalid.'
        }});
    }
    sys.util.error('Express errored:', err);
    res.status(500).send('Internal Server Error');
});

sys.ws.start(https);

httpsApp.use('/api/*', function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

httpsApp.use('/api/v1', v1apiRouter);

if(config.variables) {
    httpsApp.get('/:endpoint', function (req, res, next) {
        if(config.variables[req.params.endpoint]) {
            res.send(config.variables[req.params.endpoint]);
        } else {
            next();
        }
    });
}

http.listen(config.http.port, config.http.host);
https.listen(config.https.port, config.https.host);
sys.util.log('HTTP server started at port '+config.http.port, true);
sys.util.log('HTTPS server started at port '+config.https.port, true);

};

module.exports = http;
}());

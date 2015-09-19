var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var SessionStrategy = require('passport-sessiontoken').Strategy;
var sessions = require('../../../sessions.js');
var sys = require('../../../sys/main.js');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    return done(null, user);
});

passport.use('user', new LocalStrategy(
    function(username, password, callback) {
        sys.user.verify(username, password, function (err, isMatch, user) {
            if(err) {
                return callback(err);
            }
            if(!isMatch) {
                return callback(null, false);
            }
            return callback(null, user, { session: false, type: 'user' });
        });
    }
));

passport.use('session', new SessionStrategy(
    function(token, done) {
        sessions.getSession(token, function (err, session) {
            if(err) { return done(err) };
            if(!session.id) {
                return done(null, false);
            }
            sys.user.findByUsername(session.id, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user, { session: false, type: 'session' });
            })
        });
    }
));

passport.use('client', new BasicStrategy(
    function(username, password, callback) {
        sys.client.verify(username, password, function (err, match, client) {
            if(err) {
                return callback(err);
            }
            if(!client) {
                return callback(null, false);
            }
            if(!match) {
                return callback(null, false);
            }
            return callback(null, client, { session: false, type: 'client' });
        })
    }
));

passport.use(new BearerStrategy(
    function(accessToken, callback) {
        sys.token.verify(accessToken, function (err, isMatch, user) {
            if(err) {
                return callback(err);
            }
            if(!isMatch) {
                return callback(null, false);
            }
            return callback(null, user, { session: false, type: 'token', scope: ['bla', 'morebla'] });
        });
    }
));

exports.checkTFA = function (req, res, next) {
    if(req.user.tfa == true && req.authinfo.type == 'session') {
        if(req.session.finishTFA != true) {
            return req.status(401).end('Unauthorized');
        }
        return next();
    }
    return next();
}

exports.isAuthenticated = passport.authenticate(['session', 'bearer']);
exports.isSessionAuthenticated = passport.authenticate('session');
exports.isUserAuthenticated = passport.authenticate('user');
exports.isClientAuthenticated = passport.authenticate('client');

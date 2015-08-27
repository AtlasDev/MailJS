var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var LocalAPIKeyStrategy = require('passport-localapikey').Strategy;
var User = require('../../../models/user');
var Token = require('../../../models/token');
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

passport.use('session', new LocalAPIKeyStrategy(
    function(token, done) {
        sessions.getSession(token, function (err, session) {
            if(err) { return done(err) };
            User.find({username: session.id}, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user, { session: true, type: 'session' });
            })
        });
    }, {apiKeyField: 'session', apiKeyHeader: 'session'}
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

exports.isAuthenticated = passport.authenticate(['session', 'bearer']);
exports.isUserAuthenticated = passport.authenticate('user');
exports.isClientAuthenticated = passport.authenticate('client');
exports.isBearerAuthenticated = passport.authenticate('bearer');

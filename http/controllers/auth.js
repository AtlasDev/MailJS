var passport = require('passport');
var sessions = require("../../redis-session.js");
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var TokenStrategy = require('passport-token').Strategy;
var User = require('../../models/user');
var Client = require('../../models/client');
var Token = require('../../models/token');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('user-token', new TokenStrategy(
    { usernameHeader: 'x-userid', usernameField:  'userid' },
    function (userid, token, done) {
        sessions.get(
            { app: 'mailjs', token: token },
            function(err, resp) {
                if (err) {
                    return done(null, false);
                }
                if(userid == resp.id) {
                    User.findById(userid, function (err, user) {
                        if(err) {
                            return done(null, false);
                        }
                        return done(null, user);
                    })
                } else {
                    return done(null, false);
                }
            }
        );
    }
));

passport.use('client-basic', new BasicStrategy(
    function(username, password, callback) {
        Client.findOne({ id: username }, function (err, client) {
            if (err) { return callback(err); }
            if(!client) { return callback(null, false); }
            client.verifySecret(password, function (err, isMatch) {
                if (err) { return callback(err); }
                if (!isMatch) { return callback(null, false); }
                return callback(null, client);
            });
        });
    }
));

passport.use(new BearerStrategy(
    function(accessToken, callback) {
        Token.findOne({value: accessToken }, function (err, token) {
            if (err) { return callback(err); }
            if (!token) { return callback(null, false); }
            User.findOne({ _id: token.userId }, function (err, user) {
                if (err) { return callback(err); }
                if (!user) { return callback(null, false); }
                callback(null, user, { scope: '*' });
            });
        });
    }
));

exports.isAuthenticated = passport.authenticate(['user-token', 'bearer'], { session : false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session : false });

'use strict';

var domain = 'localhost';
var secret = 'secret'

var express = require('express');
var app = new express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookieParser = require('socket.io-cookie');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

server.listen(3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.all('/api/v1/login', function (req, res) {
    var token = jwt.sign({ username: req.body.username }, secret, {expiresInMinutes: 1});
    res.cookie('jwt', token);
    res.send('{"error": ""}');
    //res.status(400).send('{"error": "Username/password incorrect"}');
});

io.use(cookieParser);

io.set('authorization', function (data, accept) {
    if(data.headers.cookie.jwt) {
        var token = data.headers.cookie.jwt;
        jwt.verify(token, secret, function(err, decoded) {
            if(err) {
                if(err.name == 'TokenExpiredError') {
                    return accept('Token has expired!', false);
                }
                return accept('Invalid token!', false);
            }
            return accept(null, true);
        });
    } else {
       return accept('No token send.', false);
    }
});

io.on('connection', function (socket) {
    console.log("new user connected!");
});
'use strict';

var secret = 'secret';

var express = require('express');
var app = new express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var socketioJwt = require('socketio-jwt');
var jwt = require('jsonwebtoken');

server.listen(3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.all('/api/v1/login', function (req, res) {
    var token = jwt.sign({ username: req.body.username }, secret, {expiresInMinutes: 1440});
    res.json({"error": "", "jwt": token});
    //res.status(400).json({"error": "Username/password incorrect", "jwt": ""});
});

io.use(socketioJwt.authorize({
	secret: secret,
	handshake: true
}));

io.on('authenticated', function(socket) {
    console.log('hello! ' + socket.decoded_token.username);
});
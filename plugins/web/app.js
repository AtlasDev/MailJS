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

io.on('connection', function(socket) {
	console.log(socket.decoded_token.username);

    socket.on('mail:star', function(data) {
        io.sockets.emit('mail:star', {uuid: data.uuid, state: data.state});
    });
    socket.on('mail:delete', function(data) {
        io.sockets.emit('mail:delete', {uuid: data.uuid});
    });
    socket.on('mail:read', function(data) {
        io.sockets.emit('mail:read', {uuid: data.uuid, state: data.state});
    });
    socket.on('mail:get', function(data) {
		if(data.uuid == '5') {
			var response = {
				subject: "Test email is testing",
				sender: 'danysluyk@live.nl',
				date: 1433168277937,
				content: 'short test mail',
				attachment: {}
			}
			socket.emit('mail:get', {data: response, err: null});
		} else {
			socket.emit('mail:get', {data: null, err: 'Mail `'+data.uuid+'` not found'});
		}
    });
});
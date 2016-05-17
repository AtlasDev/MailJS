(function () {
'use strict';

const winston = require('winston');
var config = require('config');
var cluster = require('cluster');
var suffix = cluster.isMaster ? '' : '.worker'+cluster.worker.id;

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({
			name: 'errorLog',
			filename: '../log/error'+suffix+'.log',
			level: 'error'
		})
	]
});

if(config.get('debug') == true) {
	logger.add(winston.transports.File, {
		name: 'infoLog',
		filename: '../log/info'+suffix+'.log',
		level: 'info'
	});
}

module.exports = logger;
}());

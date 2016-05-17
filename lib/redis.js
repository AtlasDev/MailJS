(function () {
'use strict';

var redis = require('redis');
var config = require('config');
var logger = require('./log.js');

if(!config.has('db.redis.host') || !config.has('db.redis.port')) {
   	logger.error('Missing Redis config variables');
   	process.exit(1);
}

var client = redis.createClient(config.get('db.redis.port'), config.get('db.redis.host'));

client.on("error", function (err) {
    logger.error("Redis errored", err);
});

client.on("ready", function () {
    logger.info("Connected to the redis server on port "+config.redis.port);
});

module.exports = client;
}());

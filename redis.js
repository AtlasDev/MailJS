/**
 * @file Centerialized redis client.
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

var redis = require('redis');
var util  = require('./util.js');
var config = require('./config.json');

var client = redis.createClient(config.redis.port, config.redis.host);

client.on("error", function (err) {
    util.error("Redis errored", err, true);
});

client.on("ready", function () {
    util.log("Connected to the redis server", true);
});

module.exports = client;

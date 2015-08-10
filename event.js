/**
 * @file Centerialized event emitter.
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

var RedisEvent = require('redis-event');
var config = require('./config.json');
var util = require('./util.js');

var ev = new RedisEvent(config.redis.host, ['app', 'http', 'smtp']);

ev.on('ready', function() {
    util.log('Redis events ready.', true);
});

module.exports = ev;

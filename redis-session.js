/**
 * @file Centerialized redis session.
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

var redis = require('./redis.js');
var RedisSessions = require("redis-sessions");

var session = new RedisSessions({client: redis, namespace: 'session'});

module.exports = session;

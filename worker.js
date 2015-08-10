/**
 * @file The main worker file
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

var config   = require('./config.json');
var mongoose = require('mongoose');
var util     = require('./util.js');
var cluster  = require('cluster');

var worker = function () {

util.log('Booting worker #'+cluster.worker.id, true);

mongoose.connect('mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.database);
mongoose.connection.on('error', function(err) {
    util.error('Database errored:', err, true);
});
mongoose.connection.on('connected', function () {
    util.log('Connected to database', true);
});
mongoose.connection.on('reconnected', function () {
    util.log('Reconnected to database after connection has been lost', true);
});
mongoose.connection.on('disconnected', function () {
    util.error('Disconnected from the database!');
});

var redis = require('./redis.js');

redis.get('setup', function (err, reply) {
    if(reply != 'true') {
        util.error('Redis not set up, run `npm install` again!', null, true)
    }
});

require('./http/http.js')();
require('./smtp/smtp.js')();

process.on('uncaughtException', function(err) {
    util.error("An uncaught exception has taken place!", err, true);
});

}

module.exports = worker;

(function () {
'use strict';

/**
 * @file The main worker file
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

var config   = require('../config.json');
var mongoose = require('mongoose');
var util     = require('./util.js');
var cluster  = require('cluster');
var raven    = require('raven');

var worker = function () {

var DBinit = false;

util.log('Booting worker #'+cluster.worker.id, true);
process.title = config.process_name+' worker #'+cluster.worker.id;

if(config.reportErrors === true) {
    var ravenClient = new raven.Client(config.ravenURL);
    ravenClient.patchGlobal();
    util.log('Raven error logger enabled.', true);
}

mongoose.connect('mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.database, { user: config.db.username, pass: config.db.password });
mongoose.connection.on('error', function(err) {
    if(DBinit !== false) {
        util.error('Database errored:', err, true);
    } else {
        util.error('Could not connect to the database! Is it reachable?', null, true);
    }
});
mongoose.connection.on('connected', function () {
    DBinit = true;
    util.log('Connected to MongoDB on port '+config.db.port, true);
});
mongoose.connection.on('reconnected', function () {
    util.log('Reconnected to database after connection has been lost', true);
});
mongoose.connection.on('disconnected', function () {
    if(DBinit !== false) {
        util.error('Disconnected from the database!');
    }
});

require('../http/http.js')();
require('../smtp/smtp.js');

process.on('uncaughtException', function(err) {
    util.error("An uncaught exception has taken place!", err, true);
});

};

module.exports = worker;
}());

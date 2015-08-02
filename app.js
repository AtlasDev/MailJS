/**
 * @file The main class for MailJS
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

'use strict'

var colors   = require('colors');
var pack     = require('./package.json');
var config   = require('./config.json');
var mongoose = require('mongoose');
var util     = require('./util.js');
var events   = require('events');
var event    = new events.EventEmitter();

process.title = config.process_name;

console.log('\n')
console.log(' __  __       _ _    '+'    _  _____  '.cyan);
console.log('|  \\\/  |     (_) | '+'     | |/ ____| '.cyan);
console.log('| \\\  / | __ _ _| | '+'     | | (___   '.cyan);
console.log('| |\\\/| |/ _` | | | '+' _   | |\\\___ \\\  '.cyan);
console.log('| |  | | (_| | | | '  +'|  __| |____) | '.cyan);
console.log('|_|  |_|\\\__,_|_|_| '+' \\\____/|_____/  '.cyan);
console.log('\n');

util.log('Starting MailJS', true);
util.log('System: ' + process.platform + ' @ ' + process.arch, true);
util.log('MailJS v' + pack.version, true);
util.log('NodeJS ' + process.version, true);
util.log('V8 engine v' + process.versions.v8, true);
console.log('');

util.log('========== Booting MailJS services ==========', true);

util.log('Connecting to database...', true);
mongoose.connect('mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.database);
mongoose.connection.on('error', function(err) {
    util.error('Database errored:', err, true);
});

util.log('Starting http server...', true);
require('./http/http.js')(event);

util.log('Starting smtp server...', true);
require('./smtp/smtp.js')(event);

util.log('========== Done booting services   ==========', true);
console.log('');

process.on('uncaughtException', function(err) {
    util.error("An uncaught exception has taken place!", err, true);
});

/**
 * @file The main class for MailJS
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

'use strict'
var cluster  = require('cluster');

if(cluster.isMaster){

var pack      = require('./package.json');
var config    = require('./config.json');
var util      = require('./util.js');
var event     = require('./event.js');
var os        = require('os');
var exitcount = 0;

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

if(config.configured != 'true') {
    util.error('MailJS not configured! Please edit config.json!', null, true)
}

util.log('Booting workers', true);
for(var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
}
event.pub('app:started');

cluster.on('exit', function(worker, code, signal) {
    if(exitcount == config.maxExits) {
        util.error('Worker '+worker.process.pid+' died ('+code||signal+')!');
        util.error('Maximum amount of crashes reached, exiting!', null, true);
    } else {
        util.log('Worker '+worker.process.pid+' died ('+code||signal+'), restarting...');
        cluster.fork();
    }
    exitcount++;
});

process.on('uncaughtException', function(err) {
    util.error("An uncaught exception has taken place!", err, true);
});

} else {
    require('./worker.js')();
}

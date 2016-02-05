/**
 * @file The main class for MailJS
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

/* Copyright (C) AtlasDev - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Dany Sluijk <dany@atlasdev.nl>, January 2015
 */

'use strict'
var cluster  = require('cluster');
var sys      = require('../sys/main.js');

if(cluster.isMaster){

var pack      = require('../package.json');
var config    = require('../config.json');
var os        = require('os');
var raven     = require('raven');
var fs        = require('fs');
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

sys.util.log('Starting MailJS', true);
sys.util.log('System: ' + process.platform + ' @ ' + process.arch, true);
sys.util.log('MailJS v' + pack.version, true);
sys.util.log('NodeJS ' + process.version, true);
sys.util.log('V8 engine v' + process.versions.v8, true);
console.log('');

if(config.configured !== true) {
    sys.util.error('MailJS not configured! Please edit config.json!', null, true)
}

sys.util.log('Booting workers', true);
for(var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
}

if(config.reportErrors === true) {
    var ravenClient = new raven.Client(config.ravenURL);
    ravenClient.patchGlobal();
    sys.util.log('Raven error logger enabled.', true);
}

cluster.on('exit', function(worker, code, signal) {
    if(exitcount == config.maxExits) {
        sys.util.error('Worker '+worker.process.pid+' died ('+code||signal+')!');
        sys.util.error('Maximum amount of crashes reached, exiting!', null, true);
    } else {
        sys.util.log('Worker '+worker.process.pid+' died ('+code||signal+'), restarting...');
        cluster.fork();
    }
    exitcount++;
});

process.on('uncaughtException', function(err) {
    sys.util.error("An uncaught exception has taken place!", err, true);
});

} else {
    sys.worker();
}

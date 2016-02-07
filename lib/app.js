#!/usr/bin/env node

/**
 * @file The daemonizer class for MailJS
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

/* Copyright (C) AtlasDev - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Dany Sluijk <dany@atlasdev.nl>, February 2016
 */

var daemon = require('daemonize2').setup({
    main: 'server.js',
    name: 'MailJS',
    pidfile: '../MailJS.pid',
    silent: true
});

daemon.on('starting', function() {
    console.log('Starting MailJS daemon...');
});
daemon.on('started', function(pid) {
    console.log('MailJS daemon started. PID: '+pid);
});
daemon.on('stopping', function() {
    console.log('Stopping daemon...');
});
daemon.on('stopped', function(pid) {
    console.log('Daemon stopped.');
});
daemon.on('running', function(pid) {
    console.log('Daemon already running with PID: '+pid+'.');
});
daemon.on('notrunning', function() {
    console.log('Daemon is not running');
});
daemon.on('error', function(err) {
    console.log('MailJS failed to start: '+err.message);
});

switch (process.argv[2]) {
    case 'start':
        daemon.start();
        break;
    case 'startdev':
        require('./server.js');
        break;
    case 'stop':
        daemon.stop();
        break;
    case 'restart':
        if (daemon.status() !== 0) {
            daemon.stop().once('stopped', function() {
                daemon.start().once('started', function() {
                    process.exit();
                });
            });
        } else {
            daemon.start().once('started', function() {
                process.exit();
            });
        }
        break;
    case 'kill':
        console.warn('Warning: Force stopping daemon, next time use `npm mailjs stop` instead!');
        daemon.kill();
        break;
    case 'install':
        require('./install.js')(process.argv[3]);
        break;
    case 'uninstall':
        require('./uninstall.js')();
        break;
    case 'status':
        var status = daemon.status();
        if(status !== 0) {
            console.log('Daemon running with PID '+status+'.');
        } else {
            console.log('Daemon not running.');
        }
        break;
    case 'version':
        console.log('System: ' + process.platform + ' @ ' + process.arch);
        console.log('MailJS v' + require('../package.json').version);
        console.log('NodeJS ' + process.version);
        console.log('V8 engine v' + process.versions.v8);
    default:
        console.log('Usage: mailjs [start|stop|restart|kill|install {domain}|uninstall|status]');
}

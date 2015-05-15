/**
 * @file The main class for MailJS
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

'use strict'

var colors = require('colors');
var core   = require('./core.js');
var pack   = require('./package.json');

console.log('\n')
console.log(' __  __       _ _    '+'    _  _____  '.cyan);
console.log('|  \\\/  |     (_) | '+'     | |/ ____| '.cyan);
console.log('| \\\  / | __ _ _| | '+'     | | (___   '.cyan);
console.log('| |\\\/| |/ _` | | | '+' _   | |\\\___ \\\  '.cyan);
console.log('| |  | | (_| | | | '  +'|  __| |____) | '.cyan);
console.log('|_|  |_|\\\__,_|_|_| '+' \\\____/|_____/  '.cyan);
console.log('\n');

console.log('Start'.green + '    ' + 'Starting MailJS');
console.log('Start'.green + '    ' + 'System: ' + process.platform + ' @ ' + process.arch);
console.log('Start'.green + '    ' + 'MailJS v' + pack.version);
console.log('Start'.green + '    ' + 'NodeJS ' + process.version);
console.log('Start'.green + '    ' + 'V8 engine v' + process.versions.v8);
console.log('');

var core = new core(function(){});
/**
 * @file The core class for MailJS 
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */
 
'use strict'

var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var util = require('util');

var core = function core(callback) {
	var _this = this;
	_this.config;
	
	_this.log('===== Starting core services =====', true);
	_this.log('Initialising event system...' + '  DONE\r'.green, true);
	
	process.stdout.write('Start'.green + '    ' + 'Loading config file...');
	_this.reloadConfig(function(err) {
        if(err) {
            process.stdout.write('        FAIL\r'.red);
			_this.error(err.message, err, true);
            callback();
        }
		process.stdout.write('        DONE\r'.green);
	
		process.stdout.write('Start'.green + '    ' + 'Setting process name...');
		process.title = _this.config.process_name;
		process.stdout.write('       DONE\r'.green);
	});
    
    process.on('uncaughtException', function(err) {
        _this.error("An uncaught exception has taken place!", err, true);
    });
	callback();
}

util.inherits(core, EventEmitter);

core.prototype.saveConfig = function saveConfig(callback) {
	var _this = this;
	fs.writeFile('./config.json', JSON.stringify(_this.config, null, '\t'), function (err) {
		if(err) {
			callback(err);
		}
		callback(null);
	});
}

core.prototype.reloadConfig = function reloadConfig(callback) {
	var _this = this;
	fs.readFile('./config.json', 'utf8', function(err, data) {
		if(err) {
            callback(err)
		}
		var config;
		try {
			config = JSON.parse(data);
		} catch(err) {
            callback(err);
		}
		_this.config = config;
		callback(null);
	});
}

core.prototype.error = function error(msg, stack, quit) {
	console.log('\n');
	console.log('Error'.red + '    ' + msg);
	if(stack) {
		console.log('Error'.red + '    ' + stack.stack);
	}
	if(quit == true) {
		console.log('Error'.red + '    Error is severe, quitting...');
		process.exit(1);
	}
	console.log('\n');
	return true;
}

core.prototype.log = function log(msg, startup) {
    if(startup == true) {
        console.log('Start'.green + '    ' + msg);
    } else {
        console.log('Log'.cyan + '      ' + msg);
    }
    return true;
}

module.exports = core;
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
	
		_this.log('Scanning for plugins...', true);
		_this.on('pluginAvailable', function(plugin) {
			_this.log(' --'.yellow + ' Found new plugin `' + plugin + '`', true);
		})
		_this.scanPluginFolder(function(err){
            if(err) {
                _this.error(err.message, err, true);
            }
			_this.log('Done scanning, ' + _this.config.plugins.available.length + ' plugins found.', true);
			_this.removeAllListeners('pluginAvailable');
            _this.loadPlugin('web', function(err) {
                if(err) {
                    _this.error(err.message, err, true);
                }
            });
		});
	});
    
    process.on('uncaughtException', function(err) {
        _this.error("An uncaught exception has taken place!", err, true);
    });
	callback();
}

util.inherits(core, EventEmitter);

core.prototype.loadPlugin = function loadPlugin(plugin, callback) {
	var _this = this;
    if(_this.config.plugins.available.indexOf(plugin) == -1) {
		callback(new Error("Plugin `"+plugin+"` not available!"));
    } else {
        console.log('\r');
        this.log("===== Loading plugin `"+plugin+"` =====");
        
        this.log("===== Plugin `"+plugin+"` loaded =====");
        console.log('\r');
        callback(null);
    }
}

core.prototype.unloadPlugin = function unloadPlugin(plugin, callback) {
	var _this = this;
	if(_this.config.plugins.enabled.other.indexOf(plugin) == -1) {
        var error = new Error("Plugin `"+plugin+"` essential or not enabled!");
        _this.error("Plugin `"+plugin+"` essential or not enabled!", error);
		callback(error, null);
	} else {
		//TODO: unload module
	}
}

core.prototype.scanPluginFolder = function scanPluginFolder(callback) {
	var _this = this;
	fs.readdir(_this.config.plugin_folder, function(err, files) {
		if(err) {
			callback(err, null);
		}
		var oldAvailablePlugins = _this.config.plugins.available;
		_this.config.plugins.available = [];
		for(var i = 0; i < files.length; i++) {
			if(oldAvailablePlugins.indexOf(files[i]) == -1) {
				_this.emit('pluginAvailable', files[i]);
			}
			_this.config.plugins.available.push(files[i]);
		}
		oldAvailablePlugins = null;
		_this.saveConfig(function (err) {
			if(err) {
				callback(err, null);
			}
			callback(null, files);
		});
	});
}

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
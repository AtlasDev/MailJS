/**
 * @file The core class for 
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
	
	console.log('Start'.green + '    ' + '===== Starting core services =====');
	
	console.log('Start'.green + '    ' + 'Initialising event system...' + '  DONE\r'.green);
	
	process.stdout.write('Start'.green + '    ' + 'Loading config file...');
	_this.reloadConfig(function() {
		process.stdout.write('        DONE\r'.green);
	
		process.stdout.write('Start'.green + '    ' + 'Setting process name...');
		process.title = _this.config.process_name;
		process.stdout.write('       DONE\r'.green);
	
		console.log('Start'.green + '    ' + 'Scanning for plugins...');
		_this.on('pluginAvailable', function(plugin) {
			console.log('Start'.green + '    ' + ' ' + '--'.yellow + ' Found new plugin `' + plugin + '`');
		})
		_this.scanPluginFolder(function(){
			console.log('Start    '.green + 'Done scanning, ' + _this.config.plugins.available.length + ' plugins found.');
			_this.removeAllListeners('pluginAvailable');
		});
	});
	
	callback();
}

util.inherits(core, EventEmitter);

core.prototype.loadPlugin = function loadPlugin(plugin, callback) {
	var _this = this;
    if(_this.config.plugins.available.indexof(plugin) == -1) {
        var error = new Error("Plugin `"+plugin+"` not available!");
        _this.error("Plugin `"+plugin+"` not available!", error);
		callback(error);
    }
	callback(null);
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
            _this.error("Failed to scan for plugins!", err, true);
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
			_this.error('Failed to save the config file!', err, true);
			callback(err);
		}
		callback(null);
	});
}

core.prototype.reloadConfig = function reloadConfig(callback) {
	var _this = this;
	fs.readFile('./config.json', 'utf8', function(err, data) {
		if(err) {
			_this.error('Failed to load the config file', err, true);
		}
		var config;
		try {
			config = JSON.parse(data);
		} catch(err) {
			_this.error('Failed to parse the config!', err, true);
		}
		_this.config = config;
		callback();
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

core.prototype.log = function log(msg) {
	console.log('Log'.cyan + '      ' + msg);
}

module.exports = core;
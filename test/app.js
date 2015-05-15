var events = require('events');

var modules = {};
var sys = new events.EventEmitter();
console.log("loading module");
modules.module = require('./module.js')(sys, function() {
    console.log("module loaded");
    sys.emit('event');
});
setTimeout(function() {
    modules.module = "";
    delete require.cache[require.resolve('./module.js')];
    modules.module.unload(function(){})
    sys.emit('event');
}, 2000);
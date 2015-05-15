var mod = function mod(sys, callback) {
    sys.on("event", function() {
        console.log("event fired");
    });
    var sec = require('./second.js')(sys);
    console.log(module.id);
    callback();
}

mod.prototype.unload = function unload(callback) {
    console.log("module unloaded");
    callback();
}
module.exports = mod;
(function () {
'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ClientSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    scopes: { type: Array, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    id: { type: String, required: true },
    secret: { type: String, required: true },
    userId: { type: String, required: true }
});

ClientSchema.pre('save', function(callback) {
    var client = this;

    if (client.isModified('secret')) {
        bcrypt.genSalt(5, function(err, salt) {
            if (err) return callback(err);

            bcrypt.hash(client.secret, salt, null, function(err, hash) {
                if (err) return callback(err);
                client.secret = hash;
                callback();
            });
        });
    }
});

ClientSchema.methods.verifySecret = function(secret, cb) {
    bcrypt.compare(secret, this.secret, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Client', ClientSchema);
}());

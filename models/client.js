var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ClientSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
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
                if (client.isModified('id')) {
                    bcrypt.genSalt(5, function(err, salt) {
                        if (err) return callback(err);

                        bcrypt.hash(client.id, salt, null, function(err, hash) {
                            if (err) return callback(err);
                            client.id = hash;
                            callback();
                        });
                    });
                }
            });
        });
    }
});

ClientSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.secret, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Client', ClientSchema);
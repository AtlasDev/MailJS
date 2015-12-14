(function () {
'use strict';

var mongoose = require('mongoose');
var sys = require('../sys/main.js');

var TransferSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    object: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*60*24
    },
    maxUses: {
        type: Number,
        default: 0,
    },
    uses: {
        type: Number,
        default: 0
    }
});

UserSchema.methods.generate = function(type, cb) {
    var uid;
    switch (type) {
        case 1:
            uid = sys.util.uid(15);
            break;
        case 2:
            uid = sys.util.uid(18);
            break;
        case 3:
            uid = sys.util.uid(20);
            break;
    }
    this.code = uid;
    this.save(cb);
};

UserSchema.methods.isValid = function(cb) {
    if(new Date(this.createdAt.getTime() + (1000 * 60 * 60* 24)) > new Date.Now()) {
        this.remove(function (err) {
            if(err) {
                return cb(err, false);
            }
        });
        return cb(null, false);
    }
    if(this.maxUses !== 0 || this.maxUses >= this.uses) {
        this.remove(function (err) {
            if(err) {
                return cb(err, false);
            }
        });
        return cb(null, false);
    }
    return cb(null, true);
};

UserSchema.methods.use = function(cb) {
    this.isValid(function (err, isValid) {
        if(err) {
            return cb(err);
        }
        if(isValid === false) {
            return cb(new Error('Code is invalid'));
        }
        if(this.maxUses === 0) {
            return cb();
        }
        this.uses += this.uses;
        this.save(function (err) {
            if(err) {
                return cb(err);
            }
            return cb();
        });
    });
};

module.exports = mongoose.model('Transfer', TransferSchema);
}());

(function () {
'use strict';

var Transfer = require('../models/transfer.js');
var validator = require('validator');
var mongoose = require('mongoose');

/**
 * Create a new transfer code.
 * @name createTransfer
 * @since 0.1.0
 * @version 1
 * @param {string} object MongoID of the object to create the transfer code for.
 * @param {Int} type Type of the transfer code (1, 2 or 3).
 * @param {createTransferCallback} callback Callback function after creating the transfer code.
 */

/**
 * @callback createTransferCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} code Transfer code object.
 */
exports.create = function (object, type, maxUses, cb) {
    var error;
    if (!validator.isMongoId(object)) {
        error = new Error('Invalid object ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if ((!validator.isInt(type)) || type < 1 || type > 3) {
        error = new Error('Invalid type!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if ((!validator.isInt(maxUses)) || maxUses < 0) {
        error = new Error('Invalid maxUses!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    var code = new Transfer();
    code.generate(type, function () {
        code.object = mongoose.Types.ObjectId(object);
        code.type = type;
        code.maxUses = maxUses;
        code.save(function (err) {
            if(err) {
                return cb(err);
            }
            return cb(null, code);
        });
    });
};

/**
 * Find an existing transfer code.
 * @name findTransfer
 * @since 0.1.0
 * @version 1
 * @param {string} id MongoID of the object to find.
 * @param {findTransferCallback} cb Callback for finding a transfer code.
 */

/**
 * @callback findTransferCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} code Transfer code.
 */
exports.find = function (id, cb) {
    var error;
    Transfer.findById(id, function (err, code) {
        if(err) {
            return cb(err);
        }
        if(!code) {
            error = new Error('Code not found.');
            error.name = 'ENOTFOUND';
            error.type = 400;
            return cb(error);
        }
        code.isValid(function (err, isValid) {
            if(err) {
                return cb(err);
            }
            if(isValid !== true) {
                error = new Error('Code not valid anymore.');
                error.name = 'EEXPIRED';
                error.type = 410;
                return cb(error);
            }
            return cb(null, code);
        });
    });
};

/**
 * Find an existing transfer code by the code.
 * @name findTransferByCode
 * @since 0.1.0
 * @version 1
 * @param {string} code The code to find.
 * @param {findTransferByCodeCallback} cb Callback for finding a transfer code.
 */

/**
 * @callback findTransferByCodeCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} code Transfer code.
 */
exports.findByCode = function (code, cb) {
    var error;
    Transfer.findOne({code: code}, function (err, code) {
        if(err) {
            return cb(err);
        }
        if(!code) {
            error = new Error('Code not found.');
            error.name = 'ENOTFOUND';
            error.type = 400;
            return cb(error);
        }
        code.isValid(function (err, isValid) {
            if(err) {
                return cb(err);
            }
            if(isValid !== true) {
                error = new Error('Code not valid anymore.');
                error.name = 'EEXPIRED';
                error.type = 410;
                return cb(error);
            }
            return cb(null, code);
        });
    });
};
})();

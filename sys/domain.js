(function () {
'use strict';

var Domain = require('../models/domain.js');
var util = require('./util.js');
var validator = require('validator');

/**
 * Create a new domain.
 * @name createDomain
 * @since 0.1.0
 * @version 1
 * @param {string} domain The domain to register.
 * @param {boolean} disabled If the domain is open for registrations or not.
 * @param {createDomainCallback} callback Callback function after creating the domain.
 */

/**
 * @callback createDomainCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} newDomain Domain object of the created domain.
 */
exports.create = function (domain, admin, disabled, callback) {
    //TODO: generate and save certificates for the domain (when Let's Encrypt for nodejs gets released).
    //TODO: handle dubble domains nicer
    var error;
    if(!validator.isBoolean(disabled)) {
        error = new Error('Disabled is not a boolean!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    var domainRegex = new RegExp(/[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,})$/i);
    if(!domainRegex.test(domain) || domain.length >= 265) {
        error = new Error('Invalid domain!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    var newDomain = new Domain({
        domain: domain,
        disabled: disabled,
        admin: admin,
        users: [admin]
    });
    newDomain.save(function(err) {
        if (err) {
            return callback(err, null);
        }
        util.log('Domain `'+newDomain.domain+'` created.');
        return callback(null, newDomain);
    });
};

/**
 * Get all open domains
 * @name getDomains
 * @since 0.1.0
 * @version 1
 * @param {getDomainsCallback} callback Callback function after getting all domains
 */

/**
 * @callback getDomainsCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Array} domains An array of domain objects
 */
exports.getDomains = function (userID, callback) {
    if(!validator.isMongoId(userID)) {
        error = new Error('Invalid user ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    Domain.find({ users: userID }, function (err, domains) {
        if(err) {
            return callback(err);
        }
        return callback(null, domains);
    });
};

/**
 * Validate an user as an admin of a domain.
 * @name isAdmin
 * @since 0.1.0
 * @version 1
 * @param {isAdminCallback} cb Callback function after validating the user
 */

/**
 * @callback isAdminCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Boolean} isAdmin Checks if an user is an admin
 */
exports.isAdmin = function (domainID, userID, cb) {
    var error;
    if(!validator.isMongoId(userID)) {
        error = new Error('Invalid user ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if(!validator.isMongoId(domainID)) {
        error = new Error('Invalid domain ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    Domain.findOne({ _id: domainID, admin: userID }, function (err, domain) {
        if(err) {
            return cb(err);
        }
        if(!domain) {
            return cb(null, false);
        }
        return cb(null, true, domain);
    });
};

/**
 * Add a user to a domain
 * @name addUser
 * @since 0.1.0
 * @version 1
 * @param {MongoID} domainID ID of the domain to add the user to.
 * @param {MongoID} userID ID of the user to be added
 * @param {addUserCallback} cb Callback function after adding an user.
 */

/**
 * @callback addUserCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} domain Domain where the user was added to.
 */
exports.addUser = function (domainID, userID, cb) {
    var error;
    if(!validator.isMongoId(userID)) {
        error = new Error('Invalid user ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if(!validator.isMongoId(domainID)) {
        error = new Error('Invalid domain ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    Domain.findOne({ _id: domainID }, function (err, domain) {
        if(err) {
            return cb(err);
        }
        if(!domain) {
            error = new Error('Domain not found.');
            error.name = "ENOTFOUND";
            error.type = 400;
            return cb(error);
        }
        if(domain.users.indexOf(userID) > -1) {
            error = new Error('User already member of this domain.');
            error.name = 'EOCCUPIED';
            error.type = 400;
            return cb(error);
        }
        domain.users.push(userID);
        domain.save(function (err) {
            if(err) {
                return cb(err);
            }
            util.log('User `'+userID+'` has been added to the domain `'+domain.domain+'`');
            return cb(null, domain);
        });
    });
};
}());

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
}());

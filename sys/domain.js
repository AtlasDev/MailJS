var Domain = require('../models/domain.js');
var util = require('../util.js');

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
 * Callback for creating a new domain.
 * @callback createDomainCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} domain Domain object of the created domain.
 */
exports.create = function (domain, disabled, callback) {
    //TODO: generate and save certificates for the domain (when Let's Encrypt for nodejs gets released).
    if(!validator.isBoolean(disabled)) {
        var error = new Error('Disabled is not a boolean!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    var domainRegex = new Regex(/[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,})$/i);
    if(!domainRegex.test(domain) || domain.length >= 265) {
        var error = new Error('Invalid domain!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    var domain = new Domain({
        domain: domain,
        disabled: disabled
    });
    domain.save(function(err) {
        if (err) {
            return callback(err, null);
        }
        util.log('Domain `'+domain.domain+'` created.');
        return callback(null, domain);
    });
}

/**
 * Get all open domains
 * @name getDomains
 * @since 0.1.0
 * @version 1
 * @param {getDomainsCallback} callback Callback function after getting all domains
 */

/**
 * Callback for getting all available domains.
 * @callback getDomainsCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Array} domains An array of domain objects
 */
exports.getDomains = function (callback) {
    Domain.find({ disabled: false }, function (err, domains) {
        if(err) {
            return callback(err);
        }
        return callback(null, domains);
    })
}

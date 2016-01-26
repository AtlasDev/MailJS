(function () {
'use strict';

var Domain = require('../models/domain.js');
var util = require('./util.js');
var validator = require('validator');
var redis = require('./redis.js');
var letiny = require('letiny');
var config = require('../config.json');

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
exports.create = function (domain, admin, disabled, cb) {
    //TODO: handle dubble domains nicer
    var error;
    if(!validator.isBoolean(disabled)) {
        error = new Error('Disabled is not a boolean!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if(!validator.isFQDN(domain)) {
        error = new Error('Domain not an FQDN!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    var newDomain = new Domain({
        domain: domain,
        disabled: disabled,
        admin: admin,
        users: [admin]
    });
    exports.createCert(domain, function (err) {
        if(err) {
            return cb(err);
        }
        newDomain.save(function(err) {
            if (err) {
                return cb(err, null);
            }
            util.log('Domain `'+newDomain.domain+'` created.');
            return cb(null, newDomain);
        });
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

/**
 * Generate a trusted certificate with Lets Encrypt, adds mail. subdomain.
 * @name createCert
 * @since 0.1.1
 * @version 1
 * @param {String} domain Domain to generate the certificate for
 * @param {createCertCallback} cb Callback function after creating the domain.
 */

/**
 * @callback createCertCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} cert Object containing the (re)generated certificate.
 */
exports.createCert = function (domain, cb) {
    var error;
    var cert;
    var options;
    if(!validator.isFQDN(domain)) {
        error = new Error('Domain not an FQDN!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    domain = domain.toLowerCase().trim();
    redis.get("certs:"+domain, function (err, reply) {
        if(err) {
            return cb(err);
        }
        if(!reply) {
            options = {
                email: 'info@'+domain,
                domains: [domain, 'mail.'+domain],
                webroot: './http/LE',
                agreeTerms: true
            };
            if(config.stagingCerts === true) {
                options.url = 'https://acme-staging.api.letsencrypt.org';
            }
            letiny.getCert(options, function(err, cert, key, caCert, accountKey) {
                if(err) {
                    return cb(err);
                }
                cert = {
                    cert: cert,
                    key: key,
                    caCert: caCert,
                    accountKey: accountKey
                };
                redis.set('certs:'+domain, JSON.stringify(cert), function (err) {
                    if(err) {
                        return cb(err);
                    }
                    util.log('Certificate for `'+domain+'` generated.');
                    return cb(null, cert);
                });
            });
        } else {
            //refresh certs
            var oldCert;
            try {
                oldCert = JSON.parse(reply);
            } catch (e) {
                return cb(e);
            }
            var oneMonth = new Date();
            oneMonth.setDate(oneMonth.getMonth()+1);
            if(letiny.getExpirationDate(oldCert.cert).getTime() < oneMonth.getTime()) {
                error = new Error('Domain has over 1 month of life!');
                error.name = 'ENOTEXPIRED';
                error.type = 400;
                return cb(error);
            }
            options = {
                email: 'info@'+domain,
                domains: [domain, 'mail.'+domain],
                webroot: './http/LE',
                agreeTerms: true,
                accountKey: oldCert.accountKey,
                privateKey: oldCert.key
            };
            if(config.stagingCerts === true) {
                options.url = 'https://acme-staging.api.letsencrypt.org';
            }
            letiny.getCert(options, function (err, cert, key, caCert, accountKey) {
                if(err) {
                    return cb(err);
                }
                cert = {
                    cert: cert,
                    key: key,
                    caCert: caCert,
                    accountKey: accountKey
                };
                redis.set('certs:'+domain, JSON.stringify(cert), function (err) {
                    if(err) {
                        return cb(err);
                    }
                    util.log('Certificate for `'+domain+'` refreshed.');
                    return cb(null, cert);
                });
            });
        }
    });
};

/**
 * Get a certificate
 * @name getCert
 * @since 0.1.1
 * @version 1
 * @param {String} domain Domain to get the cert for.
 * @param {getCertCallback} cb Callback function after getting the cert.
 */

/**
 * @callback getCertCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} cert Object containing the certificate.
 */
exports.getCert = function (domain, cb) {
    var error;
    domain = domain.replace(/^(mail\.)/,"").toLowerCase().trim();
    if(!validator.isFQDN(domain)) {
        error = new Error('Domain not an FQDN!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    redis.get("certs:"+domain, function (err, reply) {
        if(err) {
            return cb(err);
        }
        if(!reply) {
            error = new Error('Certificate not found!');
            error.name = 'ENOTFOUND';
            error.type = 400;
            return cb(error);
        }
        var cert;
        try {
            cert = JSON.parse(reply);
        } catch (e) {
            return cb(e);
        }
        var oneMonth = new Date();
        oneMonth.setDate(oneMonth.getMonth()+1);
        if(letiny.getExpirationDate(cert.cert).getTime() <= new Date().getTime()) {
            exports.createCert(domain, function (err, cert) {
                if(err) {
                    return cb(err);
                }
                return cb(null, cert);
            });
        } else {
            return cb(null, cert);
        }
    });
};
}());

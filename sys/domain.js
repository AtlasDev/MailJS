(function () {
'use strict';

var Domain = require('../models/domain.js');
var validator = require('validator');
var letiny = require('letiny');
var config = require('../config.json');
var fs = require('fs');
var sys = require('./main.js');
var dns = require('dns');

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
    if(!validator.isBoolean(disabled.toString())) {
        error = new Error('Disabled is not a boolean!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if(!validator.isFQDN(domain.toString())) {
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
            var message = JSON.stringify({
                type: 'event',
                eventName: 'U:domainAdded',
                data: {
                    domain: newDomain,
                    type: 'create'
                }
            });
            sys.ws.send('U:'+admin, message);
            sys.util.log('Domain `'+newDomain.domain+'` created.');
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
    if(!validator.isMongoId(userID.toString())) {
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
    if(!validator.isMongoId(userID.toString())) {
        error = new Error('Invalid user ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if(!validator.isMongoId(domainID.toString())) {
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
    if(!validator.isMongoId(userID.toString())) {
        error = new Error('Invalid user ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if(!validator.isMongoId(domainID.toString())) {
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
            sys.util.log('User `'+userID+'` has been added to the domain `'+domain.domain+'`');
            return cb(null, domain);
        });
    });
};

/**
 * Generate a trusted certificate with Lets Encrypt.
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
    if(config.generateCerts === false) {
        sys.util.log('Certificate generation disabled. please re-enable it if you are not using it for testing purposes.', false, true);
        return cb(null, null);
    }
    var error;
    var options;
    domain = domain.toLowerCase().trim();
    var subDomain = 'mail.'+domain;
    if(!validator.isFQDN(domain.toString()) || !validator.isFQDN(subDomain.toString())) {
        error = new Error('Domain not an FQDN!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    dns.resolve(subDomain, ['A', 'AAAA'], function (err, ip) {
        if(err) {
            return cb(err);
        }
        if(config.pubIPs.indexOf(ip) == -1) {
            error = new Error('DNS of `'+subDomain+'` is not set up correctly!');
        }
        sys.redis.get("certs:"+subDomain, function (err, reply) {
            if(err) {
                return cb(err);
            }
            if(!reply) {
                options = {
                    email: 'info@'+domain,
                    domains: subDomain,
                    webroot: __dirname+'/../http/LE',
                    agreeTerms: true
                };
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
                    sys.redis.set('certs:'+subDomain, JSON.stringify(cert), function (err) {
                        if(err) {
                            return cb(err);
                        }
                        sys.util.log('Certificate for `'+domain+'` generated.');
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
                    domains: subDomain,
                    webroot: './http/LE',
                    agreeTerms: true,
                    accountKey: oldCert.accountKey,
                    privateKey: oldCert.key
                };
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
                    sys.redis.set('certs:'+subDomain, JSON.stringify(cert), function (err) {
                        if(err) {
                            return cb(err);
                        }
                        sys.util.log('Certificate for `'+domain+'` refreshed.');
                        return cb(null, cert);
                    });
                });
            }
        });
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
    domain = domain.toLowerCase().trim();
    if(!validator.isFQDN(domain.toString())) {
        error = new Error('Domain not an FQDN!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if(config.generateCerts === false) {
        sys.util.log('Certificate generation disabled. please re-enable it if you are not using it for testing purposes.', false, true);
        sys.util.log('Loading untrusted, substitute certificate.', false, true);
        var subCert;
        var subKey;
        try {
            subCert = fs.readFileSync(__dirname+'/../lib/server.crt', 'utf8');
            subKey = fs.readFileSync(__dirname+'/../lib/server.key', 'utf8');
        } catch (e) {
            sys.util.error('You need a substitute certificate if you want to disable certificate generation.', e, true);
        }
        return cb(null, {cert: subCert, key: subKey});
    }
    sys.redis.get("certs:"+domain, function (err, reply) {
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
            exports.createCert(domain.substring(5), function (err, cert) {
                if(err) {
                    return cb(err);
                }
                sys.util.log('Certificate for the domain `'+newDomain.domain+'` regenerated.');
                return cb(null, cert);
            });
        } else {
            return cb(null, cert);
        }
    });
};
}());

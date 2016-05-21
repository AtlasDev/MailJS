(function () {
'use strict';

var Domain = require('./models/domain.js');
var error = require('./error.js');
var validate = require('./validate.js');
var dns = require('dns');
var letiny = require('letiny');
var config = require('config');
var redis = require('./redis.js');
var tls = require('tls');
var logger = require('./log.js');
var certCache = {};

/**
	Find a domain.
	@param {String} Domain to find
	@return {Promise} Promise
	@fullfill {Model} Domain
	@reject {Error} error
**/
exports.findByDomain = function (domain) {
	return Domain.find({domain: domain}).exec();
};

/**
	Request a certificate from Let's encrypt
	@private
	@param {String} Domain to create
	@return {Promise} Promise
	@fullfill {Object} Certificate
	@reject {Error} error
**/
var createCert = function (domain) {
	return new Promise(function(resolve, reject) {
		var server = (config.has('staging') && config.get('staging') === true) ? 'https://acme-staging.api.letsencrypt.org' : 'https://acme-v01.api.letsencrypt.org';
		letiny.getCert({
			email: 'info@'+domain,
			domains: 'mail.'+domain,
			agreeTerms: true,
			url: server,
			challenge: function(domain, path, data, done) {
				path = path.replace('/.well-known/acme-challenge/', '');
				redis.set('LE:'+path, data, function (err) {
				    if(err) {
						return reject(err);
					}
    				redis.expire('LE:'+path, 60, function (err) {
					    if(err) {
							return reject(err);
						}
						done();
    				});
				});
			}
		}, function(err, cert, key, ca, account) {
			if(err) {
				return reject(err);
			}
			logger.info('Certificate for `'+domain+'` created.');
			resolve({
				cert: cert,
				key: key,
				ca: ca,
				account: account
			});
		});
	});
};

/**
	Validate the MX part of the DNS
	@private
	@param {String} Domain to validate
	@return {Promise} Promise
	@fullfill {String} Validated domain
	@reject {Error} error
**/
var validateMx = function (domain) {
	return new Promise(function(resolve, reject) {
		if(!validate.domain(domain)) {
			return reject(error.invalid('Invalid domain.'));
		}
		dns.resolveMx(domain, function (err, addresses) {
			if(err) {
				return reject(error.invalid('DNS not set up correctly.'));
			}
			var lowest = {};
			for (var i = 0; i < addresses.length; i++) {
				if(i === 0) {
					lowest = addresses[0];
				} else if(addresses[i].priority < lowest.priority) {
					lowest = addresses[i];
				}
				if(i === addresses.length-1) {
					if(lowest.exchange === 'mail.'+domain) {
						resolve(domain);
					} else {
						reject(error.invalid('DNS not set up correctly.'));
					}
				}
			}
		});
	});
}

/**
	Validate the A part of the DNS
	@private
	@param {String} Domain to validate
	@return {Promise} Promise
	@fullfill {String} Validated domain
	@reject {Error} error
**/
var validateA = function (domain) {
	return new Promise(function(resolve, reject) {
		if(!config.has('pubIP')) {
			reject(error.invalid('Missing public ip.'));
		}
		dns.resolve('mail.'+domain, function (err, addresses) {
			if(err) {
				return reject(error.invalid('DNS not set up correctly.'));
			}
			if(addresses.length === 1 && addresses[0] === config.get('pubIP')) {
				resolve(domain);
			} else {
				reject(error.invalid('DNS not set up correctly.'));
			}
		});
	});
}

/**
	Create a new domain and certificate
	@param {String} Domain to create
	@param {MongoID} Userid of the admin
	@return {Promise} Promise
	@fullfill {Model} Domain
	@reject {Error} error
**/
exports.create = function (domain, userid) {
	return new Promise(function(resolve, reject) {
		domain = domain.toLowerCase();
		validateMx(domain).then(validateA).then(createCert).then(function (cert) {
			var domainObj = new Domain();
			domainObj.domain = domain;
			domainObj.admins = [userid];
			domainObj.users = [userid];
			domainObj.certificate = cert.cert;
			domainObj.privateKey = cert.key;
			domainObj.ca = cert.ca;
			domainObj.account = cert.account;
			logger.info('Domain `'+domain+'` created.');
			return domainObj.save();
		}).then(resolve).catch(reject);
	});
}


/**
	Check for Let's Encrypt verification requests.
	@param {Object} Express req object
	@param {Object} Express res object
	@param {Function} Callback
**/
exports.checkLE = function (req, res, next) {
    redis.get('LE:'+req.path.substring(1), function (err, content) {
		if(err) {
			return next(err);
		}
		if(content) {
			return res.end(content);
		}
		next();
    });
}

/**
	Refresh a certificate
	@private
	@param {Mongo} Domain to be refreshed
	@return {Promise} Promise
	@fullfill {String} Refreshed domain.
	@reject {Error} error
**/
var refreshCert = function (domain) {
	return new Promise(function(resolve, reject) {
		validateMx(domain).then(validateMx).then(function () {
			require('letiny').getCert({
				email: 'info@'+domain.domain,
				domains: 'mail.'+domain.domain,
				agreeTerms: true,
				privateKey: domain.privateKey,
				accountKey: domain.account,
				challenge: function(domain, path, data, done) {
					var path = path.replace('/.well-known/acme-challenge/', '');
					redis.set('LE:'+path, data, function (err) {
						if(err) {
							return reject(err);
						}
						redis.expire('LE:'+path, 60, function (err) {
							if(err) {
								return reject(err);
							}
							done();
						});
					});
				},
			}, function(err, cert, key, ca, account) {
				if(err) {
					return reject(err);
				}
				domain.certificate = cert;
				domain.privateKey = key;
				domain.ca = ca;
				domain.account = account;
				domain.lastRefresh = Date.now();
				domain.save().then(function (domain) {
					logger.info('Certificate for `'+domain.domain+'` refreshed.');
					resolve(domain);
				}).catch(reject);
			});
		}).catch(reject);
	});
}

/**
	Refresh domain certificate
	@param {String|Object} Domain to be refreshed. in the form of the domain or in the form of a mongo object
	@return {Promise} Promise
	@fullfill {Model} Domain
	@reject {Error} error
**/
exports.refresh = function (domain) {
    return new Promise(function(resolve, reject) {
		if(validator.string(domain)) {
			Domain.findOne({domain: domain}).exec().then(function (domain) {
				refreshCert(domain).then(resolve).catch(reject);
			}).catch(reject);
		} else {
			refreshCert(domain).then(resolve).catch(reject);
		}
    });
}

/**
	SNI callback to get certificates
	@param {String} Domain get the certificates for.
	@param {function} callback.
	@return {Error|Optional} Error object, when acceptable.
	@return {SecureContext} Secure context to be used in TLS.
**/
exports.SNI = function (domain, callback) {
	if(domain.substring(0, 5) == 'mail.') {
		domain = domain.substring(5);
	}
	if(certCache[domain] && certCache[domain].expire > new Date()) {
		var context = tls.createSecureContext({
			key: certCache[domain].privateKey,
			cert: certCache[domain].certificate + '\n' + certCache[domain].ca,
			honorCipherOrder: true
		});
        return cb(null, context);
	}
	Domain.findOne({domain: domain}).exec().then(function (domain) {
		if(!domain) {
			return cb(error.notFound('Domain not found.'));
		}
		if(new Date(domain.lastRefresh.getTime() + 5184000000).getTime() < new Date().getTime()) {
			exports.refresh(domain.domain).then(function (domain) {
				var context = tls.createSecureContext({
					key: domain.privateKey,
					cert: domain.certificate + '\n' + domain.ca,
					honorCipherOrder: true
				});
				certCache[domain] = {
					expire: new Date(domain.lastRefresh.getTime() + 86400000),
					privateKey: domain.privateKey,
					certificate: domain.certificate,
					ca: domain.ca
				};
				return callback(null, context);
			}).catch(function (err) {
				callback(err);
			});
		} else {
			var context = tls.createSecureContext({
				key: domain.privateKey,
				cert: domain.certificate + '\n' + domain.ca,
				honorCipherOrder: true
			});
			certCache[domain] = {
				expire: new Date(domain.lastRefresh.getTime() + 86400000),
				privateKey: domain.privateKey,
				certificate: domain.certificate,
				ca: domain.ca
			};
			logger.info('Cached certificate for `'+domain.domain+'`.');
			return callback(null, context);
		}
	}).catch(callback);
};
}());

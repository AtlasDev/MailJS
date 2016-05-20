(function () {
'use strict';

var Domain = require('./models/domain.js');
var error = require('./error.js');
var validate = require('./validate.js');
var dns = require('dns');
var certCache = {};

/**
	Find a domain.
	@param {String} Domain to find
	@return {Promise} Promise
	@fullfill {Model} Domain
	@reject {Error} error
**/
exports.findByDomain = function (domain) {
	return User.find({domain: domain}).exec();
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
		if(!validate.domain(domain)) {
			return reject(error.invalid('Invalid domain.'));
		}
		dns.resolveMx(domain, function (err, addresses) {
			if(err) {
				return reject(err);
			}
			for (var address in addresses) {
				//TODO
			}
		});
	});
}
}());

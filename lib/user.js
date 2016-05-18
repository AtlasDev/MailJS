(function () {
'use strict';

var User = require('./models/user.js');

/**
	@param {MongoID} UserID
	@return {Promise} Promise
	@fullfill {Model} User
	@reject {Error} MongoError
**/
exports.findByID = function (uid) {
	return User.findById(uid).exec();
}

/**
	@param {String} username
	@param {String} password
	@param {MongoID} GroupID
	@return {Promise} Promise
	@fullfill {Model} User
	@reject {Error} MongoError
**/
exports.create = function (username, password, group) {
	var user = new User();
	user.username = username;
	user.password = password;
	user.groups = [ group ];
	return user.save();
}
}());

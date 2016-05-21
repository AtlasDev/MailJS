(function () {
'use strict';

var User = require('./models/user.js');

/**
	Find a user by id
	@param {MongoID} UserID
	@return {Promise} Promise
	@fullfill {Model} User
	@reject {Error} MongoError
**/
exports.findByID = function (uid) {
	return User.findById(uid).exec();
}

/**
	Find a user by username
	@param {Name} Username
	@return {Promise} Promise
	@fullfill {Model} User
	@reject {Error} MongoError
**/
exports.findByUsername = function (username) {
	return User.findOne({username: username}).exec();
}

/**
	Get all users
	@param {Int|Optional} limit of the users to get, default to 20, max 100.
	@param {Int|Optional} offset of the users to get, default 0
	@param {String|Optional} Fields to select
	@param {Object|Optional} Fields to sort by.
	@return {Promise} Promise
	@fullfill {Model} User
	@reject {Error} MongoError
**/
exports.getAll = function (limit, offset, select, sort) {
	if(!limit || limit<0 || limit>100) {
		limit = 20;
	}
	if(!offset || offset<0) {
		offset = 0;
	}
	if(!select) {
		select = '*';
	}
	if(!sort) {
		sort = {
			username: 1
		}
	}
	return User.find({}).limit(limit).skip(offset).select(select).sort(sort).exec();
}

/**
	Create a new user
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

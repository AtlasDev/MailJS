(function () {
'use strict';

var Group = require('./models/group.js');

/**
	@param {MongoID} GroupID
	@return {Promise} Promise
	@fullfill {Model} Group
	@reject {Error} MongoError
**/
exports.findByID = function (gid) {
	return Group.findById(gid).exec();
}

/**
	@param {String} groupName
	@param {colorHex} color
	@return {Promise} Promise
	@fullfill {Model} Group
	@reject {Error} MongoError
**/
exports.create = function (groupName, color) {
	var group = new Group();
	group.name = groupName;
	color = color || '';
	group.color = color;
	return group.save();
}
}());

(function () {
'use strict';

var mongodb = require('mongodb');

/**
	@param {String} String to validate
	@return {Boolean} isValid
**/
exports.string = function (obj) {
	if(typeof obj === 'string' || obj instanceof String) {
		return true;
	} else {
		return false;
	}
}

/**
	@param {Int} Interger to validate
	@return {Boolean} isValid
**/
exports.int = function (obj) {
	if(typeof obj == "number" && !isNaN(obj)) {
		return true;
	} else {
		return false;
	}
}

/**
	@param {Array} Array to validate
	@return {Boolean} isValid
**/
exports.array = function (obj) {
	if((!!obj) && (obj.constructor === Array)) {
		return true;
	} else {
		return false;
	}
}

/**
	@param {Object} Object to validate
	@return {Boolean} isValid
**/
exports.object = function (obj) {
	if((!!obj) && (obj.constructor === Object)) {
		return true;
	} else {
		return false;
	}
}

/**
	@param {String} Password to validate
	@return {Boolean} isValid
**/
exports.password = function (obj) {
	//Password is a string with specific requirements.
	if(!exports.string(obj)) {
		return false;
	}
	if(new RegExp(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,20})/).test(obj) && !obj.indexOf(' ') > -1) {
		return true;
	} else {
		return false;
	}
}

/**
	@param {String} Name to validate
	@return {Boolean} isValid
**/
exports.name = function (obj) {
	//Name is a string with 3 to 20 characters with no spaces.
	if(!exports.string(obj)) {
		return false;
	}
	if(obj.length >= 3 && obj.length <= 20 && obj.indexOf(' ') === -1) {
		return true;
	} else {
		return false;
	}
}

/**
	@param {colorHex} colorHex to validate
	@return {Boolean} isValid
**/
exports.colorHex = function (obj) {
	if(new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).test(obj)) {
		return true;
	} else {
		return false;
	}
}

/**
	@param {MongoID} MongoDB ID to validate
	@return {Boolean} isValid
**/
exports.mongoid = function (obj) {
	if(mongodb.ObjectID.isValid(obj)) {
		return true;
	} else {
		return false;
	}
}

/**
	@param {String} Domain to validate
	@return {Boolean} isValid
**/
exports.domain = function (obj) {
	//Domain is a string.
	if(!exports.string(obj)) {
		return false;
	}
	if(new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-.]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/).test(obj)) {
		return true;
	} else {
		return false;
	}
}
}());

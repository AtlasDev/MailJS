(function () {
'use strict';

/**
	@param {String|Optional} Custom error message.
	@return {Error} NotFoundError
**/
exports.notFound = function (msg) {
	var err = new Error(msg || 'The requested data could not be found.');
	err.name = "ENOTFOUND";
	err.code = 404;
	return err;
}

/**
	@param {String|Optional} Custom error message.
	@return {Error} ValidationError
**/
exports.validation = function (msg) {
	var err = new Error(msg || 'Validation failed.');
	err.name = "EVALIDATION";
	err.code = 400;
	return err;
}

/**
	@param {String|Optional} Custom error message.
	@return {Error} InvalidError
**/
exports.invalid = function (msg) {
	var err = new Error(msg || 'Invalid user input.');
	err.name = "EINVALID";
	err.code = 400;
	return err;
}

/**
	@param {String|Optional} Custom error message.
	@return {Error} FailedError
**/
exports.failed = function (msg) {
	var err = new Error(msg || 'Server failed to complete the task.');
	err.name = "EFAILED";
	err.code = 500;
	return err;
}

/**
	@param {String|Optional} Custom error message.
	@return {Error} DatabaseError
**/
exports.database = function (msg) {
	var err = new Error(msg || 'Database errored.');
	err.name = "EDATABASE";
	err.code = 500;
	return err;
}

/**
	@param {String|Optional} Custom error message.
	@return {Error} DeniedError
**/
exports.denied = function (msg) {
	var err = new Error(msg || 'Access denied.');
	err.name = "EDENIED";
	err.code = 401;
	return err;
}

/**
	@param {String|Optional} Custom error message.
	@return {Error} LimitError
**/
exports.limit = function (msg) {
	var err = new Error(msg || 'Rate limit exceeded.');
	err.name = "ELIMIT";
	err.code = 429;
	return err;
}
}());

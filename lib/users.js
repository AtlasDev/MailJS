var User = require('./models/user.js');

/**
	@param {MongoID} UserID
	@return {Model} User
	@except {Error} MongoError
**/
export.findByID = function (uid) {
	return User.findById(uid).exec().then();
}

/**
	@param {String} username
	@param {String} password
	@param {MongoID} GroupID
	@return {Model} User
	@except {Error} MongoError
**/
export.create = function (username, password, group) {
	return new Promise(function(resolve, reject) {
		
	});
}

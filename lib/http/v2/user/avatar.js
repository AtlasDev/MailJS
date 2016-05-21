(function () {
'use strict';

var user = require('../../../user.js');
var error = require('../../../error.js');

exports.get = function(req, res) {
	user.findByUsername(req.params.username).then(function (user) {
		if(!user) {
			var err = error.notFound('User not found.');
			return res.status(err.code).json({error: err});
		}
		res.set('Content-Type', 'image/png');
		return res.end(user.avatar);
	}).catch(function (err) {
		var err = error.database();
		res.status(err.code).json({error: err});
	});
};
}());

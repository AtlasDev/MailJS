(function () {
'use strict';

var lwip = require('lwip');
var error = require('./error.js');

/**
	Get random array of 36 booleans
	@private
	@return {Promise} Promise
	@fullfill {Array} Array of 36 booleans
**/
var getRandom = function () {
	return new Promise(function(resolve, reject) {
		var list = [];
		for (var i = 0; i < 36; i++) {
			if(Math.random() < 0.5) {
				list.push(false);
			} else {
				list.push(true);
			}
			if(i >= 35) {
				resolve(list);
			}
		}
	});
}

/**
	Create an image.
	@private
	@param {Array} Array of booleans.
	@return {Promise} Promise
	@fullfill {Buffer} Buffer containing the PNG image.
	@reject {Error} Error object
**/
var createImage = function (list) {
	return new Promise(function(resolve, reject) {
		//Get a filler color, is there a better way?
		var color = Math.random();
		if(color < 0.166) {
			color = 'red';
		} else if(color < 0.332) {
			color = 'green';
		} else if(color < 0.498) {
			color = 'blue';
		} else if(color < 0.664) {
			color = 'yellow';
		} else if(color < 0.83) {
			color = 'cyan';
		} else {
			color = 'magenta';
		}

		//Create a 6x6 image
		lwip.create(6, 6, 'white', function(err, image){
			if(err) {
				reject(err);
				return;
			}
			var image = image.batch();
			//Set the specific pixels
			for (var i = 0; i < 36; i++) {
				if(Math.random() < 0.5) {
					var left = i % 6;
					var top = (i-left)/6;
					image.setPixel(left, top, color);
				}
				if(i >= 35) {
					image.resize(200, 200);
					image.toBuffer('png', {compression: 'high', transparency: false}, function (err, img) {
						if(err) {
							return reject(err);
						}
						return resolve(img);
					});
				}
			}
		});
	});
}

/**
	Creates a random 200x200 image
	@return {Promise} Promise
	@fullfill {Buffer} PNG image
	@reject {Error} Error object
**/
exports.getRandom = function () {
	return new Promise(function(resolve, reject) {
		getRandom().then(createImage).then(resolve).catch(reject);
	});
}

/**
	Get mime type of a image.
	@private
	@param Base64 encoded image
	@return {String|Boolean} Mime type, false if unknown.
**/
var getMime = function (image) {
	var start = image.split(';')[0];
	if(start === 'data:image/png') {
		return 'png';
	} else if(start === 'data:image/jpg' || start === 'data:image/jpeg') {
		return 'jpg';
	} else if (start === 'data:image/gif') {
		return 'gif';
	} else {
		return false;
	}
}

/**
	Resize to PNG, 200x200, non transparent
	@param {String} Base64 encoded image.
	@return {Promise} Promise
	@fullfill {Buffer} PNG image
	@reject {Error} Error object
**/
exports.resize = function (img) {
	return new Promise(function(resolve, reject) {
		var mime = getMime(img);
		if(mime === false) {
			return reject(error.invalid('Invalid base64 image.'));
		}
		lwip.open(img, mime, function(err, image){
			if(err) {
				return reject(err);
			}
			image = image.batch();
			image.resize(200, 200);
			image.toBuffer('png', {compression: 'high', transparency: false}, function (err, img) {
				if(err) {
					return reject(err);
				}
				return resolve(img);
			});
		});
	});
}
}());

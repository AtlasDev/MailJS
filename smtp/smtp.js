/**
 * @file The main SMTP handler
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

var util = require('../util.js');
var event = require('../event.js');

var smtp = function() {
    util.log('SMTP server started', true);
    event.emit('smtp.started');
};

module.exports = smtp;

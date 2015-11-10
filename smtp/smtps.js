var util = require('../util.js');
var SMTPServer = require('smtp-server').SMTPServer;
var sys = require('../sys/main.js');
var config = require('../config.json');
var lookup = require('dnsbl-lookup');

module.exports = function () {
    //SMTP submission receives emails send by other MTAs and handles them. No auth accepted, but only accepts local domains as RCPT TO.
    //Emails are stored in the database to be opened by there owner.
    var smtp = new SMTPServer({
        secure: true,
        banner: 'MailJS ESMTPS service, welcome.',
        authMethods: [],
        disabledCommands: ['AUTH'],
        logger: false,
        onConnect: function(session, cb) {
            var blocked = false;
            var dnsbl = new lookup.dnsbl(session.remoteAddress, config.smtp.DNSBL);
            dnsbl.on('error',function(error,blocklist){
                util.error('Could not check DNS blacklist on '+blocklist.zone+' for '+session.remoteAddress+'.', error);
                cb(new Error('Internal Server Error.'));
            });
            dnsbl.on('data',function(result,blocklist){
                if(result.status == "listed") {
                    util.log('Blocked '+session.remoteAddress+'\'s connection on SMTP submission because of a blacklist.');
                    blocked = true;
                    return cb(new Error('IP blacklisted by '+blocklist.zone+'.'));
                }
            });
            dnsbl.on('done', function(){
                if(blocked == false) {
                    return cb();
                }
            });
        },
        onRcptTo: function(address, session, cb){
            sys.mailbox.verify(address.address, function (err, isValid) {
                if(err) {
                    return cb(err);
                }
                if(!isValid) {
                    return cb(new Error('Address not local.'));
                }
                return cb();
            });
        },
        onData: function(stream, session, cb){
            var received = "";
            stream.on('data', function (data) {
                received += data.toString();
            });
            stream.on('end', function () {
                var commands = received.split(/\r?\n/);
                console.log(commands);
                cb(null, "Message stored as 1.");
            });
        }
    });
    smtp.listen(config.smtp.submission, false, function () {
        util.log('SMTP submission server started on port '+config.smtp.submission, true);
    });
}

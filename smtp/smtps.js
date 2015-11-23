var util = require('../util.js');
var SMTPServer = require('smtp-server').SMTPServer;
var sys = require('../sys/main.js');
var config = require('../config.json');
var lookup = require('dnsbl-lookup');
var os = require('os');

module.exports = function () {
    //SMTP submission receives emails send by other MTAs and handles them. No auth accepted, but only accepts local domains as RCPT TO.
    //Emails are stored in the database to be opened by there owner.
    var smtp = new SMTPServer({
        secure: false,
        banner: 'MailJS ESMTPS service, welcome.',
        authMethods: [],
        disabledCommands: ['AUTH'],
        logger: false,
        onConnect: function(session, cb) {
            //A blocked IP for testing: 2.0.0.127
            var dnsbl = new lookup.dnsbl(session.remoteAddress, config.smtp.DNSBL);
            dnsbl.on('error',function(error,blocklist){
                util.error('Could not check DNS blacklist on '+blocklist+' for '+session.remoteAddress+'.', error);
                cb(new Error('Internal Server Error.'));
            });
            dnsbl.on('data',function(result,blocklist){
                if(result.status == "listed") {
                    util.log('Blocked '+session.remoteAddress+'\'s connection on SMTP submission because of a blacklist.');
                    return cb(new Error('IP blacklisted by '+blocklist+'.'));
                }
            });
            dnsbl.on('done', function(){
                return cb();
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
                var mail = {
                    body: "",
                    reportedDate: "",
                    from: "",
                    to: "",
                    subject: "",
                    otherData: []
                }
                var error = false;
                var endOfCommands = false;
                for (var i = 0; i < commands.length; i++) {
                    if(error == false) {
                        if(commands[i].indexOf(':') > -1 && endOfCommands == false) {
                            if(util.startsWith(commands[i].toUpperCase(), "TO:")) {
                                var content = commands[i].substring(3, commands[i].length);
                                if(content.charAt(0) == " ") {
                                    content = content.substring(1, content.length);
                                }
                                mail.to = content;
                            } else if(util.startsWith(commands[i].toUpperCase(), "FROM:")) {
                                var content = commands[i].substring(5, commands[i].length);
                                if(content.charAt(0) == " ") {
                                    content = content.substring(1, content.length);
                                }
                                mail.from = content;
                            } else if(util.startsWith(commands[i].toUpperCase(), "SUBJECT:")) {
                                var content = commands[i].substring(8, commands[i].length);
                                if(content.charAt(0) == " ") {
                                    content = content.substring(1, content.length);
                                }
                                mail.subject = content;
                            } else if(util.startsWith(commands[i].toUpperCase(), "DATE:")) {
                                var content = commands[i].substring(5, commands[i].length);
                                if(content.charAt(0) == " ") {
                                    content = content.substring(1, content.length);
                                }
                                var content = Date.parse(content);
                                if(isNaN(content)) {
                                    error = true;
                                    return cb('Invalid date string');
                                }
                                mail.reportedDate = Date.parse(content);
                            } else {
                                mail.otherData.push(commands[i]);
                            }
                        } else {
                            endOfCommands = true;
                            mail.body = mail.body+os.EOL+commands[i];
                        }
                        if(i == commands.length - 1) {
                            var saveError = false;
                            for (var j = 0; j < session.envelope.rcptTo.length; j++) {
                                if(!saveError) {
                                    sys.mailbox.verify(session.envelope.rcptTo[j].address, function (err, isValid, mailbox) {
                                        if(err) {
                                            saveError = true;
                                            return cb(err);
                                        }
                                        if(!isValid) {
                                            //Should NEVER happen!
                                            saveError = true;
                                            return cb(new Error('invalid mailbox `'+session.envelope.rcptTo[j].address+'`.'));
                                        }
                                        sys.email.create(
                                            mailbox._id,
                                            mail.from || session.envelope.mailFrom.address,
                                            mail.subject,
                                            mail.body,
                                            function(err, email) {
                                                if(err) {
                                                    saveError = true;
                                                    return cb(err);
                                                }
                                                console.log(email);
                                            }
                                        );
                                    });
                                    if(j == session.envelope.rcptTo.length - 1) {
                                        return cb(null, "Message stored as 1.");
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    });
    smtp.listen(config.smtp.submission, false, function () {
        util.log('SMTP submission server started on port '+config.smtp.submission, true);
    });
}

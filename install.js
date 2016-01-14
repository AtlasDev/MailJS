var mongoose = require('mongoose');
var config = require('./config.json');
var colors = require('colors');
var pack = require('./package.json');
var sys = require('./sys/main.js');
var validator = require('validator');

if(config.noinstall == true) {
    process.exit(0);
}

console.log('\n')
console.log(' __  __       _ _    '+'    _  _____  '.cyan);
console.log('|  \\\/  |     (_) | '+'     | |/ ____| '.cyan);
console.log('| \\\  / | __ _ _| | '+'     | | (___   '.cyan);
console.log('| |\\\/| |/ _` | | | '+' _   | |\\\___ \\\  '.cyan);
console.log('| |  | | (_| | | | '  +'|  __| |____) | '.cyan);
console.log('|_|  |_|\\\__,_|_|_| '+' \\\____/|_____/  '.cyan);
console.log('\n');
console.log('Installing MailJS');
console.log('System: ' + process.platform + ' @ ' + process.arch);
console.log('MailJS v' + pack.version);
console.log('NodeJS ' + process.version);
console.log('V8 engine v' + process.versions.v8);
console.log('');

if(!config.configured) {
    console.log('MailJS not configured!'.red);
    process.exit(1);
}

var setupDomain = process.argv[2];
if(!setupDomain || !validator.isFQDN(setupDomain)) {
    console.log('Initial domain not given or not an FQDN!'.red);
    process.exit(1);
}

console.log('Connecting to the database..');
var dburl = 'mongodb://'+config.db.username+':'+config.db.password+'@'+config.db.host+':'+config.db.port+'/'+config.db.database;
mongoose.connect(dburl);

mongoose.connection.on('open', function(){
    dbstuff();
});

var dbstuff = function () {
    console.log('Creating first user.');
    console.log(' - Generating password..');
    var password = sys.util.uid(12);
    console.log('   - password generated');
    sys.user.create('admin', password, 'Admin', 'Adminius', true, function (err, user) {
        if (err) {
            console.log(colors.red('Failed to create initial user: '.red+err.errmsg+" ("+err.code+")."));
            process.exit(1);
        }
        console.log(' - User created.');
        console.log('Creating first domain..');
        sys.domain.create(setupDomain, user._id, false, function (err, domain) {
            if (err) {
                console.log(colors.red('Failed to create initial domain: '.red+err));
                process.exit(1);
            }
            console.log('Domain created.');
            console.log('Creating initial mailbox..');
            sys.mailbox.create('info', domain._id, user._id, 'Info '+domain.domain, true, function (err, mailbox) {
                if (err) {
                    console.log(colors.red('Failed to create initial mailbox: '.red+err));
                    process.exit(1);
                }
                console.log('Initial mailbox created.');
                console.log('');
                console.log('###############');
                console.log('##  Installation Finished!');
                console.log('##  Initial account details:');
                console.log('##  Username: '+'admin'.cyan);
                console.log('##  Password: '+colors.cyan(password));
                console.log('##  Mail address: '+'info@'.cyan+setupDomain.cyan);
                console.log('##  SAVE THIS INFORMATION CAREFULLY!');
                console.log('##  It is NOT recoverable!');
                console.log('###############');
                process.exit(0);
            });
        });
    });
}

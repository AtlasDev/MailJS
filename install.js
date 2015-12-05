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
var dburl = 'mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.database;
mongoose.connect(dburl);

mongoose.connection.on('open', function(){
    SavePerms(function (group) {
        dbstuff(group);
    });
});

var dbstuff = function (group) {
    console.log('Creating first user.');
    console.log(' - Generating password..');
    var password = sys.util.uid(12);
    console.log('   - password generated');
    sys.user.create('admin', password, 'Admin', 'Adminius', function (err, user) {
        if (err) {
            console.log(colors.red('Failed to create initial user: '.red+err));
            process.exit(1);
        }
        sys.user.setGroup(user._id, group._id, function (err, user) {
            if (err) {
                console.log(colors.red('Failed to set the group of the initial user: '.red+err));
                process.exit(1);
            }
            console.log(' - User created.');
            console.log('Creating first domain..');
            sys.domain.create(setupDomain, false, function (err, domain) {
                if (err) {
                    console.log(colors.red('Failed to create initial domain: '.red+err));
                    process.exit(1);
                }
                console.log('Domain created.');
                console.log('Creating initial mailbox..');
                sys.mailbox.create('info', domain._id, user._id, 'Example Info', false, true, function (err, mailbox) {
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
                    console.log('##  Mailaddress: '+'info@'.cyan+setupDomain.cyan);
                    console.log('##  SAVE THIS INFORMATION CAREFULLY!');
                    console.log('##  It is NOT recoverable!');
                    console.log('###############');
                    process.exit(0);
                });
            });
        })
    });
}

var SavePerms = function SavePerms(cb) {
    console.log('Creating default groups..');
    sys.group.createGroup('Administrator', 'Administrators', [
        'user.list',
        'user.create',
        'user.delete',
        'user.protected',
        'user.overwrite',
        'user.group.change',
        'group.list',
        'client.create',
        'client.list',
        'client.delete',
        'mailbox.create',
        'mailbox.view',
        'domain.create'
    ], false, function (err, adminGroup) {
        if(err) {
            if (err) {
                console.log(colors.red('Failed to create initial Administrators group: '.red+err));
                process.exit(1);
            }
        }
        console.log(' - Admin group created');
        sys.group.createGroup('Moderator', 'Moderators', [
            'user.list',
            'user.create',
            'user.delete',
            'user.protected',
            'group.list',
            'client.create',
            'client.list',
            'client.delete',
            'mailbox.create',
            'mailbox.view'
        ], false, function (err, modGroup) {
            if(err) {
                if (err) {
                    console.log(colors.red('Failed to create initial Moderators group: '.red+err));
                    process.exit(1);
                }
            }
            console.log(' - Moderators group created.');
            sys.group.createGroup('User', 'Users', [
                'client.create',
                'mailbox.create'
            ], true, function (err, userGroup) {
                if(err) {
                    if (err) {
                        console.log(colors.red('Failed to create initial Users group: '.red+err));
                        process.exit(1);
                    }
                }
                console.log(' - Users group created.');
                console.log('Default groups created.');
                cb(adminGroup);
            });
        });
    });
}

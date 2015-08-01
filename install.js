var mongoose = require('mongoose');
var config = require('./config.json');
var colors = require('colors');
var pack = require('./package.json');
var User = require('./models/user.js');
var Perms = require('./models/permissions.js');

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

console.log('Connecting to the database..');
mongoose.connect('mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.database);

console.log('Generating password..');
require('crypto').randomBytes(4, function(ex, buf) {
    var password = buf.toString('hex');
    console.log(' - password generated');
    var admin = new User({
        username: 'admin',
        password: password,
        group: '3'
    });
    console.log('Saving initial user..');
    admin.save(function(err) {
        if (err) {
            console.log(colors.red('Failed to save initial user: '.red+err));
            process.exit(1);
        }
        console.log(' - User saved');
        console.log('Populating permission schemas..');
        SavePerms(function() {
            console.log('');
            console.log('########################################');
            console.log('##                                    ##');
            console.log('##  Installation Finished!            ##');
            console.log('##  Initial account details:          ##');
            console.log('##  Username: '+'admin'.cyan+'                   ##');
            console.log('##  Password: '+colors.cyan(password)+'                ##');
            console.log('##  SAVE THIS INFORMATION CAREFULLY!  ##');
            console.log('##  It is NOT recoverable!            ##');
            console.log('##                                    ##');
            console.log('########################################');
            process.exit(0);
        });
    });
});

var SavePerms = function SavePerms(cb) {
    var permissions = [];
    //user management
    permissions.push(new Perms({name: 'viewUsers', group: '2'}));
    permissions.push(new Perms({name: 'createUser', group: '2'}));
    permissions.push(new Perms({name: 'deleteUser', group: '2'}));
    
    //client management
    permissions.push(new Perms({name: 'createClient', group: '3'}));
    permissions.push(new Perms({name: 'viewClients', group: '2'}));
    permissions.push(new Perms({name: 'deleteClient', group: '3'}));
    
    //email/domain management
    permissions.push(new Perms({name: 'createEmail', group: '1'}));
    permissions.push(new Perms({name: 'addDomain', group: '3'}));
    
    permissions.forEach(function(permission, i) {
        permission.save(function(err) {
            if(err) {
                console.log(colors.red('Failed to save permissions: '.red+err));
                process.exit(1);
            }
            console.log(' - Saved permission '+permission.name+' to group '+permission.group);
            if(i == permissions.length-1) {
                cb();
            }
        });
    });
}
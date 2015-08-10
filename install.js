var mongoose = require('mongoose');
var config = require('./config.json');
var colors = require('colors');
var pack = require('./package.json');
var User = require('./models/user.js');
var Perms = require('./models/permissions.js');
var redis = require('redis');
var crypto = require('crypto');

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
var dburl = 'mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.database;
mongoose.connect(dburl);

console.log('connecting to redis');
var client = redis.createClient(config.redis.port, config.redis.host);

console.log('Creating session secret..');
crypto.randomBytes(32, function(ex, buf) {
    var key = buf.toString('hex');
    console.log('Setting session secret..');
    client.set("settings:sessionKey", key);
    client.set("settings:setup", "true");
    dbstuff();
});

var dbstuff = function () {
    console.log('Generating password..');
    crypto.randomBytes(4, function(ex, buf) {
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
}

var SavePerms = function SavePerms(cb) {
    var permissions = [];
    //user management
    permissions.push(new Perms({name: 'user.list', group: '2'}));
    permissions.push(new Perms({name: 'user.create', group: '2'}));
    permissions.push(new Perms({name: 'user.delete', group: '2'}));
    permissions.push(new Perms({name: 'user.group.change', group: '3'}));

    //client management
    permissions.push(new Perms({name: 'client.create', group: '3'}));
    permissions.push(new Perms({name: 'client.list', group: '2'}));
    permissions.push(new Perms({name: 'client.delete', group: '3'}));

    //email management
    permissions.push(new Perms({name: 'email.create', group: '1'}));

    //domain management
    permissions.push(new Perms({name: 'domain.create', group: '3'}));

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

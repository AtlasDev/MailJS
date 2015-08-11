var mongoose = require('mongoose');
var config = require('./config.json');
var colors = require('colors');
var pack = require('./package.json');
var User = require('./models/user.js');
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

mongoose.connection.on('open', function(){
    console.log('connecting to redis');
    var client = redis.createClient(config.redis.port, config.redis.host);

    client.on('ready', function () {
        redisstuff(client);
    });
});

var redisstuff = function (client) {
    console.log('Creating session secret..');
    crypto.randomBytes(32, function(ex, buf) {
        client.set("settings:setup", "true");
        var key = buf.toString('hex');
        console.log('Setting session secret..');
        client.set("settings:sessionKey", key);
        SavePerms(client, function () {
            dbstuff();
        });
    });
}

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
}

var SavePerms = function SavePerms(client, cb) {
    console.log('Populating permission schemas..');

    //user management
    client.hset("perms", "user.list", "2");
    client.hset("perms", "user.create", "2");
    client.hset("perms", "user.delete", "2");
    client.hset("perms", "user.group.change", "3");

    //client management
    client.hset("perms", "client.create", "1");
    client.hset("perms", "client.list", "2");
    client.hset("perms", "client.delete", "3");

    //mailbox management
    client.hset("perms", "mailbox.create", "1");

    //domain management
    client.hset("perms", "domain.create", "3");

    console.log('Permissions saved.');
    cb();
}

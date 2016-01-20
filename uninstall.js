var mongoose = require('mongoose');
var config = require('./config.json');
var colors = require('colors');
var pack = require('./package.json');
var redis = require('redis');

console.log('\n')
console.log(' __  __       _ _    '+'    _  _____  '.cyan);
console.log('|  \\\/  |     (_) | '+'     | |/ ____| '.cyan);
console.log('| \\\  / | __ _ _| | '+'     | | (___   '.cyan);
console.log('| |\\\/| |/ _` | | | '+' _   | |\\\___ \\\  '.cyan);
console.log('| |  | | (_| | | | '  +'|  __| |____) | '.cyan);
console.log('|_|  |_|\\\__,_|_|_| '+' \\\____/|_____/  '.cyan);
console.log('\n');
console.log('Uninstalling MailJS');
console.log('System: ' + process.platform + ' @ ' + process.arch);
console.log('MailJS v' + pack.version);
console.log('NodeJS ' + process.version);
console.log('V8 engine v' + process.versions.v8);
console.log('');

if(config.uninstall !== true) {
    console.log('Safety switch saved the data!'.red);
    process.exit(0);
}

console.log('Connecting to the database..');
var dburl = 'mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.database;
mongoose.connect(dburl, {user: config.db.username, pass: config.db.password});

mongoose.connection.on('open', function(){
    console.log('Deleting database..');
    mongoose.connection.db.dropDatabase(function () {
        console.log('Database deleted.');
        console.log('Connecting to redis..');
        var client = redis.createClient(config.redis.port, config.redis.host);
        client.on('ready', function () {
            console.log('Flushing redis database..');
            client.flushdb(function () {
                console.log('Redis flushed.');
                console.log('Uninstall successfull, it\'s a shame to see you go away :(');
                process.exit(0);
            });
        });
    });
});

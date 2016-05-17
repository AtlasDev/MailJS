(function () {
'use strict';

var RedisSessions = require("redis-sessions");
var user = require('./user.js');
var sys = require('./main.js');

function Sessions() {
   /*jshint validthis: true */
   this.sessions = new RedisSessions({client: sys.redis, namespace: 'sess'});
   this.appName = 'MailJS';
}

Sessions.prototype.create = function(username, ip, other, callback) {
   var _this = this;
   var options;
   var cb;
   if(!callback) {
       cb = other;
       options = '{}';
   } else {
       cb = callback;
       options = other;
   }
   user.findByUsername(username, function (err, user) {
       if(err){
           cb(err, null);
       }
       options.isAdmin = user.isAdmin;
       options.username = user.username;
       options._id = user._id;
       options.mailboxes = user.mailboxes;
       _this.sessions.create({
           app: _this.appName,
           id: user._id,
           ip: ip,
           d: options
       },
       function(err, resp) {
           if(err) { return cb(err, null); }
           var message = JSON.stringify({
               type: 'event',
               eventName: 'U:sessionCreated',
               data: {
                   ip: ip
               }
           });
           sys.ws.send('U:'+user._id, message);
           cb(null, resp.token);
       });
   });
};

Sessions.prototype.getSessions = function (id, cb) {
   var _this = this;
   _this.sessions.soid({
           app: _this.appName,
           id: id
       },
       function(err, resp) {
           if(err) {
               return cb(err, null);
           }
           cb(null, resp.sessions);
       }
   );
};

Sessions.prototype.killSession = function (token, cb) {
   var _this = this;
   _this.sessions.kill({
           app: _this.appName,
           token: token
       },
       function(err, resp) {
           if(err) {
               return cb(err);
           }
           cb();
       }
   );
};

Sessions.prototype.killAll = function (user, cb) {
   var _this = this;
   _this.sessions.killsoid({
       app: _this.appName,
       id: user
   }, function (err, resp) {
       return cb(err, resp);
   });
};

Sessions.prototype.getSession = function (token, cb) {
   var _this = this;
   _this.sessions.get(
       {
           app: _this.appName,
           token: token
       },
       function(err, resp) {
           if(err) {
               return cb(err, null);
           }
           cb(null, resp);
       }
   );
};

module.exports = new Sessions();
}());

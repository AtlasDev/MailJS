'use strict'

app.factory('user', function ($window, $cookies, $http, $rootScope) {
    var sessionID = $cookies.get('MailJS');
    var user = {};

    // Events:
    // userLoaded

    function getUser() {
        return user;
    }

    (function () {
        var req = {
            method: 'GET',
            url: '/api/v1/user/current',
            headers: {
                'x-token': sessionID
            }
        };
        $http(req).then(function(res) {
            user = res.data.user;
            var req = {
                method: 'GET',
                url: '/api/v1/group/'+user.group,
                headers: {
                    'x-token': sessionID
                }
            };
            $http(req).then(function(res) {
                user.group = res.data.group;
                $rootScope.$emit('userLoaded');
            }, function(res) {
                $cookies.remove('MailJS');
                if(res.status == 401) {
                    return $window.location.href = '/index.html?msg=Session%20invalid,%20please%20log%20in%20again.';
                }
                $window.location.href = '/index.html?msg='+JSON.parse(res.data).error.message;
            });
        }, function(res) {
            $cookies.remove('MailJS');
            if(res.status == 401) {
                return $window.location.href = '/index.html?msg=Session%20invalid,%20please%20log%20in%20again.';
            }
            $window.location.href = '/index.html?msg='+res.data.error.message;
        });
    })();

    function logout() {
        $http({
            method: 'DELETE',
            url: '/api/v1/login',
            headers: {
                'x-token': sessionID
            }
        }).then(function(res) {
            $cookies.remove('MailJS');
            $window.location.href = '/index.html?info=true&msg=Logout%20Succesfull,%20goodbye!';
        }, function(res) {
            $cookies.remove('MailJS');
            $window.location.href = '/index.html?info=true&msg=Logout%20Succesfull,%20goodbye!';
        });
    }

    return {
        logout: logout,
        sessionID: sessionID,
        getUser: getUser
    }
});

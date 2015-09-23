'use strict'

app.factory('mailbox', function ($http, user, $rootScope) {
    var current;
    var mailboxes = [];

    //Events:
    //currentMailboxChange
    //mailboxesChange

    function init() {
        var req = {
            method: 'GET',
            url: '/api/v1/mailbox',
            headers: {
                'x-token': user.sessionID
            }
        };
        $http(req).then(function (res) {
            mailboxes = res.data.mailboxes;
            $rootScope.$emit('mailboxesChange', res.data.mailboxes);
            current = mailboxes[0];
            $rootScope.$emit('currentMailboxChange', current);
            user.setInit(true);
            $('body').addClass('preloaded');
        }, function (res) {
            $cookies.remove('MailJS');
            $window.location.href = '/index.html?msg='+JSON.parse(res.data).error.message;
        });
    }

    function changeMailbox(id) {
        for(var i = 0; i<mailboxes.length; i++) {
            if(mailboxes[i]._id == id) {
                current = mailboxes[i];
                break;
            }
        }
    }

    $rootScope.$on('userLoaded', function () {
        init();
    })

    return {
        init: init,
        current: current,
        mailboxes: mailboxes,
        changeMailbox: changeMailbox
    }
});

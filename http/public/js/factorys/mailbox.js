'use strict'

app.factory('mailbox', function ($http, user, $rootScope, $cookies) {
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

    function findMailbox(id) {
        for(var i = 0; i<mailboxes.length; i++) {
            if(mailboxes[i]._id == id) {
                return mailboxes[i];
                break;
            }
        }
    }

    function getMailboxes() {
        return mailboxes;
    }

    function addMailbox(mailbox) {
        mailboxes.push(mailbox);
        $rootScope.$emit('mailboxesChange', mailboxes);
    }

    $rootScope.$on('userLoaded', function () {
        init();
    })

    return {
        init: init,
        current: current,
        changeMailbox: changeMailbox,
        getMailboxes: getMailboxes,
        addMailbox: addMailbox,
        findMailbox: findMailbox
    }
});

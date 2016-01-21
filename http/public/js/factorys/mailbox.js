app.factory('mailbox', function ($http, user, $rootScope, $cookies, $location) {
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
            if($cookies.get('lastMailbox')) {
                for (var i = 0; i < mailboxes.length; i++) {
                    if(mailboxes[i]._id == $cookies.get('lastMailbox')) {
                        current = mailboxes[i];
                    }
                    if(mailboxes.length == i+1) {
                        if(!current) {
                            current = mailboxes[0];
                        }
                        $rootScope.$emit('currentMailboxChange', current);
                        if($location.path() == "/") {
                            for (var j = 0; j < current.inboxes.length; j++) {
                                if(current.inboxes[j].type == "Inbox") {
                                    $location.path("/mailbox/"+current.inboxes[j]._id);
                                }
                            }
                        }
                        $('body').addClass('preloaded');
                    }
                }
            } else {
                current = mailboxes[0];
                $rootScope.$emit('currentMailboxChange', current);
                if($location.path() == "/") {
                    for (var k = 0; k < current.inboxes.length; k++) {
                        if(current.inboxes[k].type == "Inbox") {
                            $location.path("/mailbox/"+current.inboxes[k]._id);
                        }
                    }
                }
                $('body').addClass('preloaded');
            }
        }, function (res) {
            $cookies.remove('MailJS');
            $window.location.href = '/index.html?msg='+JSON.parse(res.data).error.message;
        });
    }

    function changeMailbox(id) {
        for(var i = 0; i<mailboxes.length; i++) {
            if(mailboxes[i]._id == id) {
                $cookies.put('lastMailbox', mailboxes[i]._id);
                current = mailboxes[i];
                for (var j = 0; j < current.inboxes.length; j++) {
                    if(current.inboxes[j].type == "Inbox") {
                        $location.path("/mailbox/"+current.inboxes[j]._id);
                    }
                }
                $rootScope.$emit('currentMailboxChange', current);
                break;
            }
        }
    }

    function findMailbox(id) {
        for(var i = 0; i<mailboxes.length; i++) {
            if(mailboxes[i]._id == id) {
                return mailboxes[i];
            }
        }
    }

    function getMailboxes() {
        return mailboxes;
    }

    function getCurrent() {
        return current;
    }

    function addMailbox(mailbox) {
        mailboxes.push(mailbox);
        $rootScope.$emit('mailboxesChange', mailboxes);
    }

    $rootScope.$on('userLoaded', function () {
        init();
    });

    return {
        init: init,
        getCurrent: getCurrent,
        changeMailbox: changeMailbox,
        getMailboxes: getMailboxes,
        addMailbox: addMailbox,
        findMailbox: findMailbox
    };
});

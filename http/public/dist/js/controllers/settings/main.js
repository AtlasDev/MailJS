'use strict';

app.controller("mainSettingsCtrl", function($scope, $rootScope, $translate) {
    $rootScope.isLoading = false;
    $scope.notifyToggle = $scope.checkNotify();
    $scope.hasNotiApi = ("Notification" in window);
    $scope.changeLanguage = function changeLanguage(lang) {
        var langKey
        switch(lang){
            case '':
                break;
            case 'English':
                langKey = 'enUS';
                break;
            case 'Nederlands':
                langKey = 'nlNL';
                break;
            default:
                langKey = 'enUS';
                break;
        }
        if(langKey != '') {
            $translate.use(langKey);
        }
    };
    $scope.askPerms = function () {
        if(!("Notification" in window)) {
            $scope.notifyToggle = false;
        }
        if($scope.notifyToggle == true) {
            if((Notification.permission === "granted")) {
                $scope.notifyToggle = true;
                localStorage.setItem('notifications', true);
            } else {
                $scope.notifyToggle = false;
                Notification.requestPermission(function (perm) {
                    if (perm === "granted") {
                        $scope.notifyToggle = true;
                        $scope.notifyTimeout = 1000;
                        var options = {
                              body: 'The notification system works! You will get a notification everytime you get a new E-mail. You can always disable it in the settings if it gets annoying.',
                              icon: '/favicon-96x96.png'
                        }
                        var notification = new Notification('Awesome!', options);
                        setTimeout(notification.close.bind(notification), 10000);
                        notification.onclick = function(x) {
                            window.focus();
                        };
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        } else {
            localStorage.setItem('notifications', false);
            return false;
        }
    }
});

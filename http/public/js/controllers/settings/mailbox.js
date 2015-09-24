'use strict';

app.controller("mailboxSettingsCtrl", function($scope, $rootScope, mailbox) {
    $rootScope.isLoading = false;
    $scope.blurCode = [];

    $rootScope.$on('mailboxesChange', function () {
        $scope.blurCode = [];
        for(var i = 0; i<mailbox.getMailboxes().length; i++) {
            $scope.blurCode.push(mailbox.getMailboxes()[i]._id);
        }
    })
    $scope.toggleCode = function (id) {
        if($scope.blurCode.indexOf(id) == -1) {
            $scope.blurCode.push(id);
        } else {
            $scope.blurCode.splice($scope.blurCode.indexOf(id), 1);
        }
    }
});

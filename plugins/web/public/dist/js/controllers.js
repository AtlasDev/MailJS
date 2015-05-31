'use strict';

app.controller("MailCtrl", function($scope, $cookies, $window, $translate, socket) {
    $scope.socketStatus = 0;
    $scope.user = {}
    $scope.user.firstName = "Dany";
    $scope.user.lastName = "Sluijk";
    $scope.user.email = "danysluyk@live.nl";
    $scope.user.permLevel = 0;
    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };
    socket.on('connect', function () {
        $scope.socketStatus = 2;
    });
    socket.on('disconnect', function () {
        $scope.socketStatus = 0;
    });
    socket.on('error', function (error) {
        $cookies.remove('jwt');
        $window.location.href = '/index.html?error='+error;
    });
    socket.on('reconnecting', function (error) {
        $scope.socketStatus = 1;
    });
});

app.controller("PageCtrl", function($scope) {
    $scope.title = "";
    $scope.subtitle = "";
});
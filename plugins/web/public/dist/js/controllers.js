'use strict';

app.controller("MailCtrl", function($scope, $window, $translate, socket) {
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
		console.log(error)
        localStorage.removeItem('jwt');
		var msg;
		switch(error.message) {
			case 'jwt malformed':
				msg = "Invailid token!";
				break;
			case 'jwt expired':
				msg = "Session timed-out!";
				break;
			default:
				msg = "Socket errored!";
				break;
		}
        $window.location.href = '/index.html?error='+msg;
    });
    socket.on('reconnecting', function (error) {
        $scope.socketStatus = 1;
    });
});

app.controller('mailController', function($scope) {
	$scope.message = 'Everyone come and see how good I look!';
	$scope.title = 'Mailbox';
	$scope.subtitle = '';
	$scope.mails = [
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1432737154000, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: false, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLsfdshbcjbdvsbffvsgjfvsdgjfvsnvdsnbdsvvhdsvvhdsvdshvnbTE 2.0 Issue', date: 1433168277937, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: false, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: false, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: true, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: false, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: false, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: false, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: true, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: false, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: false, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: false, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, starred: true, attachment: false},
	];
});
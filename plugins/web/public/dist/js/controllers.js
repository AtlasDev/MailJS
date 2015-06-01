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

app.controller('mailboxController', function($scope) {
	$scope.title = 'Mailbox';
	$scope.subtitle = '';
	$scope.orderItem = 'starred';
	$scope.reverse = true;
	$scope.page = 1;
	$scope.limit = 15;
	$scope.mails = [
		{from: 'Arfgnder Pierce', title: 'AdminLTE 2.0 Issue', date: 1432737154000, unread: true, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: true, starred: true, attachment: false},
		{from: 'Alexa Pierce', title: 'BdminLTE 2.0 Issue', date: 1431168277937, unread: true, starred: true, attachment: false},
		{from: 'Dany Sluijk', title: 'Mail test', date: 1430168277937, unread: true, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: true, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLsfdshbcjbdvsbffvsgjfvsdgjfvsnvdsnbdsvvhdsvvhdsvdshvnbTE 2.0 Issue', unread: false, date: 1433168277937, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: false, starred: false, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: false, starred: false, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: true, starred: true, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: false, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: false, starred: false, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: true, starred: false, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: false, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: true, starred: false, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: false, starred: true, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: true, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: false, starred: false, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: false, starred: false, attachment: true},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: true, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: false, starred: false, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: true, starred: true, attachment: false},
		{from: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, unread: false, starred: true, attachment: false},
	];
});
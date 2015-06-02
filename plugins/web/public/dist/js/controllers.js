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

app.controller('mailboxController', function($scope, socket) {
	$scope.title = 'Mailbox';
	$scope.subtitle = '';
	$scope.page = 1;
	$scope.limit = 15;
    $scope.toggleStar = function star(uuid) {
        for (var i in $scope.mails) {
            if ($scope.mails[i].uuid == uuid) {
                socket.emit('mail:star', {uuid: uuid, state: !$scope.mails[i].starred});
                break;
            }
        }
    }
    socket.on('mail:star', function(data){
        for (var i in $scope.mails) {
            if ($scope.mails[i].uuid == data.uuid) {
                $scope.mails[i].starred = data.state;
                break;
            }
        }
    });
    socket.on('mail:read', function(data){
        for (var i in $scope.mails) {
            if ($scope.mails[i].uuid == data.uuid) {
                $scope.mails[i].read = data.state;
                break;
            }
        }
    });
    socket.on('mail:delete', function(data){
        for (var i in $scope.mails) {
            if ($scope.mails[i].uuid == data.uuid) {
                delete $scope.mails[i];
                break;
            }
        }
    });
    socket.emit('mail:delete', {uuid: '6'});
	$scope.mails = [
		{uuid: '1', sender: 'Arfgnder Pierce', title: 'AdminLTE 2.0 Issue', date: 1432737154000, read: true, starred: true, attachment: false},
		{uuid: '2', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '3', sender: 'Alexa Pierce', title: 'BdminLTE 2.0 Issue', date: 1431168277937, read: true, starred: true, attachment: false},
		{uuid: '4', sender: 'Dany Sluijk', title: 'Mail test', date: 1430168277937, read: true, starred: true, attachment: false},
		{uuid: '5', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '6', sender: 'Alexander Pierce', title: 'AdminLsfdshbcjbdvsbffvsgjfvsdgjfvsnvdsnbdsvvhdsvvhdsvdshvnbTE 2.0 Issue', read: false, date: 1433168277937, starred: true, attachment: false},
		{uuid: '7', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: false},
		{uuid: '8', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: true},
		{uuid: '9', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: true},
		{uuid: '10', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: true, attachment: false},
		{uuid: '11', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: true},
		{uuid: '12', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: false, attachment: true},
		{uuid: '13', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: true, attachment: false},
		{uuid: '14', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: false, attachment: false},
		{uuid: '15', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: true, attachment: true},
		{uuid: '16', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '17', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: false},
		{uuid: '18', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: true},
		{uuid: '19', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '20', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: false},
		{uuid: '21', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '22', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: true, attachment: false},
	];
});
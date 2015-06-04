'use strict';

app.controller("MailCtrl", function($rootScope, $scope, $window, $translate, socket) {
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
	
	$rootScope.mails = [
		{uuid: '1', mailbox: 'Inbox', sender: 'Arfgnder Pierce', title: 'AdminLTE 2.0 Issue', date: 1432737154000, read: true, starred: true, attachment: false},
		{uuid: '2', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '3', mailbox: 'Inbox', sender: 'Alexa Pierce', title: 'BdminLTE 2.0 Issue', date: 1431168277937, read: true, starred: true, attachment: false},
		{uuid: '4', mailbox: 'Inbox', sender: 'Dany Sluijk', title: 'Mail test', date: 1430168277937, read: true, starred: true, attachment: false},
		{uuid: '5', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '6', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLsfdshbcjbdvsbffvsgjfvsdgjfvsnvdsnbdsvvhdsvvhdsvdshvnbTE 2.0 Issue', read: false, date: 1433168277937, starred: true, attachment: false},
		{uuid: '7', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: false},
		{uuid: '8', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: true},
		{uuid: '9', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: true},
		{uuid: '10', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: true, attachment: false},
		{uuid: '11', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: true},
		{uuid: '12', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: false, attachment: true},
		{uuid: '13', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: true, attachment: false},
		{uuid: '14', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: false, attachment: false},
		{uuid: '15', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: true, attachment: true},
		{uuid: '16', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '17', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: false},
		{uuid: '18', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: true},
		{uuid: '19', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '20', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: false},
		{uuid: '21', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '22', mailbox: 'Inbox', sender: 'Alexander Pierce', title: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: true, attachment: false},
	];
	
	//mail handling
    socket.on('mail:star', function(data){
        for(var i in $rootScope.mails) {
            if($rootScope.mails[i].uuid == data.uuid) {
                $rootScope.mails[i].starred = data.state;
                break;
            }
        }
    });
    socket.on('mail:read', function(data){
        for(var i in $rootScope.mails) {
            if($rootScope.mails[i].uuid == data.uuid) {
                $rootScope.mails[i].read = data.state;
                break;
            }
        }
    });
    socket.on('mail:delete', function(data){
        for(var i in $rootScope.mails) {
            if($rootScope.mails[i].uuid == data.uuid) {
                delete $rootScope.mails[i];
                break;
            }
        }
    });
});

app.controller('mailboxController', function($rootScope, $scope, socket) {
	$scope.title = 'Mailbox -> ';
	$scope.subtitle = '';
	$scope.mailbox = 'Inbox';
	$scope.page = 1;
	$scope.limit = 15;
	$scope.mailCount = 0;
    $scope.toggleStar = function star(uuid) {
        for(var i in $rootScope.mails) {
            if($rootScope.mails[i].uuid == uuid) {
                socket.emit('mail:star', {uuid: uuid, state: !$rootScope.mails[i].starred});
                break;
            }
        }
		return true;
    }
	$scope.selected = [];
	$scope.select = function select(uuid) {
		for(var i in $scope.selected) {
            if($scope.selected[i] == uuid) {
				delete $scope.selected[i];
                return true;
            }
        }
		$scope.selected.push(uuid);
		return true;
	}
	$scope.deleteSelected = function deleteSelected() {
		for(var i in $scope.selected) {
			socket.emit('mail:delete', {uuid: $scope.selected[i]});
			delete $scope.selected[i];
		}
		return true;
	}
	$scope.countMails = function countMails() {
		$scope.mailCount = 0;
		for(var i in $rootScope.mails) {
			if($rootScope.mails[i].mailbox == $scope.mailbox) {
				$scope.mailCount++;
			}
		}
	}
	$scope.selectAll = function selectAll() {
		for(var i in $rootScope.mails) {
			if($rootScope.mails[i].mailbox == $scope.mailbox) {
				$scope.selected.push($rootScope.mails[i].uuid);
			}
		}
	}
	$scope.countMails();
    socket.on('mail:delete', function(data){
        $scope.countMails();
    });
});
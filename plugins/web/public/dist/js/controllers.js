'use strict';

app.controller("MailCtrl", function($rootScope, $scope, $window, $translate, socket) {
    $rootScope.socketStatus = 0;
	$rootScope.isLoading = false;
    $scope.user = {}
    $scope.user.firstName = "Dany";
    $scope.user.lastName = "Sluijk";
    $scope.user.email = "danysluyk@live.nl";
    $scope.user.permLevel = 0;
    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };
    socket.on('connect', function () {
        $rootScope.socketStatus = 2;
    });
    socket.on('disconnect', function () {
        $rootScope.socketStatus = 0;
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
        $rootScope.socketStatus = 1;
    });
	
	$rootScope.mails = [
		{uuid: '1', mailbox: 'inbox', sender: 'Arfgnder Pierce', subject: 'AdminLTE 2.0 Issue', date: 1432737154000, read: true, starred: true, attachment: false},
		{uuid: '2', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '3', mailbox: 'inbox', sender: 'Alexa Pierce', subject: 'BdminLTE 2.0 Issue', date: 1431168277937, read: true, starred: true, attachment: false},
		{uuid: '4', mailbox: 'inbox', sender: 'Dany Sluijk', subject: 'Mail test', date: 1430168277937, read: true, starred: true, attachment: false},
		{uuid: '5', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '6', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLsfdshbcjbdvsbffvsgjfvsdgjfvsnvdsnbdsvvhdsvvhdsvdshvnbTE 2.0 Issue', read: false, date: 1433168277937, starred: true, attachment: false},
		{uuid: '7', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: false},
		{uuid: '8', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: true},
		{uuid: '9', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: true},
		{uuid: '10', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: true, attachment: false},
		{uuid: '11', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: true},
		{uuid: '12', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: false, attachment: true},
		{uuid: '13', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: true, attachment: false},
		{uuid: '14', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: false, attachment: false},
		{uuid: '15', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: true, attachment: true},
		{uuid: '16', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '17', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: false},
		{uuid: '18', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: true},
		{uuid: '19', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '20', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: false, attachment: false},
		{uuid: '21', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: true, starred: true, attachment: false},
		{uuid: '22', mailbox: 'inbox', sender: 'Alexander Pierce', subject: 'AdminLTE 2.0 Issue', date: 1433168277937, read: false, starred: true, attachment: false},
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

app.controller('mailboxController', function($rootScope, $routeParams, $scope, socket) {
	$scope.title = 'Mailbox';
	$scope.subtitle = '';
	$scope.mailbox = $routeParams.mailbox;
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

app.controller('mailController', function($rootScope, $scope, $routeParams, $location, toaster, socket) {
	$rootScope.isLoading = true;
	socket.emit('mail:get', {uuid: $routeParams.uuid});
	socket.on('mail:get', function(data) {
		if(data.err) {
			toaster.pop('error', "Could not get the mail", data.err);
			$rootScope.isLoading = false;
			$location.path('#/mailbox/inbox');
		} else {
			$scope.subject = data.data.subject;
			$scope.sender = data.data.sender;
			$scope.date = data.data.date;
			$scope.content = data.data.content;
			$scope.attachment = data.data.attachment;
			socket.emit('mail:read', {uuid: $routeParams.uuid, state: true});
			$rootScope.isLoading = false;
		}
	});
});
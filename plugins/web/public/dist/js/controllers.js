'use strict';

app.controller("MailCtrl", function($rootScope, $scope, $window, $translate, socket) {
    $rootScope.socketStatus = 0;
	$rootScope.isLoading = false;
	$rootScope.mails = [];
    $scope.user = {};
    $scope.user.firstName = "Dany";
    $scope.user.lastName = "Sluijk";
    $scope.user.email = "danysluyk@live.nl";
    $scope.user.permLevel = 0;
	$scope.logout = function logout(){
		localStorage.removeItem('jwt');
        $window.location.href = '/index.html?info=true&msg=Logout Succesfull, goodbye!';
	}
    $scope.changeLanguage = function changeLanguage(langKey) {
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
        $window.location.href = '/index.html?msg='+msg;
    });
    socket.on('reconnecting', function (error) {
        $rootScope.socketStatus = 1;
    });	
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

app.controller('mailboxController', function($rootScope, $routeParams, $scope, socket, toaster) {
	$rootScope.isLoading = true;
	$scope.title = 'Mailbox';
	$scope.mailbox = $routeParams.mailbox;
	$scope.page = 1;
	$scope.limit = 15;
	$scope.mailCount = 0;
	$scope.selected = [];
    $scope.toggleStar = function toggleStar(uuid) {
        for(var i in $rootScope.mails) {
            if($rootScope.mails[i].uuid == uuid) {
                socket.emit('mail:star', {uuid: uuid, state: !$rootScope.mails[i].starred});
                break;
            }
        }
		return true;
    }
	$scope.select = function select(uuid) {
		for(var i in $scope.selected) {
            if($scope.selected[i] == uuid) {
				delete $scope.selected[i];
                return true;
            } else {
				$scope.selected.push(uuid);
				return true;
			}
        }
	}
	$scope.deleteSelected = function deleteSelected() {
		var delCount = 0;
		for(var i in $scope.selected) {
			socket.emit('mail:delete', {uuid: $scope.selected[i]});
			delete $scope.selected[i];
			delCount++;
		}
		if(delCount > 0) {
			toaster.pop('success', "Selected items have been deleted.", delCount+' items have been deleted.');
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
			if($scope.selected.indexOf($rootScope.mails[i].uuid) == -1) {	
				if($rootScope.mails[i].mailbox == $scope.mailbox) {
					$scope.selected.push($rootScope.mails[i].uuid);
				}
			}
		}
	}
	socket.on('mail:list', function(data) {
		$rootScope.isLoading = false;
		data.mails.forEach(function(data) {
			$rootScope.mails.push(data);
		});
		$scope.countMails();
	});
	socket.on('mail:delete', function(data) {
		if(data.err != null){
			$scope.countMails();
		}
	});
	socket.emit('mail:list', {mailbox: $scope.mailbox});
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
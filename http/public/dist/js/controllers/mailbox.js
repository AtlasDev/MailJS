'use strict';

app.controller('mailboxCtrl', function($rootScope, $routeParams, $scope, socket, toaster) {
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
			toastr.success("Selected items have been deleted.", delCount+' items have been deleted.');
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
	socket.on('mail:delete', function(data) {
		if(data.err != null){
			$scope.countMails();
		}
	});
	if($rootScope.mailboxes.indexOf($scope.mailbox) > -1) {
		$rootScope.isLoading = false;
		$scope.countMails();
	} else {
		socket.emit('mail:list', {mailbox: $scope.mailbox});
		$rootScope.mailboxes.push($scope.mailbox);
	}
});

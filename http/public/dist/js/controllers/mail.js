'use strict';

app.controller('mailCtrl', function($rootScope, $scope, $routeParams, $location, toaster, socket) {
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

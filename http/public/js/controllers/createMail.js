'use strict';

app.controller('createMailCtrl', function($rootScope, $scope, notification) {
	$rootScope.isLoading = false;

	$scope.sendMail = function () {
		if(!$scope.to || $scope.to == 'undefined') {
			return notification.send('Cannot send mail!', 'No senders filled in.', 'error');
		}
		if(!$scope.subject || $scope.subject == 'undefined') {
			return notification.send('Cannot send mail!', 'No subject filled in.', 'error');
		}
		$rootScope.isLoading = true;
		var to = $scope.to.replace(' ', '').split(';');
		var subject = $scope.subject;
		var html = $('#compose-textarea').val();
	}

	$(function () {
	    $("#compose-textarea").wysihtml5({
			toolbar: {
				"fa": true
			}
		});
	});
});

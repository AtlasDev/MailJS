(function () {
'use strict';

app.controller('mailCtrl', function($rootScope, $scope, $routeParams, $location, user, $http, notification) {
	$rootScope.isLoading = true;
	$scope.mail = {};

	var init = function () {
		var req = {
			method: 'GET',
			url: '/api/v1/email/' + $routeParams.uuid,
			headers: {
				'x-token': user.sessionID
			}
		};
		$http(req).then(function(res) {
			$rootScope.isLoading = false;
			$scope.mail = res.data.mail;
		}, function(res) {
			$rootScope.isLoading = false;
			notification.send('Could not get mail!', res.data.message, 'error');
			$location.path('#/');
		});
	};

    if(typeof user.getUser()._id == 'undefined') {
        $rootScope.$on('userLoaded', function () {
            init();
        });
    } else {
        init();
    }
});
}());

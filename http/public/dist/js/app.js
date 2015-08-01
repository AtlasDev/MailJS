'use strict';

var app = angular.module("mail", ['ngRoute', 'angular-jwt', 'ui.gravatar', 'ngCookies', 'pascalprecht.translate', 'ngAnimate', 'toaster']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/mailbox/:mailbox', {
			templateUrl : 'pages/mailbox.html',
			controller  : 'mailboxController'
		})
		.when('/mail/:uuid', {
			templateUrl : 'pages/mail.html',
			controller  : 'mailController'
		}).
		otherwise({
			redirectTo: '/mailbox/inbox'
		});
});

app.config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '/lang/',
        suffix: '.json'
    });
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useCookieStorage();
    $translateProvider.preferredLanguage('enUS');
});

app.filter('capitalize', function () {
    return function (input) {
		if (!input) {
			return input;
		}
		return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    };
});

app.filter('firstLetter', function () {
    return function (input) {
		if (!input) {
			return input;
		}
		return input.charAt(0);
    };
});

$(document).ready(function() {	
	setTimeout(function(){
		$('body').addClass('preloaded');
	}, 500);
});
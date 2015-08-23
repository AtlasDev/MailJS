'use strict';

var app = angular.module("mail", ['ngRoute', 'ui.gravatar', 'ngCookies', 'pascalprecht.translate', 'ngAnimate', 'toaster']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/mailbox/:mailbox', {
			templateUrl : 'pages/mailbox.html',
			controller  : 'mailboxCtrl'
		})
		.when('/mail/:uuid', {
			templateUrl : 'pages/mail.html',
			controller  : 'mailCtrl'
		})
		.when('/mainSettings', {
			templateUrl : 'pages/settings/main.html',
			controller  : 'mainSettingsCtrl'
		})
		.when('/mailboxSettings', {
			templateUrl : 'pages/settings/mailbox.html',
			controller  : 'mailboxSettingsCtrl'
		})
		.when('/sessionSettings', {
			templateUrl : 'pages/settings/sessions.html',
			controller  : 'sessionsSettingsCtrl'
		})
		.otherwise({
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

app.filter('group', function () {
    return function (input) {
		var name;
		if(input == '1') {
			name = 'User';
		} else if(input == '2') {
			name = 'Moderator';
		} else if(input == '3') {
			name = 'Administrator';
		} else {
			name = input;
		}
		return name;
    };
});

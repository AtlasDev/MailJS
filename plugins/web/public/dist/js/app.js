'use strict';

var app = angular.module("mail", ['ngRoute', 'angular-jwt', 'ui.gravatar', 'ngCookies', 'pascalprecht.translate']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'pages/mailbox.html',
			controller  : 'mailboxController'
		})
		.when('/mail', {
			templateUrl : 'pages/mail.html',
			controller  : 'mailController'
		})
		.when('/contact', {
			templateUrl : 'pages/contact.html',
			controller  : 'contactController'
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
var app = angular.module("mail", ['ngRoute', 'ui.gravatar', 'ngCookies', 'pascalprecht.translate', 'ngAnimate', 'toastr', 'monospaced.qrcode', 'ngMask']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/mailbox/:mailbox', {
			templateUrl : 'pages/mailbox.html',
			controller  : 'mailboxCtrl'
		})
		.when('/create', {
			templateUrl : 'pages/createMail.html',
			controller  : 'createMailCtrl'
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
		.when('/sessionSettings', {
			templateUrl : 'pages/settings/sessions.html',
			controller  : 'sessionsSettingsCtrl'
		})
		.when('/oauthSettings', {
			templateUrl : 'pages/settings/oauth.html',
			controller  : 'oauthSettingsCtrl'
		})
		.when('/userSettings', {
			templateUrl : 'pages/settings/users.html',
			controller  : 'userSettingsCtrl'
		})
		.otherwise({
			redirectTo: '/'
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

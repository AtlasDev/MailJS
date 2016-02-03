var app = angular.module("mail", ['ngRoute', 'ngWebSocket', 'ngCookies', 'angular-md5', 'pascalprecht.translate', 'ngAnimate', 'toastr', 'monospaced.qrcode', 'ngMask', 'ngSanitize']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/mailbox/:inbox', {
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

app.filter('dateFilter', function () {
    return function (input) {
		if (!input) {
			return input;
		}
		var now = new Date();
		input = new Date(input);
		if(input.getFullYear() == now.getFullYear() && input.getMonth() == now.getMonth() && input.getDate() == now.getDate()) {
			return input.toLocaleTimeString();
		} else {
			return input.toLocaleDateString();
		}
    };
});

app.filter('bytes', function() {
	return function(bytes, precision) {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		if (typeof precision === 'undefined') precision = 1;
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
	};
});

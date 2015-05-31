'use strict';

var app = angular.module("mail", ['angular-jwt', 'ui.gravatar', 'ngCookies', 'pascalprecht.translate']);

app.config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '/lang/',
        suffix: '.json'
    });
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useCookieStorage();
    $translateProvider.preferredLanguage('enUS');
});
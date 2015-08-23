'use strict';

app.controller("mainSettingsCtrl", function($scope, $rootScope, $translate) {
    $rootScope.isLoading = false;
    $scope.changeLanguage = function changeLanguage(lang) {
        var langKey
        switch(lang){
            case '':
                break;
            case 'English':
                langKey = 'enUS';
                break;
            case 'Nederlands':
                langKey = 'nlNL';
                break;
            default:
                langKey = 'enUS';
                break;
        }
        if(langKey != '') {
            $translate.use(langKey);
        }
    };
});

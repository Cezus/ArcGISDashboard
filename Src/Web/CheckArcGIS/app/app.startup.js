(function (angular) {
    var dashboardApp = angular.module('arcGISDashboard', []);

    dashboardApp.config(['$httpProvider', function ($httpProvider) {
        //$httpProvider.defaults.useXDomain = true;
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);
})(window.angular);
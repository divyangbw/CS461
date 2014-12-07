angular.module('reports.controllers')
    .controller('HomeCtrl', function ($scope, $state, $ionicViewService, $filter, $rootScope, $timeout, User, ApiService, DataFactory) {

        init();

        function init() {
            User.authCheck();
        }

        $scope.test = function() {
            ApiService.getResource().then(function(data) {
                console.log(data);
            }, function (err) {
                console.log("error");
            });
        }

    });
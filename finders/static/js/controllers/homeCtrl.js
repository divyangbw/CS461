angular.module('reports.controllers')
    .controller('HomeCtrl', function ($scope, $state, $ionicViewService, $filter, $rootScope, $timeout, User, ApiService, DataFactory) {

        init();

        function init() {
            User.authCheck();
        }

        ApiService.getMyAssignments().then(function(data) {
            $scope.myAssign = data;
        }, function (err) {
            console.log("error");
            console.log(err);
        });

    });
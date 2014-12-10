angular.module('reports.controllers')
    .controller('HomeCtrl', function ($scope, $state, $ionicViewService, $filter, $rootScope, $timeout, User, ApiService, TempDataFactory) {

        $scope.incomplete = [];
        $scope.toStart = [];
        $scope.completed = [];
        $scope.isAdmin = User.isAdmin();

        init();
        getData();

        function init() {
            User.authCheck();
        }

        function getData() {
            TempDataFactory.refreshMyAssignments(false).then(function(result){
                $scope.completed = TempDataFactory.getCompletedAssignments();
                $scope.incomplete = TempDataFactory.getIncompleteAssignments();
                $scope.toStart = TempDataFactory.getNotStartedAssignments();
                console.log($scope.toStart)
            });
        }

    });
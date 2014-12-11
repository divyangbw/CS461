angular.module('reports.controllers').controller('ResultsCtrl', function ($scope, $state, DataFactory, $ionicModal, TempDataFactory) {

    $scope.loadingData = true;
    $scope.newsCasts = {};
    $scope.castSegments = {};
    $scope.completed = [];

    getData();

    function getData() {
        TempDataFactory.refreshMyAssignments(false).then(function () {
            $scope.completed = TempDataFactory.getCompletedAssignments();
        });
    }

    DataFactory.getCasts().then(function (result) {
        $scope.newsCasts = result;
        console.log($scope.newsCasts);
    }, function (err) {
        console.log("Error");
    });

    DataFactory.getSegments().then(function (result) {
        $scope.castSegments = result;
    }, function (err) {
        console.log("Error");
    });
    
});
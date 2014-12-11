angular.module('reports.controllers').controller('ResultsCtrl', function ($scope, $state, DataFactory, $ionicModal, TempDataFactory) {

    $scope.loadingData = true;
    $scope.newsCasts = [];
    $scope.castSegments = [];
    $scope.completed = [];

    getData();

    function getData() {
        TempDataFactory.refreshMyAssignments(false).then(function () {
            $scope.completed = TempDataFactory.getCompletedAssignments();
            console.log($scope.completed);
        });
    }

    DataFactory.getCasts().then(function (result) {
        //result.forEach(function (cast) {
        //   cast.segments.forEach(function (segment) {
        //       $.scope.completed.forEach(function(completedItem) {
        //          if (completedItem.segment === segment) {
        //              $scope.castSegments.push(cast);
        //          }
        //       });
        //   }) ;
        //});
    }, function (err) {
        console.log("Error");
    });

    DataFactory.getSegments().then(function (result) {
        $scope.castSegments = result;
    }, function (err) {
        console.log("Error");
    });


});
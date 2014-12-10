angular.module('reports.controllers').controller('ResultsCtrl', function ($scope, $state, DataFactory, $ionicModal) {

    $scope.loadingData = true;
    $scope.newsCasts = {};
    $scope.castSegments = {};

    DataFactory.getCasts().then(function (result) {
        $scope.newsCasts = result;

        result.forEach(function (cast) {
            $scope.castSegments += DataFactory.getSegmentsForCast(cast);
        });


    }, function (err) {
        console.log("Error");
    });

    DataFactory.getSegments().then(function (result) {
        $scope.castSegments = result;
    }, function (err) {
        console.log("Error");
    });
});

angular.module('reports.controllers').controller('SegmentsCtrl', function ($scope, DataFactory, $ionicPopup, $ionicModal, User) {

    $scope.activeCast = DataFactory.getActiveCast();
    DataFactory.getSegments().then(function (result) {
        $scope.castSegments = result;
    }, function (err) {
        console.log("Error")
    })
});
angular.module('reports.controllers').controller('ResultsCtrl', function ($scope, $state, DataFactory, $ionicModal) {

    $scope.loadingData = true;

    $scope.newsCasts = {};
    $scope.castSegments = {};

    $scope.goToSegments = function (item) {
        DataFactory.setActiveCast(item);

        DataFactory.getSegments().then(function (res) {
            $scope.castSegments = res;
        }, function (err) {
            console.log("Error");
        });
        $state.go('tab.segments');
    };

    DataFactory.getCasts().then(function (result) {
        $scope.newsCasts = result;
        //$scope.loadingData = true;
    }, function (err) {
        console.log("Error");


    });
});

angular.module('reports.controllers').controller('SegmentsCtrl', function ($scope, DataFactory, $ionicPopup, $ionicModal, User) {

    $scope.activeCast = DataFactory.getActiveCast();
    console.log($scope.activeCast)
    DataFactory.getSegments().then(function (result) {
        $scope.castSegments = result;
    }, function (err) {
        console.log("Error")
    })
});
angular.module('reports.controllers').controller('NewsCastsCtrl', function ($scope, $state, DataFactory, User) {

    $scope.loadingData = true;

    $scope.newsCasts = {};
    $scope.castSegments = {};

    $scope.goToSegments = function(item) {
        var cast = item;
        DataFactory.setActiveCast(cast);

        DataFactory.getSegments().then(function (res){
            $scope.castSegments = res;
        }, function (err) {
            console.log("Error");
        });
        $state.go('tab.segments');



    }


    DataFactory.getCasts().then(function (result){
        $scope.newsCasts = result;
        //$scope.loadingData = true;
    }, function (err) {
        console.log("Error");
    });

});

angular.module('reports.controllers').controller('SegmentsCtrl', function ($scope, DataFactory, User) {
    DataFactory.getSegments().then(function (result){
        $scope.castSegments = result;
    }, function (err) {
        console.log("Error")
    })

});
angular.module('reports.controllers').controller('NewsCastsCtrl', function ($scope, $state, DataFactory, $ionicPopup, $ionicModal, User) {

    $scope.loadingData = true;

    $scope.newsCasts = {};
    $scope.castSegments = {};
    $scope.form = {};

    $scope.goToSegments = function (item) {
        DataFactory.setActiveCast(item);

        DataFactory.getSegments().then(function (res) {
            $scope.castSegments = res;
        }, function (err) {
            console.log("Error");
        });
        $state.go('tab.segments');

    };


    $scope.saveCast = function (item) {
        DataFactory.createCast(item).then(function (response) {
            $scope.createEditModal.hide();
            $scope.cast = {};
        }, function (err) {

        });

    };

    $scope.deleteCast = function () {
        // An elaborate, custom popup
        var temp = $scope.cast;
        DataFactory.deleteCast(temp).then(function (response) {
            //$scope.createEditModal.close();
            $scope.cast = {};
        }, function (err) {

        });
        console.log($scope.cast);
    };


    DataFactory.getCasts().then(function (result) {
        $scope.newsCasts = result;
        //$scope.loadingData = true;
    }, function (err) {
        console.log("Error");


    });


    $ionicModal.fromTemplateUrl('newCast.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createEditModal = modal;
    });
    // When the new question button is clicked
    $scope.newCast = function () {
        // Show the modal
        $scope.isEditing = false;
        $scope.form = {};
        $scope.createEditModal.show();
    }

});

angular.module('reports.controllers').controller('SegmentsCtrl', function ($scope, DataFactory, $ionicPopup, $ionicModal, User) {

    $scope.activeCast = DataFactory.getActiveCast();
    console.log($scope.activeCast)
    DataFactory.getSegments().then(function (result) {
        $scope.castSegments = result;
    }, function (err) {
        console.log("Error")
    })

    $ionicModal.fromTemplateUrl('editCast.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createEditModal = modal;
    });
    $ionicModal.fromTemplateUrl('editSegment.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createEditSegModal = modal;
    });


    $scope.editSegment = function (item) {
        // Set the editItem to what we want to edit. That way we can pre-fill the form.
        $scope.isEditing = true;
        $scope.editItem = item;
        // Show the modal
        $scope.createEditModal.show();
    }
    $scope.saveSeg = function (item) {
        DataFactory.createSegment(item).then(function (response) {
            $scope.createEditSegModal.hide();
            $scope.segments = {};
        }, function (err) {

        });

    };

    $scope.deleteSegment = function () {
        // An elaborate, custom popup
        var temp = $scope.cast;
        DataFactory.deleteCast(temp).then(function (response) {
            //$scope.createEditModal.close();
            $scope.cast = {};
        }, function (err) {

        });
        console.log($scope.cast);

    };
    $scope.updateCast = function (item) {
        // An elaborate, custom popup
        DataFactory.updateCast(item).then(function (response) {
            $scope.createEditModal.hide();
            $scope.cast = {};
        }, function (err) {

        });
        console.log($scope.cast);

    };
    $scope.editCast = function (item) {
        $scope.form = item;
        // Show the modal
        $scope.createEditModal.show();
    }
    //When the add button is clicked
    $scope.newSegment = function () {
        // Show the modal
        $scope.isEditing = false;
        $scope.seg = {};
        $scope.createEditSegModal.show();
    }

});
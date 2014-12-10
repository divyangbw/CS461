angular.module('reports.controllers').controller('NewsCastsCtrl', function ($scope, $state, DataFactory, $ionicPopup, $ionicModal, User) {

    $scope.loadingData = true;
    $scope.newsCasts = {};
    $scope.castSegments = {};
    $scope.form = {};

    $scope.goToSegments = function (item) {
        //Set the active cast to the cast that is being displated
        DataFactory.setActiveCast(item);
        //Get the segments of the active cast
        DataFactory.getSegments().then(function (res) {
            $scope.castSegments = res;
        }, function (err) {
            console.log(err);
        });
        $state.go('tab.segments');

    };

    // Saving cast after clicking ADD CAST button
    $scope.saveCast = function (item) {
        DataFactory.createCast(item).then(function (response) {
            $scope.createEditCastModal.hide();
            $scope.newsCasts = response;
        }, function (err) {
            console.log(err);
        });

    };

    //Deleting cast after clicking delete button
    // Does not work as of 12/7/14
    $scope.deleteCast = function (item) {
        // An elaborate, custom popup
        console.log("Ctrl.Del reached");
        console.log($scope.cast);
        var temp = $scope.cast;
        DataFactory.deleteCast(item).then(function (response) {
            $scope.cast = {};
        }, function (err) {

        });
    };


    DataFactory.getCasts().then(function (result) {
        $scope.newsCasts = result;
        //$scope.loadingData = true;
    }, function (err) {
        console.log("Error");
    });

    //Creates the edit cast popup window
    $ionicModal.fromTemplateUrl('newCast.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createEditCastModal = modal;
    });

    // Display the popup when the ADD CAST button is fixed
    $scope.newCast = function () {
        // Show the modal
        $scope.isEditing = false;
        $scope.form = {};
        $scope.createEditCastModal.show();
    };

});

//Segments.html Controller
angular.module('reports.controllers').controller('SegmentsCtrl', function ($scope, $state, DataFactory, $ionicPopup, $ionicModal, User) {

    $scope.activeCast = DataFactory.getActiveCast();
    $scope.segmentForm = {};
    $scope.test = function(test) {
        alert("hi")
    }

    DataFactory.getSegments().then(function (result) {
        $scope.castSegments = result;
    }, function (err) {
        console.log("Error")
    });

    //Creates the edit cast popup
    $ionicModal.fromTemplateUrl('editCast.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createEditCastModal = modal;
    });
    // Creates the Edit segment popup
    $ionicModal.fromTemplateUrl('editSegment.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createEditSegModal = modal;
    });


    $scope.editSegment = function (item) {
        // Show the modal
        console.log(item);
        $scope.isEditing = true;
        $scope.segmentForm = item;
        $scope.createEditSegModal.show();
    };
    $scope.saveSeg = function (item) {
        DataFactory.createSegment(item).then(function (response) {
            $scope.createEditSegModal.hide();
            $scope.castSegments = response;
        }, function (err) {

        });

    };

    $scope.deleteSegment = function () {
        // An elaborate, custom popup
        var temp = $scope.cast;
        DataFactory.deleteSegment(temp).then(function (response) {
            //$scope.createEditCastModal.close();
            $scope.cast = {};
        }, function (err) {

        });
    };
    //When the update cast button is clicked
    $scope.updateCast = function (item) {
        // An elaborate, custom popup
        DataFactory.updateCast(item).then(function (response) {
            $scope.createEditCastModal.hide();
            $scope.cast = {};
        }, function (err) {

        });
    };

    $scope.editCast = function (item) {
        $scope.form = item;
        $scope.isEditing = true;
        // Show the modal
        $scope.createEditCastModal.show();
    };

    //When the add segment button is clicked
    $scope.newSegment = function () {
        // Show the modal
        console.log("newSegment")
        $scope.isEditing = false;
        $scope.segmentForm = {};
        $scope.createEditSegModal.show();
    };
    //When the update cast button is clicked
    $scope.updateSeg = function (item) {
        // An elaborate, custom popup
        console.log("Controller")
        console.log(item)
        DataFactory.updateSegment(item).then(function (response) {
            $scope.createEditSegModal.hide();
            $scope.cast = {};
        }, function (err) {

        });

    };

//    TODO:
//        Add deletion verification
    $scope.deleteCast = function (item) {
        // An elaborate, custom popup
        console.log("Ctrl.Del reached");
        console.log($scope.cast);
        var temp = $scope.cast;
        DataFactory.deleteCast($scope.activeCast).then(function (response) {
            $scope.cast = {};
        }, function (err) {

        });
        $state.go('tab.newsCasts');
    };
});
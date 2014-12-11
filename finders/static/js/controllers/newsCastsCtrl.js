angular.module('reports.controllers').controller('NewsCastsCtrl', function ($scope, $state, DataFactory, $ionicPopup, $ionicModal, User) {

    $scope.loadingData = true;
    $scope.newsCasts = {};
    $scope.castSegments = {};
    $scope.castForm = {};

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
        $scope.castForm = {};
        $scope.createEditCastModal.show();
    };

});

//Segments.html Controller
angular.module('reports.controllers').controller('SegmentsCtrl', function ($scope, $state, DataFactory, $ionicPopup, $ionicModal, User) {

    var tempCast = {};
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


    $scope.editSegment = function (item, index) {
        // Show the modal
        console.log(item);
        tempCast = {index:index, data:item};
        $scope.isEditing = true;
        $scope.segmentForm = item;
        $scope.createEditSegModal.show();
    };
    $scope.closeEditSegment = function () {
        console.log("Temp:" + tempCast.index, tempCast.data);
        $scope.castSegments[tempCast.index] = tempCast.data;
        $scope.createEditSegModal.hide();
    };
    $scope.saveSeg = function (item) {
        DataFactory.createSegment(item).then(function (response) {
            $scope.createEditSegModal.hide();
            $scope.castSegments = response;
        }, function (err) {

        });

    };




    //When the update cast button is clicked
    $scope.updateCast = function (item) {
        DataFactory.updateCast(item).then(function (response) {
            $scope.activeCast = response;
            $scope.createEditCastModal.hide();
        }, function (err) {

        });
    };

    $scope.editCast = function (item) {
        tempCast = item;
        $scope.isEditing = true;
        $scope.castForm = item;
        $scope.createEditCastModal.show();
    };
    $scope.closeEditCast = function() {
        $scope.castForm = tempCast;
        $scope.createEditCastModal.hide();
    }


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
        DataFactory.updateSegment(item).then(function (response) {
            $scope.createEditSegModal.hide();
        }, function (err) {

        });

    };

//    TODO:
//        Add deletion verification
    $scope.deleteCast = function (item) {

        var temp = $scope.cast;
        DataFactory.deleteCast($scope.activeCast).then(function (response) {
            $scope.cast = {};
        }, function (err) {

        });
        $state.go('tab.newsCasts');
    };

//     $scope.deleteSegment = function () {
//         var temp = $scope.seg;
//        DataFactory.deleteSegment().then(function (response) {
//            $scope.seg = {};
//        }, function (err) {
//
//        });
//        $state.go('tab.segments');
//    };
});
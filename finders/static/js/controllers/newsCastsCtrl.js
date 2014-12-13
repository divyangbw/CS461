// Controller for the NewsCast page
angular.module('reports.controllers').controller('NewsCastsCtrl', function ($scope, $state, DataFactory, $ionicPopup, $ionicModal, User) {
    // Display something when loading
    $scope.loadingData = true;
    // All of the casts
    $scope.newsCasts = {};
    // The segments of the ActiveCast
    $scope.castSegments = {};
    // The fields for editing and creating a new Cast
    $scope.castForm = {};

    // Clicking a cast sends it to a new page
    // where the segments are displayed
    $scope.goToSegments = function (item) {
        //Set the active cast to the cast that is being displayed
        DataFactory.setActiveCast(item);
        //Get the segments of the active cast
        DataFactory.getSegments().then(function (res) {
            $scope.castSegments = res;
        }, function (err) {
            console.log(err);
        });
        // Go to the segments page
        $state.go('tab.segments');
    };


    // Loading all casts to display
    DataFactory.getCasts().then(function (result) {
        $scope.newsCasts = result;
    }, function (err) {
        console.log("Loading Casts failed!");
    });

    //Creates the Cast Popup Window from the newCast.html Template
    $ionicModal.fromTemplateUrl('newCast.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createEditCastModal = modal;
    });

    // Displays the popup when the ADD CAST button is clicked
    $scope.newCast = function () {
        // Show the modal
        $scope.isEditing = false;
        $scope.castForm = {};
        $scope.createEditCastModal.show();
    };

    // Saving cast after clicking "Save" inside
    // New Cast popup
    $scope.saveCast = function (item) {
        DataFactory.createCast(item).then(function (response) {
            $scope.createEditCastModal.hide();
            $scope.newsCasts = response;
        }, function (err) {
            console.log(err);
        });

    };
    // Closes the popup and resets the fields back to what they were
    // when the window was open
    $scope.closeEditCast = function () {
        $scope.castForm = { };
        $scope.createEditCastModal.hide();
    }

});

//Segments.html Controller
angular.module('reports.controllers').controller('SegmentsCtrl', function ($scope, $state, DataFactory, $ionicPopup, $ionicModal, User) {

    var tempCast = {};
    // Sets the activeCast
    $scope.activeCast = DataFactory.getActiveCast();
     // The fields for editing and creating a new Cast
    $scope.segmentForm = {};

    //Returns the segments of the activeCast
    DataFactory.getSegments().then(function (result) {
        $scope.castSegments = result;
    }, function (err) {
        console.log("Loading Segments failed!")
    });

    //Creates the edit cast popup
    $ionicModal.fromTemplateUrl('editCast.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createEditCastModal = modal;
    });


    // Display the popup when the edit cast button is clicked
    $scope.editCast = function (item) {
        tempCast = angular.copy(item);
        $scope.isEditing = true;
        $scope.castForm = item;
        $scope.createEditCastModal.show();
    };
    // Close the popup and set the fields back to what they were when the popup was opened
    $scope.closeEditCast = function () {
        $scope.activeCast = tempCast;
        $scope.castForm = { };
        $scope.createEditCastModal.hide();
    };

    //Save the cast when the update button is clicked inside the edit cast popup
    $scope.updateCast = function (item) {
        DataFactory.updateCast(item).then(function (response) {
            $scope.activeCast = response;
            $scope.createEditCastModal.hide();
        }, function (err) {

        });
    };

    // Delete that cast and go back to the newsCasts page
    $scope.deleteCast = function (item) {

        var temp = $scope.cast;
        DataFactory.deleteCast($scope.activeCast).then(function (response) {
            $scope.cast = {};
        }, function (err) {

        });
        $state.go('tab.newsCasts');
    };

    // Creates the Edit segment popup
    $ionicModal.fromTemplateUrl('editSegment.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.createEditSegModal = modal;
    });

    // Display the popup when clicking on a segment
    $scope.editSegment = function (item, index) {
        // Show the edit segment modal
        tempCast = {index: index, data: angular.copy(item)};
        $scope.isEditing = true;
        $scope.segmentForm = item;
        $scope.createEditSegModal.show();
    };
    // Close the popup and set the fields back to what they were when the popup was opened
    $scope.closeEditSegment = function () {
        $scope.castSegments[tempCast.index] = tempCast.data;
        $scope.createEditSegModal.hide();
    };

    // Save the segment when the save button is clicked inside a New Segment window
    $scope.saveSeg = function (item) {
        DataFactory.createSegment(item).then(function (response) {
            $scope.createEditSegModal.hide();
            $scope.castSegments = response;
        }, function (err) {

        });

    };

    //Display the new segment popup when the add segment button is clicked
    $scope.newSegment = function () {
        // Show the modal
        console.log("newSegment")
        $scope.isEditing = false;
        $scope.segmentForm = {};
        $scope.createEditSegModal.show();
    };

    //Save the segment when the update button is clicked inside the edit segment popup
    $scope.updateSeg = function (item) {
        // An elaborate, custom popup
        DataFactory.updateSegment(item).then(function (response) {
            $scope.createEditSegModal.hide();
        }, function (err) {

        });

    };

    // Delete the segment and close the edit segment popup
    $scope.deleteSegment = function (item, index) {
        DataFactory.deleteSegment(item, index).then(function (response) {
            $scope.castSegments = response;
        }, function (err) {

        });
        $scope.createEditSegModal.hide();
    };
});
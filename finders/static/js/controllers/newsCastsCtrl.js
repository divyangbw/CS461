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
    $scope.deleteCast = function () {
        // An elaborate, custom popup
        var temp = $scope.cast;
        DataFactory.deleteCast(temp).then(function (response) {
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
    }

});

//Segments.html Controller
angular.module('reports.controllers').controller('SegmentsCtrl', function ($scope, DataFactory, $ionicPopup, $ionicModal, User) {

    $scope.activeCast = DataFactory.getActiveCast();


    DataFactory.getSegments().then(function (result) {
        $scope.castSegments = result;
    }, function (err) {
        console.log("Error")
    })

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
        // Set the editItem to what we want to edit. That way we can pre-fill the form.
        $scope.isEditing = true;
        $scope.editItem = item;
        // Show the modal
        $scope.createEditCastModal.show();
    }
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
        DataFactory.deleteCast(temp).then(function (response) {
            //$scope.createEditCastModal.close();
            $scope.cast = {};
        }, function (err) {

        });
        console.log($scope.cast);

    };
    //When the update cast button is clicked
    $scope.updateCast = function (item) {
        // An elaborate, custom popup
        DataFactory.updateCast(item).then(function (response) {
            $scope.createEditCastModal.hide();
            $scope.cast = {};
        }, function (err) {

        });
        console.log($scope.cast);

    };
    //TODO: GET UPDATE TO WORK
    $scope.editCast = function (item) {
        $scope.form = item;
        $scope.isEditing = true;
        // Show the modal
        $scope.createEditCastModal.show();
    }

    //When the add segment button is clicked
    $scope.newSegment = function () {
        // Show the modal
        $scope.isEditing = false;
        $scope.seg = {};
        $scope.createEditSegModal.show();
    }

});
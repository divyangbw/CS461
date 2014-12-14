// first controller for results page
angular.module('reports.controllers').controller('ResultsCtrl', function ($scope, $state, DataFactory, $ionicModal, TempDataFactory) {

    // completed assignments
    $scope.completed = [];
    // answers to a specific assignment
    $scope.answers = [];

    // gather required data. can be expanded with more functionality if necessary
    getData();

    function getData() {
        TempDataFactory.refreshMyAssignments(false).then(function () {
            $scope.completed = TempDataFactory.getCompletedAssignments();
            console.log($scope.completed)
        });
    }

    // function to go to results for a select section
    $scope.goToAnswers = function (item) {
        // save active answer so that it can be displayed on results page
        DataFactory.setActiveAnswer(item);
        // gather results of selected section
        DataFactory.getAnswersForSegment().then(function (result) {
            $scope.answers = result;
        }, function (err) {
            console.log(err);
        });
        // navigate to answers page
        $state.go('tab.answers');
    };
});

// second controller for answers page
angular.module('reports.controllers').controller('ResultsAnswerCtrl', function ($scope, $state, DataFactory, $ionicModal, TempDataFactory) {

    // retrieve stored segment that was clicked on to get here
    $scope.activeAnswer = DataFactory.getActiveAnswer();

    // gather results of selected section
    DataFactory.getAnswersForSegment().then(function (result) {
        $scope.answers = result;
    }, function (err) {
        console.log(err);
    });

});
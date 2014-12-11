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

    $scope.goToAnswers = function (item) {
        //Set the active answer to the answer that is being displayed
        DataFactory.setActiveAnswer(item);
        //Get the answers of the item
        //DataFactory.getAnswers().then(function (result) {
        (function (result) {
            $scope.answers = result;
        }, function (err) {
            console.log(err);
        });
        $state.go('tab.answers');
    };
});

angular.module('reports.controllers').controller('ResultsAnswerCtrl', function ($scope, $state, DataFactory, $ionicModal, TempDataFactory) {

    $scope.activeAnswer = DataFactory.getActiveAnswer();

});
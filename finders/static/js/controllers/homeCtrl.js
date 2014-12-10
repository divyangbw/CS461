angular.module('reports.controllers')
    .controller('HomeCtrl', function ($scope, $state, $ionicViewService, $ionicPopover, User, TempDataFactory) {

        $scope.filter = {};
        $scope.incomplete = [];
        $scope.toStart = [];
        $scope.completed = [];
        $scope.isAdmin = User.isAdmin();

        init();
        getData();

        function init() {
            User.authCheck();
        }

        function getData() {
            TempDataFactory.refreshMyAssignments(false).then(function (result) {
                $scope.completed = TempDataFactory.getCompletedAssignments();
                $scope.incomplete = TempDataFactory.getIncompleteAssignments();
                $scope.toStart = TempDataFactory.getNotStartedAssignments();
                $scope.completed.forEach(function (item) {
                    item.isVisible = true;
                });
                $scope.incomplete.forEach(function (item) {
                    item.isVisible = true;
                });
                $scope.toStart.forEach(function (item) {
                    item.isVisible = true;
                });
            });
        }

        $scope.$watch('filter.search', function (newVal, oldVal) {
            if (!newVal || newVal.length === 0) {
                $scope.completed.forEach(function (item) {
                    item.isVisible = true;
                });
                $scope.incomplete.forEach(function (item) {
                    item.isVisible = true;
                });
                $scope.toStart.forEach(function (item) {
                    item.isVisible = true;
                });
            }
            if (newVal != oldVal) {
                $scope.completed.forEach(function (item) {
                    searchItem(item, newVal)
                });
                $scope.incomplete.forEach(function (item) {
                    searchItem(item, newVal)
                });
                $scope.toStart.forEach(function (item) {
                    searchItem(item, newVal)
                });
            }
        });

        function searchItem(item, newVal) {
            //User
            if (item.user.first.indexOf(newVal) > -1 || item.user.last.indexOf(newVal) > -1
                || item.user.email.indexOf(newVal) > -1) {
                item.isVisible = true;
                return;
            }

            //segment
            if (item.segment.subject.indexOf(newVal) > -1 || item.segment.comment.indexOf(newVal) > -1) {
                item.isVisible = true;
                return;
            }

            //cast
            if (item.cast.company.indexOf(newVal) > -1 || item.cast.date[0].indexOf(newVal) > -1) {
                item.isVisible = true;
                return;
            }

            item.isVisible = false;
            return;
        }

    });
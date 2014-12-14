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

        $scope.goToManageAssign = function() {
            $state.go('tab.assignCoders');
        }

        function getData() {
            $scope.loadingData = true;
            TempDataFactory.refreshMyAssignments(true).then(function (result) {
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
                $scope.loadingData = false;
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
            if (item.user && (item.user.first.toUpperCase().indexOf(newVal.toUpperCase()) > -1 ||
                item.user.last.toUpperCase().indexOf(newVal.toUpperCase()) > -1 ||
                item.user.email.toUpperCase().indexOf(newVal.toUpperCase()) > -1)) {
                item.isVisible = true;
                return;
            }

            //segment
            if (item.segment && (item.segment.subject.toUpperCase().indexOf(newVal.toUpperCase()) > -1 ||
                (item.segment.comment && item.segment.comment.toUpperCase().indexOf(newVal.toUpperCase()) > -1))) {
                item.isVisible = true;
                return;
            }

            //cast
            if (item.cast && (item.cast.company.toUpperCase().indexOf(newVal.toUpperCase()) > -1 ||
                item.cast.date[0].indexOf(newVal.toUpperCase()) > -1)) {
                item.isVisible = true;
                return;
            }

            item.isVisible = false;
            return;
        }

    });

angular.module('reports.controllers')
    .controller('AssignCodersCtrl', function ($scope, $state, $ionicViewService, $ionicPopover, User, TempDataFactory) {

        init();

        function init() {
            User.authCheck();
            User.permissionCheck();
        }



    });
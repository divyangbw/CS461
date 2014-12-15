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
    .controller('AssignCodersCtrl', function ($scope, $state, $ionicModal, $ionicPopup, User, TempDataFactory) {

        init();

        function init() {
            User.authCheck();
            User.permissionCheck();
        }

        $scope.loadingData = true;
        TempDataFactory.getAllAssignments().then(function (result) {
            TempDataFactory.getAllSectionNumbers().then(function (secResults) {
                $scope.data = result;
                $scope.sections = secResults;
                $scope.loadingData = false;
            }, function (err) {
                console.log(err)
            });
        }, function (err) {
            console.log(err)
        });

        $ionicModal.fromTemplateUrl('add_user.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.add_user = modal;
        });

        $scope.addNewUser = function(item) {
            $scope.loadingUsers = true;
            $scope.hasError = false;
            $scope.currentActiveItem = null;
            TempDataFactory.getUsersNotAssigned(item.segId).then(function (users) {
                $scope.loadedUsers = users;
                $scope.currentActiveItem = item;
                $scope.sectionsForm = []
                $scope.sections.forEach(function (item) {
                    $scope.sectionsForm.push({
                        checked: false,
                        value: item
                    })
                });
                $scope.loadingUsers = false;
            }, function (err) {
                console.log(err)
                $scope.hasError = true
                $scope.error = "Error Loading users. Make sure you are logged in (refresh your page) " +
                    "or that the internet is fine."
            });
            $scope.add_user.show();
        }

        $scope.assignUser = function(user) {
            $scope.loadingUsers = true;
            $scope.hasError = false;
            TempDataFactory.assignUserToSegment($scope.currentActiveItem.segId, user.id, $scope.sectionsForm).then(function (item) {
                $scope.currentActiveItem.users.push(item)
                $scope.loadingUsers = false;
            }, function (err) {
                console.log(err)
                $scope.hasError = true
                $scope.error = "Error Loading users. Make sure you are logged in (refresh your page) " +
                    "or that the internet is fine."
            });
            $scope.add_user.hide();
        }



        $scope.deleteCurrentUser = function(item, user, index) {
            $scope.hasError = false
            var popMsg = "Are you sure you want to remove this user? They will lose " +
                "all their questions answered records as well as not be able to answer the questions anymore.";
            $ionicPopup.confirm({
                title: "Delete User Assignment", template: popMsg
            }).then(function (res) {
                if (res) {
                    console.log(item)
                    console.log(user)
                    console.log(index)
                    TempDataFactory.deleteUserFromSegment(user.id).then(function (result) {
                        item.users.splice(index, 1);
                    }, function (err) {
                        $scope.hasError = true
                        $scope.error = "Error deleting user. Make sure you are logged in (refresh your page) " +
                             "or that the internet is fine."
                    });

                }
            });
        }

    });
angular.module('reports.controllers').controller('SettingsCtrl', function ($scope, $state, $ionicPopup, User, ApiService) {

    $scope.settings = {};

    $scope.user = User.getUser();
    $scope.$watch('user.first', function(newVal, oldVal) {
        if (newVal != oldVal) {
            ApiService.setFirstName(User.getEmail(), newVal).then(function (response) {
                User.changeFirst(newVal);
                console.log("Yay!")
            }, function (err) {
                console.log(err)
            });
        }
    });

    $scope.$watch('user.last', function (newVal, oldVal) {
        if (newVal != oldVal) {
            ApiService.setLastName(User.getEmail(), newVal).then(function (response) {
                User.changeLast(newVal);
            }, function (err) {
                console.log(err)
            });
        }
    });

    if ($scope.user.role === "admin") {
        ApiService.getAllUsers().then(function (result) {
            $scope.allUsers = result;
        });

        $scope.changeRole = function (item) {
            createChangeRolePopup().then(function (res) {
                if (res) {
                    ApiService.changeRole(item.email, res).then(function (result) {
                        item.role = res;
                    });
                }
            });
        }

        $scope.toggleStatus = function (item) {
            var popTitle = item.isActive ? "Deactivate User" : "Activate User";
            var popMsg = item.isActive ? "Are you sure you want to deactivate this user? They will not be " +
                "able to login until they are reactivated again." : "Are you sure you want to activate this user? " +
                "They will be able to login as the speicifed role.";
            console.log(item);
            $ionicPopup.confirm({
                title: popTitle, template: popMsg
            }).then(function (res) {
                if (res) {
                    ApiService.toggleUserStatus(item.email).then(function (result) {
                        if (item.isActive) item.isActive = false;
                        else item.isActive = true;
                    });
                }
            });

        }
    }

    $scope.settings.darkMode = {checked: User.getDarkModeSetting()};
    $scope.darkModeChange = function () {
        User.toggleDarkMode();
    };

    $scope.settings.collapsedData = {checked: User.getCollapsedSetting()};
    $scope.collapseChange = function () {
        User.toggleCollapseMode();
    };

    $scope.settings.homeGrid = {checked: User.defaultHomeIsGrid()};
    $scope.homeGridChange = function () {
        User.toggleHomeGrid();
    };

    $scope.goToEditQuestions = function () {
        $state.go('tab.editQuestions');
    }

    function createChangeRolePopup() {
        return $ionicPopup.show({
            template: '',
            title: 'Select the role',
            subTitle: 'Admin roles are not selectable',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Mod</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        return "mod";
                    }
                },
                {
                    text: '<b>User</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        return "user";
                    }
                },
            ]
        });
    }

});


angular.module('reports.controllers')
    .controller('EditQuestionsCtrl', function ($scope, $ionicPopup, $ionicModal, User, QuestionsFactory) {

        $scope.types = QuestionsFactory.getAllQuestionTypes();
        $scope.form = { };
        $scope.questions = [];
        $scope.options = [];


        $scope.submitQuestion = function () {
            QuestionsFactory.createQuestion($scope.form).then(function (response) {
                //$scope.createEditModal.close();
                console.log("INSIDE NEW QUESTION")
                $scope.questions = response;
                $scope.createEditModal.hide();
                console.log("CLOSED NEW QUESTION")
                $scope.form = {};

            }, function (err) {
                console.log("FUCK ME")
                console.log(err)
            });
        };

        // Updating ALREADY created options
        function updateAllOptions(current_index, options) {
            var deferred = $q.defer();

            ApiService.updateOption(options[current_index], options[current_index].question_id).then(function (result) {
                current_index++;
                if (options.length <= current_index) {
                    deferred.resolve("success");
                    return deferred.promise;
                } else {
                    updateAllOptions(current_index, options);
                }
            }, function (err) {
                deferred.reject(err)
            });

            return deferred.promise;
        }

        $scope.newOption = function (form) {
            if (form.id && form.id > -1) {
                QuestionsFactory.createOption({question_id: form.id,text:""}).then(function (item) {
                    if (!$scope.form.options) $scope.form.options = [];
                    $scope.form.options.push({});
                });
            } else {
                if (!$scope.form.options) $scope.form.options = [];
                    $scope.form.options.push({});
            }

        };

        $scope.deleteOption = function (item, index) {
            if (item.id && item.id > -1) {
                QuestionsFactory.deleteOption(item).then(function (result) {
                    $scope.form.options.splice(index, 1);
                });
            } else {
                $scope.form.options.splice(index, 1);
            }

        };

        $scope.editQuestion = function (item) {
            // Set the editItem to what we want to edit. That way we can pre-fill the form.
            $scope.isEditing = true;
            $scope.form = item;
            // Show the modal
            $scope.createEditModal.show();
        };

        /* This is how you create a popup. editQuestions.html is inside editQuestions.html under script tag.
         You can even remove it from there, and create a new templates file, but we can come back to that
         later :) You would only make changes inside then(...).
         */
        $ionicModal.fromTemplateUrl('editQuestions.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.createEditModal = modal;
        });

        // When the new form button is clicked
        $scope.newQuestion = function () {
            $scope.form = { };
            $scope.isEditing = false;
            // Show the modal
            $scope.createEditModal.show();
        }

        $scope.updateQuestion = function (item) {
            QuestionsFactory.updateQuestion(item).then(function (response) {
                //$scope.createEditModal.close();
                $scope.createEditModal.hide();
                $scope.form = {};
            }, function (err) {

            });
        };

        $scope.deleteQuestion = function (item) {
            // An elaborate, custom popup
            var temp = $scope.form;
            QuestionsFactory.deleteQuestion(item).then(function (response) {
                //$scope.createEditModal.close();
                $scope.form = {};
            }, function (err) {

            });

        };

        QuestionsFactory.getAllQuestions().then(function (result) {
            $scope.questions = result;

            console.log(result)
        }, function (err) {
            console.log('didnt work' + err);
        });


        $scope.showQuestion = function (item) {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                title: 'Question',
                subTitle: item.text,
                scope: $scope,
                buttons: [
                    {text: 'Cancel'},
                    {
                        text: '<b>Delete</b>',
                        type: 'button-positive',
                        onTap: function (e) {

                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });

        };


        /*

         $scope.isEditing is simply a boolean that might be useful deciding between whether or not
         you're editing. One example is if you go look at editQuestions.html (read the comment above
         $ionicModal.fromTemplateUrl('editQuestions.html',...) you can see how we have the statement:
         {{ isEditing ? 'Edit Question' : 'New Question' }}

         Meaning, if isEditing is true, show the header as Edit Question, else New Question.

         */





    });
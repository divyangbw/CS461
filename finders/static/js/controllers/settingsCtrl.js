angular.module('reports.controllers').controller('SettingsCtrl', function ($scope, $state, User, ApiService) {

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
    $scope.$watch('user.last', function(newVal, oldVal) {
        if (newVal != oldVal) {
            ApiService.setLastName(User.getEmail(), newVal).then(function (response) {
                User.changeLast(newVal);
                console.log("Yay!")
            }, function (err) {
                console.log(err)
            });
        }
    });

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

});



















angular.module('reports.controllers')
    .controller('EditQuestionsCtrl', function ($scope, $ionicPopup, $ionicModal, User, QuestionsFactory) {

        $scope.types = QuestionsFactory.getAllQuestionTypes();
        $scope.form = { };
        $scope.questions = [];


        $scope.submitQuestion = function () {
            QuestionsFactory.createQuestion($scope.form).then(function (response) {
                //$scope.createEditModal.close();
                $scope.createEditModal.hide();
                $scope.form = {};
                $scope.questions = response;
            }, function (err) {

            });
        };

        $scope.newOption = function() {
            if(!$scope.form.options) $scope.form.options = [];
            $scope.form.options.push({});
        };

        $scope.deleteOption = function(index) {
            $scope.form.options.splice(index, 1);
        };

        $scope.editQuestion = function(item) {
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








        $scope.updateQuestion = function () {
            // An elaborate, custom popup
            var temp = $scope.form;
            QuestionsFactory.updateQuestion(temp).then(function (response) {
                //$scope.createEditModal.close();
                $scope.createEditModal.hide();
                $scope.form = {};
            }, function (err) {

            });
            console.log($scope.form);

        };
        $scope.deleteQuestion = function () {
            // An elaborate, custom popup
            var temp = $scope.form;
            QuestionsFactory.deleteQuestion(temp).then(function (response) {
                //$scope.createEditModal.close();
                $scope.form = {};
            }, function (err) {

            });
            console.log($scope.form);

        };


        QuestionsFactory.getAllQuestions().then(function (result) {
            $scope.questions = result;
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
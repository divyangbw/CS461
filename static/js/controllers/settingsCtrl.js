angular.module('reports.controllers').controller('SettingsCtrl', function ($scope, $state, User) {

    $scope.settings = {};

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

        $scope.question = {};

        $scope.submitQuestion = function () {
            // An elaborate, custom popup
            var temp = $scope.question;
            QuestionsFactory.createQuestion(temp).then(function (response) {
                //$scope.createEditModal.close();
                $scope.createEditModal.hide();
                $scope.question = {};
            }, function (err) {

            });
            console.log($scope.question);

        };

        $scope.updateQuestion = function () {
            // An elaborate, custom popup
            var temp = $scope.question;
            QuestionsFactory.updateQuestion(temp).then(function (response) {
                //$scope.createEditModal.close();
                $scope.createEditModal.hide();
                $scope.question = {};
            }, function (err) {

            });
            console.log($scope.question);

        };
        $scope.deleteQuestion = function () {
            // An elaborate, custom popup
            var temp = $scope.question;
            QuestionsFactory.deleteQuestion(temp).then(function (response) {
                //$scope.createEditModal.close();
                $scope.question = {};
            }, function (err) {

            });
            console.log($scope.question);

        };


        QuestionsFactory.getAllQuestions().then(function (result) {
            $scope.data = result;
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

        /* This is how you create a popup. editQuestions.html is inside editQuestions.html under script tag.
         You can even remove it from there, and create a new templates file, but we can come back to that
         later :) You would only make changes inside then(...).
         */
        $ionicModal.fromTemplateUrl('editQuestions.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.createEditModal = modal;
        });

        // When the new question button is clicked
        $scope.newQuestion = function () {
            $scope.isEditing = false;
            // Show the modal
            $scope.createEditModal.show();
        }

        $scope.editQuestion = function(item) {
            // Set the editItem to what we want to edit. That way we can pre-fill the form.
            $scope.isEditing = true;
            $scope.editItem = item;
            // Show the modal
            $scope.createEditModal.show();
        }

    });
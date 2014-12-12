angular.module('reports.controllers')
    .controller('AnswerQuestionsCtrl', function ($scope, $state, $stateParams, $ionicModal, $ionicPopover, User, TempDataFactory,QuestionsFactory) {
        console.log($stateParams.id)


        $scope.types = QuestionsFactory.getAllQuestionTypes();

        $scope.questions = [];


        QuestionsFactory.getAllQuestions().then(function (result) {

            result.sort(function (a,b) {
                return a.section - b.section
            });
            $scope.questions = angular.copy(result)

            $scope.form = [];
            $scope.questions.forEach(function (item) {
                if (item.type === 'Single Line') {
                    item.answer = "";
                } else if (item.type === 'Multiple Choice') {
                    item.answer = null;
                } else {
                    item.answer = null;
                }
            });

        }, function (err) {
            console.log('didnt work' + err);
        });


        $scope.submitForm = function (item) {
            console.log("yolo: ",item);
            //QuestionsFactory.updateQuestion(item).then(function (response) {
            //    //$scope.createEditModal.close();
            //    $scope.createEditModal.hide();
            //    $scope.form = {};
            //}, function (err) {
            //
            //});
        };

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


        };


    });
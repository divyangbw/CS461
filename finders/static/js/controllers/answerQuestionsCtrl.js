angular.module('reports.controllers')
    .controller('AnswerQuestionsCtrl', function ($scope, $state, $stateParams, $ionicPopover, User, TempDataFactory,QuestionsFactory) {
        console.log($stateParams.id)


        $scope.types = QuestionsFactory.getAllQuestionTypes();
        $scope.form = { };
        $scope.questions = [];


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


        };


    });
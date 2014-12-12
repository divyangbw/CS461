angular.module('reports.controllers')
    .controller('AnswerQuestionsCtrl', function ($scope, $state, $stateParams, $ionicModal, $ionicPopover, User, TempDataFactory, QuestionsFactory) {
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
                item.answer = {}
                if (item.type === 'Single Line') {
                    item.answer.answer = "";
                } else if (item.type === 'Multiple Choice') {
                    item.answer.answer = null;
                } else {
                    item.answer.answer = null;
                }
            });

        }, function (err) {
            console.log('didnt work' + err);
        });

        //$scope.$watch('questions', function (newValue, oldValue) {
        //    console.log(value);
        //}, true);

        $scope.answerChanged = function(singleQuestion) {
            console.log("Changed")
            if (singleQuestion.type === 'Single Line') {
                TempDataFactory.neworUpdateAnswerSingleLine(singleQuestion, $stateParams.id).then(function(result){
                    singleQuestion.answer = result;
                });
            }else if (singleQuestion.type === 'Multiple Choice') {

            } else {
                console.log(singleQuestion)
            }
        }


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
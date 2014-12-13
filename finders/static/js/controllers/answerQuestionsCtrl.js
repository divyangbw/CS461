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
            console.log($scope.questions);

        }, function (err) {
            console.log('didnt work' + err);
        });

        //$scope.$watch('questions', function (newValue, oldValue) {
        //    console.log(value);
        //}, true);

        $scope.answerChanged = function(singleQuestion) {
            console.log("Changed")
            if (singleQuestion.type === 'Single Line') {
                TempDataFactory.neworUpdateAnswer(singleQuestion, $stateParams.id).then(function(result){
                    singleQuestion.answer.id = result.id;
                });
            }else if (singleQuestion.type === 'Multiple Choice') {
                TempDataFactory.neworUpdateAnswer(singleQuestion, $stateParams.id).then(function(result){
                    singleQuestion.answer.id = result.id;
                });
            } else {

                singleQuestion.answer.answer = "";
                var firstDone = false;
                for (var i = 0; i < singleQuestion.options.length; i++) {
                    if (singleQuestion.options[i].checked) {
                        if (firstDone)
                            singleQuestion.answer.answer += "$$>AS<$$";
                        singleQuestion.answer.answer += singleQuestion.options[i].id
                        if (!firstDone) firstDone = true;
                    }
                }
                TempDataFactory.neworUpdateAnswer(singleQuestion, $stateParams.id).then(function(result){
                    singleQuestion.answer.id = result.id;
                });
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
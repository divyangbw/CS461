angular.module('reports.controllers')
    .controller('AnswerQuestionsCtrl', function ($scope, $state, $stateParams, $ionicPopup, $ionicViewService, $ionicLoading, $timeout, User, TempDataFactory, QuestionsFactory) {

        $scope.types = QuestionsFactory.getAllQuestionTypes();

        $scope.questions = [];


        $scope.loadingQuestions = true;
        TempDataFactory.getQuestionsToAnswer($stateParams.id).then(function (result) {

            result.sort(function (a, b) {
                return a.section - b.section
            });

            console.log(result)

            $scope.questions = result
            $scope.form = [];


            $scope.loadingQuestions = false;

        }, function (err) {
            console.log(err);
            $scope.loadingQuestions = true;
        });


        //$scope.$watch('questions', function (newValue, oldValue) {
        //    console.log(value);
        //}, true);

        $scope.answerChanged = function (singleQuestion) {
            if (!singleQuestion.gettingId) {
                singleQuestion.gettingId = true;
                syncAnswerWithServer(singleQuestion)
            } else {
                if (singleQuestion.IdGot)
                    syncAnswerWithServer(singleQuestion)
                else {
                    singleQuestion.isBusySaving = true;
                    $timeout(function() {
                        syncAnswerWithServer(singleQuestion)
                        singleQuestion.isBusySaving = false;
                    }, 2000);
                }
            }

        }

        function syncAnswerWithServer(singleQuestion) {
            if (singleQuestion.type === 'Single Line') {
                TempDataFactory.neworUpdateAnswer(singleQuestion, $stateParams.id).then(function (result) {
                    singleQuestion.answer.id = result.id;
                    singleQuestion.IdGot = true;
                });
            } else if (singleQuestion.type === 'Multiple Choice') {
                TempDataFactory.neworUpdateAnswer(singleQuestion, $stateParams.id).then(function (result) {
                    singleQuestion.answer.id = result.id;
                    singleQuestion.IdGot = true;
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
                TempDataFactory.neworUpdateAnswer(singleQuestion, $stateParams.id).then(function (result) {
                    singleQuestion.answer.id = result.id;
                    singleQuestion.IdGot = true;
                });
            }
        }


        $scope.submitForm = function () {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Submit Questions',
                template: 'All your answers are already saved. If you say yes, ' +
                    'this will submit the questionnaire and you will not be able to edit any answers. ' +
                    'Are you sure?'
            }).then(function (res) {
                if (res) {
                    $ionicLoading.show();

                    TempDataFactory.submitQuestionsToAnswerForm($stateParams.id).then(function (result) {
                        console.log(result);
                        $ionicViewService.nextViewOptions({
                            disableAnimate: false,
                            disableBack: true
                        });
                        $ionicLoading.hide();
                        $state.go('tab.home');
                    }, function (err) {

                    });

                }
            });

        };


    });
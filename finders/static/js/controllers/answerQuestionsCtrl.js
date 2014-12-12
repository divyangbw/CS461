angular.module('reports.controllers')
    .controller('AnswerQuestionsCtrl', function ($scope, $state, $stateParams, $ionicModal, $ionicPopover, User, TempDataFactory,QuestionsFactory) {
        console.log($stateParams.id)


        $scope.types = QuestionsFactory.getAllQuestionTypes();
        $scope.form = { };
        $scope.questions = [];


        QuestionsFactory.getAllQuestions().then(function (result) {

            console.log("IN GET");
            console.log(result)
            result.sort(function (a,b) {
                return a.section - b.section
            });
            console.log(result)


            $scope.questions = result;
            console.log("IN GET END ")
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
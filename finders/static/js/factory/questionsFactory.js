angular.module('reports.factory')

    .factory('QuestionsFactory', function ($q, ApiService) {


        var questions = [];
        var questionTypes = ["Single Line", "Multiple Choice", "Multi-Choice"];
        var test = [];
        return {

            getAllQuestionTypes: function () {
                return questionTypes;
            },

            getAllQuestions: function () {
                console.log("before");
                var deferred = $q.defer();
                ApiService.getAllQuestions().then(function (result) {
                    questions = result;
                                    console.log(result);

                    deferred.resolve(questions);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

            },

            createQuestion: function (item) {

                var deferred = $q.defer();
                ApiService.createQuestion(item).then(function (result) {
                    questions.push(result);
                    deferred.resolve(questions);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

            },
            updateQuestion: function (item) {

                var deferred = $q.defer();
                ApiService.updateQuestion(item).then(function (result) {
                    questions = result;
                    deferred.resolve(questions);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

            },
            deleteQuestion: function (item) {
                console.log("factor remove",item);
                var deferred = $q.defer();
                ApiService.deleteQuestion(item).then(function (result) {
                    var index = -1;
                    for (var i = 0; i < questions.length; i++) {
                        if (questions[i].id === item.id) {
                            index = i;
                            break;
                        }
                    }
                questions.splice(index, 1);

                    deferred.resolve(questions);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }

        }

    });
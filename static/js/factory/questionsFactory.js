angular.module('reports.factory')

    .factory('QuestionsFactory', function ($q, ApiService) {

        var questions = [];
        var test = [];

        return {

            getAllQuestions: function () {

                var deferred = $q.defer();
                ApiService.getAllQuestions().then(function (result) {
                    questions = result;
                    deferred.resolve(questions);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

            },

            createQuestion: function (item) {

                var deferred = $q.defer();
                ApiService.createQuestion(item).then(function (result) {
                    questions = result;
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

                var deferred = $q.defer();
                ApiService.deleteQuestion(item).then(function (result) {
                    questions = result;
                    deferred.resolve(questions);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

                var index = -1;
                for (var i = 0; i < questions.length; i++) {
                    if (questions[i].id === item.id) {
                        index = i;
                        break;
                    }
                }

                questions.splice(index, 1);
            }


        }


    });
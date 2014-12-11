angular.module('reports.factory')

    .factory('QuestionsFactory', function ($q, ApiService) {


        var questions = [];
        var options = [];
        var questionTypes = ["Single Line", "Multiple Choice", "Multi-Choice"];
        var test = [];

        function createAllOptions(question, current_index, options) {
            var deferred = $q.defer();

            if (!options || options === {}) {
                deferred.resolve("success");
                return deferred.promise;
            }

            ApiService.createOption(options[current_index], question.id).then(function (result) {
                if (!question.options) question.options = []
                question.options.push(result);
                current_index++;
                if (options.length <= current_index) {
                    deferred.resolve("success");
                    return deferred.promise;
                } else {
                    deferred.resolve(createAllOptions(question, current_index, options));
                }
            }, function (err) {
                deferred.reject(err)
            });

            return deferred.promise;
        }

        return {

            getAllQuestionTypes: function () {
                return questionTypes;
            },

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
                    createAllOptions(result, 0, item.options).then(function (response) {
                        questions.push(result);
                        deferred.resolve(questions);
                    }, function (err) {
                        questions.push(result);
                        deferred.resolve(questions);
                    });
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

            },
            updateQuestion: function (item) {

                // Save Question

                //

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
            },
            getAllOptions: function () {
                console.log("Called create option");
                var deferred = $q.defer();
                ApiService.getAllOptions().then(function (result) {
                    options = result;
                    deferred.resolve(options);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

            },

            createOption: function (item) {
                console.log("Called create option");
                var deferred = $q.defer();
                ApiService.createOption(item, item.question_id).then(function (result) {
                    options.push(result);
                    deferred.resolve(options);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

            },
            updateOption: function (item) {
                console.log("Called update option");
                var deferred = $q.defer();
                ApiService.updateOption(item).then(function (result) {
                    options = result;
                    deferred.resolve(options);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

            },
            deleteOption: function (item) {
                console.log("Called deleted option");
                var deferred = $q.defer();

                ApiService.deleteOption(item).then(function (result) {
                    deferred.resolve(options);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }



        }

    });
angular.module('reports.factory')

    .factory('TempDataFactory', function ($q, ApiService) {

        var myAssignments = [];
        var activeQuestions = []

        return {

            refreshMyAssignments: function(serverRefresh) {
                return fetchMyAssignments(false, serverRefresh);
            },

            getMyAssignments: function(serverRefresh) {
                return fetchMyAssignments(true, serverRefresh);
            },

            getCompletedAssignments: function() {
                var toReturn = [];
                myAssignments.forEach(function(item) {
                    if (item.completed) toReturn.push(item);
                });
                return toReturn;
            },

            getIncompleteAssignments: function() {
                var toReturn = [];
                myAssignments.forEach(function(item) {
                    if (item.answers.length > 0 && !item.completed) toReturn.push(item);
                });
                return toReturn;
            },

            getNotStartedAssignments: function() {
                var toReturn = [];
                myAssignments.forEach(function(item) {
                    if (!item.answers || item.answers.length < 1) toReturn.push(item);
                });
                return toReturn;
            },

            neworUpdateAnswer: function(question, assignment_id) {
                var deferred = $q.defer();
                var tempId = question.answer.id && question.answer.id > -1 ? question.answer.id : -1
                var data = {
                    id: tempId,
                    assignment_id: assignment_id,
                    answer: question.answer.answer
                }
                ApiService.neworUpdateAnswer(question.id, data).then(function (result) {
                    deferred.resolve(result)
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },


            getQuestionsToAnswer: function(assignment_id) {
                var deferred = $q.defer();
                ApiService.getQuestionsToAnswer(assignment_id).then(function (results) {
                    deferred.resolve(results);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },

            submitQuestionsToAnswerForm: function(assignment_id) {
                var deferred = $q.defer();
                ApiService.submitQuestionForm(assignment_id).then(function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },

            getAllAssignments: function() {
                var deferred = $q.defer();
                ApiService.getAllAssignments().then(function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },

            getUsersNotAssigned: function(segment_id) {
                var deferred = $q.defer();
                ApiService.getUsersNotAssigned(segment_id).then(function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },

            assignUserToSegment: function(segment_id, user_id) {
                var deferred = $q.defer();
                ApiService.assignUserToSegment(segment_id, user_id).then(function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },

            deleteUserFromSegment: function(segment_id) {
                var deferred = $q.defer();
                ApiService.deleteAssignedUser(segment_id).then(function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }

        };

        function fetchMyAssignments(returnAssignments, serverRefresh) {
            var deferred = $q.defer();
            if (myAssignments.length > 0 && !serverRefresh) {
                if (returnAssignments) deferred.resolve(myAssignments);
                else deferred.resolve("success");
                return deferred.promise;
            }
            ApiService.getMyAssignments().then(function (result) {
                myAssignments = result;
                if (returnAssignments) deferred.resolve(myAssignments);
                else deferred.resolve("success");
            }, function (err) {
                console.log(err);
                deferred.reject(err);
            });
            return deferred.promise;
        }


    });
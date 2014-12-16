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
                return ApiService.neworUpdateAnswer(question.id, data);
            },


            getQuestionsToAnswer: function(assignment_id) {
                return ApiService.getQuestionsToAnswer(assignment_id);
            },

            submitQuestionsToAnswerForm: function(assignment_id) {
               return  ApiService.submitQuestionForm(assignment_id);
            },

            getAllAssignments: function() {
                return ApiService.getAllAssignments();
            },

            getUsersNotAssigned: function(segment_id) {
                return ApiService.getUsersNotAssigned(segment_id);
            },

            assignUserToSegment: function(segment_id, user_id, sections) {
                var data = {
                    user_id:user_id,
                    sections: sections
                }
                console.log(data)
                return ApiService.assignUserToSegment(segment_id, data);
            },

            deleteUserFromSegment: function(segment_id) {
                return ApiService.deleteAssignedUser(segment_id);
            },

            getAllSectionNumbers: function() {
                return ApiService.getAllSectionNumbers();
            },

            exportAllQuestions: function() {
                return ApiService.exportAllQuestions();
            },

            exportAllQuestionsFor: function(assignment_id) {
                return ApiService.exportAllQuestionsFor(assignment_id);
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
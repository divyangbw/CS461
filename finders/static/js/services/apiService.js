angular.module('reports.services').service('ApiService', function ($q, $http, User, MockFactory) {

    var useMockData = true;

    var BASEURL = 'http://127.0.0.1:5000/';
    $http.defaults.headers.post["Content-Type"] = "application/json";

    this.register = function (user) { return setUserAPI("api/register", user); };

    this.login = function (user) { return setUserAPI("api/auth", user); };

    this.logout = function () {
        var deferred = $q.defer();
        $http.delete(BASEURL + "api/auth/" + User.getEmail()).then(function (response) { // Success
            User.destroyUser();
            deferred.resolve("success");
        }, function (response) {
            console.log(response);
            deferred.reject(response);
        });

        return deferred.promise;
    }

    function setUserAPI(url,user) {
        var deferred = $q.defer();
        var data = JSON.stringify(user);
        $http.post(BASEURL + url, data, {}).then(function (response) { // Success
            User.setUser(response.data);
            deferred.resolve(response.data);
        }, function (response) {
            console.log(response);
            deferred.reject(response);
        });

        return deferred.promise;
    }

    // NOT WORKING ANYTHING BELOW:

    function httpEncodedGet(passData, apiUrl) {
        return $http({
            method: 'GET', url: BASEURL + apiUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (obj){
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: passData
        });
    }

    function transformToEncoded (obj) {
        var str = [];
        for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    }

    /**************************************************
     *  USER
     *************************************************/

    this.setFirstName = function (email, name) {
        data = { email:email, first:name}
        return POST("api/user/first", data)
    };

    this.setLastName = function (email, name) {
        data = { email:email, last:name}
        return POST("api/user/last", data)
    };

    this.getAllUsers = function() {
        console.log("IN API - GET");
        if (User.role() !== "admin") {
            var deferred = $q.defer();
            deferred.reject("Can't do that :(");
            return deferred.promise;
        }
        return GET_ALL("api/user");
    }

    this.changeRole = function(email, role) {

        if (User.role() !== "admin") {
            var deferred = $q.defer();
            deferred.reject("Can't do that :(");
            return deferred.promise;
        }
        return POST("api/user/role", {email:email,role:role})
    }

    this.toggleUserStatus = function(email) {

        if (User.role() !== "admin") {
            var deferred = $q.defer();
            deferred.reject("Can't do that :(");
            return deferred.promise;
        }
        return POST("api/user/status", {email:email})
    }

    /**************************************************
     *  CASTS & SEGMENTS
     *************************************************/

    this.getAllCasts = function () { return GET_ALL("api/cast")};
    this.getCast = function (castId) { return GET("api/cast", castId)};
    this.createCast = function (cast) { return POST("api/cast", cast)};
    this.deleteCast = function (cast) { return DELETE ("api/cast", cast)};
    this.updateCast = function (cast) { return PUT ("api/cast", cast)};

    this.getAllSegments = function (castId) { return GET_ALL_FOR("api/segmentfor", castId)};
    this.getSegment = function (segId) { return GET("api/segment", segId)};
    this.createSeg = function (seg, cast_id) { return POST("api/segmentfor/" + cast_id, seg)};
    this.deleteSeg = function (seg) { return DELETE ("api/segment", seg)};
    this.updateSeg = function (seg) { return PUT ("api/segment", seg)};

    /**************************************************
     *  QUESTIONNAIRE
     *************************************************/

    this.getAllQuestions = function () { return GET_ALL("api/question")};
    this.getQuestion = function (questionId) { return GET("api/question", questionId)};
    this.createQuestion = function (question) { return POST("api/question", question)};
    this.updateQuestion = function (question) { return PUT ("api/question", question)};
    this.deleteQuestion = function (question) { return DELETE ("api/question", question)};

    this.getAllOptions = function (questionId) { return GET_ALL_FOR("api/questionoptionfor", questionId)};
    this.getOption = function (optionId) { return GET("api/questionoption", optionId)};
    this.createOption = function (option, question_id) { return POST("api/questionoptionfor/" + question_id , option)};
    this.updateOption = function (option) { return PUT ("api/questionoption", option)};
    this.deleteOption = function (option) { return DELETE ("api/questionoption", option)};

    /**************************************************
     *  ASSIGNMENTS
     *************************************************/

    this.getMyAssignments = function () { return GET_ALL("api/my/assignments") }
    this.getAllAnswerForAssignment = function (assignment_id) { return GET("api/admin/answers", assignment_id) };
    this.getAllAssignments = function () { return GET_ALL("api/admin/assignments") };

    this.neworUpdateAnswer = function (question_id, params) { return POST("api/answer/" + question_id, params) };
    this.getQuestionsToAnswer = function (assignment_id) { return GET("api/question/answers", assignment_id) };
    this.submitQuestionForm = function (assignment_id) { return PUTBLANK("api/question/submit", assignment_id) };

    this.getAllSectionNumbers = function () {return GET_ALL("api/admin/assign/sections")};
    this.getUsersNotAssigned = function (segment_id) { return GET("api/admin/assign/users", segment_id) };
    this.assignUserToSegment = function (segment_id, data) {
        return POST("api/admin/assign/users/" + segment_id, data)
    };
    this.deleteAssignedUser = function (segment_id) { return DELETE("api/admin/assign/delete", {"id":segment_id}) };

    this.exportAllQuestions = function () { return DOWNLOAD_ALL("api/admin/export/questions") };
    this.exportAllQuestionsFor = function (assignment_id) { return GET("api/admin/export/questions", assignment_id) };

    function DOWNLOAD_ALL(URL) {
        $http({method: 'GET', url: BASEURL + URL}).
          success(function(data, status, headers, config) {
             var element = angular.element('<a/>');
             element.attr({
                 href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                 target: '_blank',
                 download: 'export.csv'
             })[0].click();

          }).
          error(function(data, status, headers, config) {
            // if there's an error you should see it here
          });
    }

    /**************************************************
     *  SHARED CALLS
     *************************************************/

    function generateError(response) {
        if (response.status === 400)
            return "Not all required fields were submitted. Please go back and reload the page."
        if (response.status === 401)
            return "You do not have permission to perform this action."
        if (response.status === 403)
            return "This requested is invalid. Please go back and reload the page."
        if (response.status === 404)
            return "This requested object was not found. Please go back and reload the page."
        if (response.status === 408)
            return "Oops. The server seems busy. Please try again later."
        if (response.status === 500)
            return "OK, this is our fault. It looks like something didn't work right. Please contact us to report this."
        if (response.status === 501)
            return "This feature is not yet released. Think it's a mistake? Contact us."
        if (response.status === 502)
            return "Bad Gateway. Contact us."
        if (response.status === 503)
            return "Service Unavailable. Contact us."
        if (response.status === 504)
            return "Gateway Timeout. Please try again later, or contact us."

    }

    function POST (url, obj) {
        var HEADER = { headers: {'email': User.getEmail(), 'token': User.getToken()} }
        var deferred = $q.defer();
        if (obj) {
            obj.inject = {email:User.getEmail(),token:User.getToken()};
            var data = JSON.stringify(obj);
            $http.post(BASEURL + url, data, HEADER).then(function (response) { // Success
                deferred.resolve(response.data.result);
            }, function (response) {
                var re = generateError(response);
                console.log(re);
                deferred.reject(response);
            });
        } else {
            deferred.reject("Object is empty. Please go back and reload the page.");
        }
        return deferred.promise;
    }

    function GET_ALL (url) {
        var HEADER = { headers: {'email': User.getEmail(), 'token': User.getToken()} }
        var deferred = $q.defer();
        $http.get(BASEURL + url, HEADER).then(function (response) {
            deferred.resolve(response.data.result);
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }

    function GET_ALL_FOR (url, id) {
        return GET (url, id);
    }

    function GET (url, id) {
        var HEADER = { headers: {'email': User.getEmail(), 'token': User.getToken()} }
        var deferred = $q.defer();
        if (id && id > -1) {
            $http.get(BASEURL + url + "/" + id, HEADER).then(function (response) {
                deferred.resolve(response.data.result);
            }, function (response) {
                deferred.reject(generateError(response));
            });
        } else {
            deferred.reject("You did not provide an ID. Please go back home a reload the page.");
        }
        return deferred.promise;
    }

    function DELETE (url, obj) {
        var HEADER = { headers: {'email': User.getEmail(), 'token': User.getToken()} }
        var deferred = $q.defer();
        if (obj && obj.id > -1) {
            $http.delete(BASEURL + url + "/" + obj.id, HEADER).then(function (response) { // Success
                deferred.resolve(response.data.result);
            }, function (response) {
                deferred.reject(generateError(response));
            });
        } else {
            deferred.reject("Object is empty. Please go back and reload the page.");
        }
        return deferred.promise;
    }

    function PUT (url, obj) {
        var HEADER = { headers: {'email': User.getEmail(), 'token': User.getToken()} }
        var deferred = $q.defer();
        if (obj && obj.id > -1) {
            var data = JSON.stringify(obj);
            $http.put(BASEURL + url + "/" + obj.id, data, HEADER).then(function (response) { // Success
                deferred.resolve(response.data.result);
            }, function (response) {
                deferred.reject(generateError(response));
            });
        } else {
            deferred.reject("Object is empty. Please go back and reload the page.");
        }
        return deferred.promise;
    }

    function PUTBLANK (url, id) {
        var HEADER = { headers: {'email': User.getEmail(), 'token': User.getToken()} }
        var deferred = $q.defer();
        $http.put(BASEURL + url + "/" + id, {}, HEADER).then(function (response) { // Success
            deferred.resolve(response.data.result);
        }, function (response) {
            deferred.reject(generateError(response));
        });
        return deferred.promise;
    }

});
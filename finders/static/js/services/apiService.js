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
    this.createOption = function (option) { return POST("api/questionoptionfor", option)};
    this.updateOption = function (option) { return PUT ("api/questionoption", option)};
    this.deleteOption = function (option) { return DELETE ("api/questionoption", option)};

    /**************************************************
     *  ASSIGNMENTS
     *************************************************/

    this.getMyAssignments = function () { return GET_ALL("api/my/assignments") }

    /**************************************************
     *  SHARED CALLS
     *************************************************/



    function POST (url, obj) {
        var HEADER = { headers: {'email': User.getEmail(), 'token': User.getToken()} }
        var deferred = $q.defer();
        if (obj) {
            obj.inject = {email:User.getEmail(),token:User.getToken()};
            var data = JSON.stringify(obj);
            $http.post(BASEURL + url, data, HEADER).then(function (response) { // Success
                deferred.resolve(response.data.result);
            }, function (response) {
                console.log(response);
                deferred.reject(response);
            });
        } else {
            deferred.reject({code:1,reason:"Object is null"});
        }
        return deferred.promise;
    }

    function GET_ALL (url) {
        var HEADER = { headers: {'email': User.getEmail(), 'token': User.getToken()} }
        var deferred = $q.defer();
        $http.get(BASEURL + url, HEADER).then(function (response) {
            deferred.resolve(response.data.result);
        }, function (response) {
            console.log(response);
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
                console.log(response);
                deferred.reject(response);
            });
        } else {
            deferred.reject({code:1,reason:"ID is null, or less than 0"});
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
                console.log(response);
                deferred.reject(response);
            });
        } else {
            deferred.reject({code:1,reason:"Object is null, or does not have an id"});
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
                console.log(response);
                deferred.reject(response);
            });
        } else {
            deferred.reject({code:1,reason:"Object is null, or does not have an id"});
        }
        return deferred.promise;
    }

});
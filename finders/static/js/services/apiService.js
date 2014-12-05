angular.module('reports.services').service('ApiService', function ($q, $http, User, MockFactory) {

    var useMockData = true;

    var BASEURL = 'http://127.0.0.1:5000/';
    $http.defaults.headers.post["Content-Type"] = "application/json";

    this.register = function (user) { return setUserAPI("api/register", user); };

    this.login = function (user) { return setUserAPI("api/auth", user); };

    this.logout = function () {
        var deferred = $q.defer();
        var request = $http.delete(BASEURL + "api/auth/" + User.getEmail()).then(function (response) { // Success
            User.destroyUser();
            deferred.resolve("success");
        }, function (response) {
            console.log(response);
            deferred.reject(response);
        });

        return deferred.promise;
    }

    function setUserAPI(url,user) {
        console.log(user);
        var deferred = $q.defer();
        var data = JSON.stringify(user);
        var request = $http.post(BASEURL + url, data, {}).then(function (response) { // Success
            User.setUser(response.data);
            deferred.resolve(response.data);
        }, function (response) {
            console.log(response);
            deferred.reject(response);
        });

        return deferred.promise;
    }

    // NOT WORKING ANYTHING BELOW:

    function getUserDetails(token) {
        var passData = {token:'x'};
        return httpEncodedGet(passData, "api/user");
    }

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
     *  CASTS
     *************************************************/

    this.getAllCasts = function () {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.get("cast"));
        return deferred.promise;
    };

    this.getCast = function (castId) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.get("cast", castId));
        return deferred.promise;
    };

    this.createCast = function (cast) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.add("cast", cast));
        return deferred.promise;
    };

    this.deleteCast = function (cast) {
        alert("Delete not implemented yet.");
    };

    this.updateCast = function (cast) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.update("cast", cast));
        return deferred.promise;
    };

    /**************************************************
     *  SEGMENTS
     *************************************************/

    this.getAllSegments = function (castId) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.get("segment", castId));
        return deferred.promise;
    };

    this.getSegment = function (segId) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.get("segment", segId));
        return deferred.promise;
    };

    this.createSeg = function (seg) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.add("segment", seg));
        return deferred.promise;
    };

    this.deleteSeg = function (seg) {
        var deferred = $q.defer();
        alert("Delete not implemented yet.");
    };

    this.updateSeg = function (seg) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.update("segment", seg));
        return deferred.promise;
    };

    /**************************************************
     *  QUESTIONNAIRE
     *************************************************/

    this.getAllQuestionTypes = function () {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.get("questionType"));
        return deferred.promise;
    };

    this.getAllQuestions = function () {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.get("form"));
        return deferred.promise;
    };

    this.getQuestion = function (id) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.get("form", id));
        return deferred.promise;
    };

    this.createQuestion = function (question) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.add("form", question));
        return deferred.promise;
    };

    this.updateQuestion = function (question) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.update("form", question));
        return deferred.promise;
    };

    this.deleteQuestion = function (question) {
        var deferred = $q.defer();
        if (useMockData) {
            MockFactory.del("form", question);
        }
    };


    this.getAllOptions = function (questionId) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.get("option", questionId));
        return deferred.promise;
    };

    this.getOption = function (id) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.get("option", null, id));
        return deferred.promise;
    };

    this.createOption = function (option) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.add("option", option));
        return deferred.promise;
    };

    this.createAllOptions = function (options) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.addMany("option", options));
        return deferred.promise;
    };

    this.updateOption = function (option) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.update("option", option));
        return deferred.promise;
    };

    this.updateAllOptions = function (options) {
        alert("updateAllOptions not implemented yet.");
    };

    this.deleteOption = function (id) {
        alert("Delete not implemented yet.");
    };

    this.deleteAllOption = function (options) {
        alert("Delete not implemented yet.");
    };


});
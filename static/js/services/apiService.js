angular.module('reports.services').service('ApiService', function ($q, $http, User, MockFactory) {

    var useMockData = true;

    var BASEURL = 'http://127.0.0.1:5000/';
    $http.defaults.headers.post["Content-Type"] = "application/json";

    this.register = function (user) {

        var deferred = $q.defer();
        var data = JSON.stringify(user);

        var request = $http.post(BASEURL + "api/users", data, {}).then(function (response) { // Success
            console.log(response.data);
            User.setUser(response.data);
            deferred.resolve(response.data);
            //getToken(user).then(function(response) {
            //    console.log(response);
                //User.setToken()
            //});

        }, function (response) {
            console.log(response);
            deferred.reject(response);
        });

        return deferred.promise;

    }

    this.getResource = function() {
        var token = User.getToken();
        var passData = {token:'x'};
        var deferred = $q.defer();
        $http({
            method: 'GET', url: BASEURL + "api/resource",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: passData
        }).then(function (response) {
            console.log("Resource success");
            deferred.resolve(response.data);
        }, function (err) {
            console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
    }



    this.login = function (user) {
        var deferred = $q.defer();

        getToken(user).then(function (tokenResponse) { // Success
            var token = tokenResponse.data;
            console.log("First Level:");
            console.log(tokenResponse);
            getUserDetails(token.token).then(function (response) {
                console.log("Second Level:");
                console.log(response);
                User.setUser(response.data);
                User.setToken(token.token, token.duration);
                deferred.resolve("success");
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
            deferred.reject(err);
        });

        return deferred.promise;
    };

    this.checkLogin = function () {
        var deferred = $q.defer();
        var data = JSON.stringify({
            key: User.getKey()
        });

        /*

         var request = $http.post(BASEURL + "api/loggedIn", data, {}).then(function(response) { // Success
         if (response.data.code === 200) {
         deferred.resolve(response.data);
         } else {
         deferred.reject(response);
         }
         }, function(response) {
         console.log(response);
         deferred.reject(response);
         });
         */
        deferred.resolve({username: "djoshi"});
        return deferred.promise;
    }

    function getToken(user) {
        var passData = {email: user.email, password: user.password};
        return httpEncodedGet({email: user.email, password: user.password}, "api/token");
    }

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

    this.logout = function () {
        var deferred = $q.defer();
        /*var request = $http.post(BASEURL + "api/logout", {}, {}).then(function(response) { // Success
         deferred.resolve("success");
         }, function(response) {
         console.log(response);
         deferred.reject(response);
         });
         */
        deferred.resolve("success");
        return deferred.promise;

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
            deferred.resolve(MockFactory.get("question"));
        return deferred.promise;
    };

    this.getQuestion = function (id) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.get("question", id));
        return deferred.promise;
    };

    this.createQuestion = function (question) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.add("question", question));
        return deferred.promise;
    };

    this.updateQuestion = function (question) {
        var deferred = $q.defer();
        if (useMockData)
            deferred.resolve(MockFactory.update("question", question));
        return deferred.promise;
    };

    this.deleteQuestion = function (question) {
        var deferred = $q.defer();
        if (useMockData) {
            MockFactory.del("question", question);
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
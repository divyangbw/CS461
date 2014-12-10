angular.module('reports.factory')

    .factory('DataFactory', function ($q, ApiService) {

        var casts = [];
        var activeCast = getActiveCastStorage();
        var segments = [];

        function getActiveCastStorage() {
            var item = localStorage.getItem("activeCast");
            return item ? JSON.parse(item) : {};
        }

        function saveActiveCast(result) {
            localStorage.setItem("activeCast", JSON.stringify(result));
            activeCast = result;
        }

        return {

            getCasts: function () {

                var deferred = $q.defer();
                ApiService.getAllCasts().then(function (result) {
                    casts = result;
                    deferred.resolve(casts);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },

            getSegments: function () {
                var deferred = $q.defer();
                ApiService.getAllSegments(activeCast.id).then(function (result) {
                    segments = result;
                    deferred.resolve(segments);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },

            getSegmentsForCast: function(cast) {
                var deferred = $q.defer();
                ApiService.getAllSegments(cast.id).then(function (result) {
                    segments = result;
                    deferred.resolve(segments);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },

            getActiveCast: function () {
                return activeCast;
            },

            setActiveCast: function (cast) {
                activeCast = cast;
                localStorage.setItem("activeCast", JSON.stringify(activeCast));
            },

            createCast: function (item) {

                var deferred = $q.defer();
                ApiService.createCast(item).then(function (result) {
                    casts.push(result);
                    deferred.resolve(casts);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

            },
            updateCast: function (item) {

                var deferred = $q.defer();

                if (item.date && item.date.length === 2)
                    item.date = item.date[0];
                console.log(item)

                ApiService.updateCast(item).then(function (result) {
                    saveActiveCast(result);
                    console.log(activeCast)
                    deferred.resolve(activeCast);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

            },
               deleteCast: function (item) {
                var deferred = $q.defer();
                ApiService.deleteCast(item).then(function (result) {
                    casts = result;
                    deferred.resolve(casts);
                }, function (err) {
                    deferred.reject(err);
                });
                var index = -1;
                for (var i = 0; i < casts.length; i++) {
                    if (casts[i].id === item.id) {
                        index = i;
                        break;
                    }
                }

                casts.splice(index, 1);
                return deferred.promise;

            },
            createSegment: function (item) {

                var deferred = $q.defer();
                if(!activeCast || activeCast === {}) {
                    deferred.reject("Null Cast");
                    return deferred.promise;
                }
                ApiService.createSeg(item, activeCast.id).then(function (result) {
                    segments.push(result);
                    deferred.resolve(segments);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

            },
            updateSegment: function (item) {
                console.log("DataFactory");
                console.log(item);
                var deferred = $q.defer();
                if (!item.comment || item.comment.length < 1)
                    item.comment = "";
                ApiService.updateSeg(item).then(function (result) {
                   deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

            },
            deleteSegment: function (item) {

                var deferred = $q.defer();
                ApiService.deleteSeg(item).then(function (result) {
                    segments = result;
                    deferred.resolve(segments);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;

                var index = -1;
                for (var i = 0; i < segments.length; i++) {
                    if (segments[i].id === item.id) {
                        index = i;
                        break;
                    }
                }

                segments.splice(index, 1);
            }


        }


    });
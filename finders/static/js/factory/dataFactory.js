angular.module('reports.factory')

    .factory('DataFactory', function ($q, ApiService) {

        var casts = [];
        var activeCast = null;
        var segments = [];


        return {

            getCasts: function () {

                var deferred = $q.defer();
                ApiService.getAllCasts().then(function (result){
                    casts = result;
                    deferred.resolve(casts);
                }, function (err){
                    deferred.reject(err);
                });
                return deferred.promise;
            },

            getSegments: function () {

                var deferred = $q.defer();
                ApiService.getAllSegments(activeCast.id).then(function (result){
                    segments = result;
                    deferred.resolve(segments);
                }, function (err){
                    deferred.reject(err);
                });
                return deferred.promise;
            },

            getActiveCast: function (){
                return activeCast;
            },

            setActiveCast: function(cast){
                activeCast = cast;
            }


        }


    });
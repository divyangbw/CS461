// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('reports', ['ionic', 'reports.controllers', 'reports.services', 'reports.factory' , 'angular.filter'])

    .run(function ($ionicPlatform) {
        // Dont do anthing yet

    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider


            .state('auth', {
                url: "/auth",
                templateUrl: "/static/templates/auth.html",
                controller: 'AuthCtrl'
            })


            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "/static/templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: '/static/templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('tab.answerQuestions', {
                url: '/home/answerQuestions/:id',
                views: {
                    'tab-home': {
                        templateUrl: '/static/templates/answerQuestions.html',
                        controller: 'AnswerQuestionsCtrl'
                    }
                }
            })


            /*
            .state('tab.source', {
                url: '/home/source',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/source.html',
                        controller: 'SourceCtrl'
                    }
                }
            })
            */

            .state('tab.results', {
                url: '/results',
                views: {
                    'tab-results': {
                        templateUrl: '/static/templates/results.html',
                        controller: 'ResultsCtrl'
                    }
                }
            })

            .state('tab.newsCasts', {
                url: '/newsCasts',
                views: {
                    'tab-newsCasts': {
                        templateUrl: '/static/templates/newsCasts.html',
                        controller: 'NewsCastsCtrl'
                    }
                }
            })

            .state('tab.segments', {
                url: '/newsCasts/segments',
                views: {
                    'tab-newsCasts': {
                        templateUrl: '/static/templates/segments.html',
                        controller: 'SegmentsCtrl'
                    }
                }
            })

            .state('tab.settings', {
                url: '/settings',
                views: {
                    'tab-settings': {
                        templateUrl: '/static/templates/settings.html',
                        controller: 'SettingsCtrl'
                    }
                }
            })

            .state('tab.editQuestions', {
                url: '/settings/editQuestions',
                views: {
                    'tab-settings': {
                        templateUrl: '/static/templates/editQuestions.html',
                        controller: 'EditQuestionsCtrl'
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/auth');

    });
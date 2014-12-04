angular.module('reports.factory')

    .factory('User', function ($state, $ionicViewService, $rootScope) {

        var CURRENT_USER = getCurrentUser();
        var settings_darkMode = getDarkModeSettings();
        //var settings_collapsed = getCollapseSettings();
        var settings_home_grid = getHomeGridSettings();

        $rootScope.collapsedData = getCollapseSettings();
        $rootScope.background = setBackgroundVal();


        return {

            // Sets the current user and save it in localStorage
            setUser: function(user) {
                localStorage.setItem("User", JSON.stringify(user));
                CURRENT_USER = user;

            },

            getToken: function() {
                return CURRENT_USER.token ? CURRENT_USER.token : -1;
            },

            setToken: function(token, life) {
                CURRENT_USER.token = token;
                CURRENT_USER.life = life;
                localStorage.setItem("User", JSON.stringify(CURRENT_USER));
            },

            // Returns the current user object
            User: CURRENT_USER,

            isLoggedIn: function() {
                return CURRENT_USER !== {} && CURRENT_USER["token"] !== undefined;
            },

            authCheck: function() {
                if (CURRENT_USER === {} || CURRENT_USER["token"] === undefined) {
                    $ionicViewService.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('auth');
                }
            },

            getId: function() {
                return CURRENT_USER.username;
            },

            getRandomUuid: function() {
                return generateUUID();
            },

            getKey: function() {
                return CURRENT_USER.key;
            },

            destroyUser: function() {
                localStorage.removeItem("User");
                CURRENT_USER = {};
            },

            getDarkModeSetting: function() {
                return settings_darkMode;
            },

            getCollapsedSetting: function() {
                console.log($rootScope.collapsedData);
                return $rootScope.collapsedData;
            },

            getBackground: function() {
                return $rootScope.background;
            },

            defaultHomeIsGrid: function() {
                return settings_home_grid;
            },

            toggleDarkMode: function() {
                if (!settings_darkMode) updateBackground(1, true)
                else updateBackground(0, false)
            },

            toggleCollapseMode: function() {
                if (!$rootScope.collapsedData) updateCollapsedData(1, true)
                else updateCollapsedData(0, false)
            },

            toggleHomeGrid: function() {
                if (!settings_home_grid) updateHomeGrid(1, true)
                else updateHomeGrid(0, false)
            }

        }

        // Get the current user from localStorage. Return empty object if it doesn't exist
        function getCurrentUser() {
            var current = localStorage.getItem("User");
            return current ? JSON.parse(current) : {};
        }

        function getDarkModeSettings() {
            var settings = localStorage.getItem("settings_darkmode");
            if (settings !== undefined && settings === "1") return true;
            return false;
        }

        function getCollapseSettings() {
            var settings = localStorage.getItem("settings_collapsed");
            if (settings !== undefined && settings === "1") return true;
            return false;
        }

        function getHomeGridSettings() {
            var settings = localStorage.getItem("settings_home_grid");
            if (settings !== undefined && settings === "1") return true;
            return false;
        }

        function updateBackground(value, boolVal) {
            localStorage.setItem("settings_darkmode", value);
            settings_darkMode = boolVal;
            $rootScope.background = setBackgroundVal();
        }

        function updateCollapsedData(value, boolVal) {
            localStorage.setItem("settings_collapsed", value);
            $rootScope.collapsedData = boolVal;
        }

        function updateHomeGrid(value, boolVal) {
            localStorage.setItem("settings_home_grid", value);
            settings_home_grid = boolVal;
        }

        function setBackgroundVal() {
            return settings_darkMode ? "pat-green-fibers dark-mode" : "pat-shattered";
        }

        function generateUUID() {
            var d = Date.now();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                var toReturn = (c=='x' ? r : (r&0x7|0x8)).toString(16);
                return toReturn;
            });
            return uuid;
        }

    });
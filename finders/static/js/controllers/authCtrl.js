angular.module('reports.controllers')
    .controller('AuthCtrl', function ($scope, $state, $ionicViewService, $ionicLoading, $ionicPopup, $timeout, $ionicModal, User, ApiService) {

        init();

        /*======================================================*
            EVENTS
         *======================================================*/

        $scope.showRegister = function() {
            $scope.registerModal.show();
        }

        $scope.login = function (user) {

            if (!user)
                showResponse(true, true, false);
            else if (!user.email)
                showResponse(true, false, false);
            else if (!user.password)
                showResponse(false, true, false);
            else {
                showResponse(false, false, true);
                loginUser(user);
            }

        };

        $scope.register = function(user) {
            console.log(user)
            if (!user || user === undefined || user === {} || user.length < 1)
                showRegisterResponse(true, true, true, true, false);
            else if (!user.email || !isValidEmail(user.email))
                showRegisterResponse(true, false, false, false, false);
            else if (!user.password || !isValidPassword(user.password))
                showRegisterResponse(false, true, false, false, false);
            else if (!user.first || user.first.legnth < 3)
                showRegisterResponse(false, false, true, false, false);
            else if (!user.last || user.last.legnth < 3)
                showRegisterResponse(false, false, false, true, false);
            else {
                showRegisterResponse(false, false, false, false, true);
                registerUser(user);
            }
        }

        /*======================================================*
            CONSTRUCTIONS
         *======================================================*/

        $ionicModal.fromTemplateUrl('register.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.registerModal = modal;
            $scope.reg = {};
        });



        /*======================================================*
            HELPER FUNCTIONS
         *======================================================*/

        function init() {
            $scope.showView = true;
            $scope.regError = false;
            $scope.regErrorMsg = "";
            if (User.isLoggedIn()) {
                goHome();
            } else
                $scope.showView = true;
        }

        function goHome() {
            $ionicViewService.nextViewOptions({
                disableAnimate: false,
                disableBack: true
            });
            $ionicLoading.hide();
            $state.go('tab.home');
        }

        function showResponse(userError, passError, isLoading) {

            $scope.form_user_condition = userError ? "login_form_error" : "";
            $scope.form_pass_condition = passError ? "login_form_error" : "";
            if (isLoading)
                $ionicLoading.show({
                    template: 'Loggin in...'
                });
        }

        function showRegisterResponse(user, pass, first, last, isLoading) {
            $scope.regError = isLoading ? false : true;
            if (user && pass && first && last) $scope.regErrorMsg = "At least enter something :P";
            else {
                if (user) $scope.regErrorMsg = "The email address you entered is empty or not valid.";
                else if (pass) $scope.regErrorMsg = "Passwords needs to be minimum 8 character, contain uppercase, lowercase, and number.";
                else if (first) $scope.regErrorMsg = "First name needs to be at least 3 characters long. ";
                else if (last) $scope.regErrorMsg = "Last name needs to be at least 3 characters long. ";
            }

            if (isLoading)
                $ionicLoading.show({
                    template: 'Loggin in...'
                });
        }

        /* API CALLS */

        function loginUser(user) {
            ApiService.login(user).then(function (response) {
                $timeout(function () {
                    goHome();
                }, 500);
            }, function (error) {
                $ionicLoading.hide();
                showError(error);
            });
        }

        function registerUser(user) {
            console.log(user);
            ApiService.register(user).then(function (response) {
                $timeout(function () {
                    $scope.registerModal.hide();
                    goHome();
                }, 500);
            }, function (error) {
                $ionicLoading.hide();
                showError(error);
            });
        }

        function showError(error) {
            console.log(error);
            if (error.data && error.data.code === 400) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Oops, Failed to Login!',
                    template: "Please make sure your email and password are correct."
                });
            }
        }

        /* VALIDATIONS */

        function isValidEmail(email) {
            var re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
            return re.test(email);
        }

        function isValidPassword(password) {
            var islengthOk = password.length > 2;
            //var hasUpperCase = /[A-Z]/.test(password);
            //var hasLowerCase = /[a-z]/.test(password);
            //var hasNumbers = /\d/.test(password);
            return islengthOk;// && hasUpperCase && hasLowerCase && hasNumbers;
        }

    }
);

angular.module('reports.controllers')
    .controller('LoginCtrl', function ($scope, $ionicViewService, $state, $ionicLoading, $timeout, ApiService, User) {

        $scope.logout = function () {

            ApiService.logout().then(function (response) {
                $ionicLoading.show({
                    template: 'Loggin out...'
                });
                User.destroyUser();
                $timeout(function () {
                    goToAuth();
                }, 500);
            }, function () {
                alert("Oops. Something went wrong.");
            });

        }

        function goToAuth() {
            $ionicViewService.nextViewOptions({
                disableBack: true
            });
            $ionicLoading.hide();
            $state.go('auth');
        }

    });
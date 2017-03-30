angular.module('bz-inventario', ['ionic', 'firebase', 'configs'])

.run(function ($ionicPlatform, CONFIG) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);


        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        firebase.initializeApp({
            apiKey: CONFIG.FIREBASE_API,
            authDomain: CONFIG.FIREBASE_AUTH_DOMAIN,
            databaseURL: CONFIG.FIREBASE_DB_URL,
            storageBucket: CONFIG.FIREBASE_STORAGE,
            messagingSenderId: CONFIG.FIREBASE_STORAGE
        });


    });
})

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.navBar.alignTitle('center');

    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'appController'
    })

    .state('login', {
        url: '/login',
        templateUrl: "templates/login.html",
        controller: "loginController"
    })

    .state('signup', {
        url: '/signup',
        templateUrl: "templates/signup.html",
        controller: "signupController"
    })

    .state('reset', {
        url: '/reset',
        templateUrl: "templates/resetemail.html",
        controller: "resetController"
    })



   

    .state('app.registro', {
        url: '/registro',
        views: {
            'menuContent': {
                templateUrl: "templates/registro.html",
                controller: "registroController as registro"
            }
        }
    })
    
     .state('app.reportes', {
        url: '/reportes',
        views: {
            'menuContent': {
                templateUrl: "templates/reportes.html",
                controller: "reportesController as reportes"
            }
        }
    })

    .state('app.usuarios', {
        url: '/usuarios',
        views: {
            'menuContent': {
                templateUrl: "templates/usuarios.html",
                controller: "usuariosController"
            }
        }
    })

    $urlRouterProvider.otherwise('/login');

}])

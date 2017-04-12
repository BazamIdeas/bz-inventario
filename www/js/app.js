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
            cache: false,
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


/* Nuevo Movimiento */


            .state('app.registro', {
            url: '/registro',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/registro.html",
                    controller: "registroController as registro"
                }
            }
        })

            .state('app.registroOpciones', {
            url: '/registro/opciones',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/registro.opciones.html",
                    controller: "registroOpcionesController as registroIngreso"
                }
            }
        })

            .state('app.registroIngreso', {
            url: '/registro/ingreso/:id',
            views: {
                'menuContent': {
                    templateUrl: "templates/registro.ingreso.html",
                    controller: "registroIngresoController as registroIngreso"
                }
            }
        })
        
            .state('app.registroEgreso', {
            url: '/registro/egreso/:id',
            views: {
                'menuContent': {
                    templateUrl: "templates/registro.egreso.html",
                    controller: "registroEgresoController as registroEgreso"
                }
            }
        })
      
    /* Almacenes */
            .state('app.almacenes', {
                url: '/almacenes',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/almacenes.html",
                        controller: "almacenesController as almacenes"
                    }
                }
            })

            .state('app.almacenesOpciones', {
                url: '/almacenes/opciones',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/almacenes.opciones.html',
                        controller: 'almacenesOpcionesController as almacenesOp'

                    }
                }
            })

            .state('app.almacenesRegistro', {
                url: '/almacenes/registro',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/almacenes.registro.html',
                        controller: 'almacenesRegistroController as almacenesRe'

                    }
                }
            })

            .state('app.almacenesDetalles', {
                url: '/almacenes/detalles/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/almacenes.detalles.html',
                        controller: 'almacenesDetallesController as almacenesDe'

                    }
                }
            })

            .state('app.almacenesReporteTodo', {
                url: '/almacenes/reporte/todo/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/almacenes.reporteTodo.html',
                        controller: 'almacenesReporteTodoController as almacenesReTo'

                    }
                }
            })

            .state('app.almacenesReporteIngresos', {
                url: '/almacenes/reporte/ingresos/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/almacenes.reporteIngresos.html',
                        controller: 'almacenesReporteIngresosController as almacenesReIn'

                    }
                }
            })

            .state('app.almacenesReporteEgresos', {
                url: '/almacenes/reporte/egresos/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/almacenes.reporteEgresos.html',
                        controller: 'almacenesReporteIngresosController as almacenesReEn'

                    }
                }
            })

            .state('app.almacenesEliminar', {
                url: '/almacenes/eliminar/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/almacenes.eliminar.html',
                        controller: 'almacenesEliminarController as almacenesEl'

                    }
                }
            })
        
         /* Producto */
        
            .state('app.productos', {
                url: '/productos',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/productos.html",
                        controller: "productosController as productos"
                    }
                }
            })
        
        /* Proveedores */
        
          .state('app.proveedores', {
                url: '/proveedores',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/proveedores.html",
                        controller: "proveedoresController as proveedores"
                    }
                }
            })
        
        
        /* Trabajadores */
        
        .state('app.trabajadores', {
                url: '/trabajadores',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/trabajadores.html",
                        controller: "trabajadoresController as trabajadores"
                    }
                }
            })
        

         /* usuarios */
        
            .state('app.usuarios', {
                url: '/usuarios',
                
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/usuarios.html",
                        controller: "usuariosController as usuarios"
                    }
                }
            })


            .state('app.usuariosListado', {
                url: '/usuarios/listado',
                views: {
                    'menuContent': {
                        templateUrl: "templates/usuarios.listado.html",
                        controller: "usuariosListadoController as usuariosLi"
                    }
                }
            })


            .state('app.usuariosRegistro', {
                url: '/usuarios/registro',
                views: {
                    'menuContent': {
                        templateUrl: "templates/usuarios.registro.html",
                        controller: "usuariosRegistroController as usuariosRe"
                    }
                }
            })
            

        $urlRouterProvider.otherwise('/login');

    }])

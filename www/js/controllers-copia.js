angular.module('bz-inventario')

.controller('loginController', ['$scope', '$firebaseArray', 'CONFIG', '$document', '$state', 'usuarioService', 'storageFactory', function ($scope, $firebaseArray, CONFIG, $document, $state, usuarioService, storageFactory) {



    // Perform the login action when the user submits the login form
    $scope.doLogin = function (userLogin, valido) {

        if (valido) {


            firebase.auth().signInWithEmailAndPassword(userLogin.username, userLogin.password).then(function (firebaseUser) {
                // Sign-In successful.



                usuarioService.login(firebaseUser.email, firebaseUser.uid).then(function (res) {

                    storageFactory.definir('usuario', res);

                    $state.go("app.registro", {}, {
                        reload: true
                    });

                })

                .catch(function (res) {

                    console.log("error del servidor")

                })


            }).catch(function (error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                if (errorCode === 'auth/invalid-email') {
                    alert('Usa un email valido.');
                    return false;
                } else if (errorCode === 'auth/wrong-password') {
                    alert('Contraseña incorrecta.');
                    return false;
                } else if (errorCode === 'auth/argument-error') {
                    alert('Contraseña incorrecta.');
                    return false;
                } else if (errorCode === 'auth/user-not-found') {
                    alert('Usuario no encontrado.');
                    return false;
                } else if (errorCode === 'auth/too-many-requests') {
                    alert('Demasiados intentos, por favor intentalo más tarde.');
                    return false;
                } else if (errorCode === 'auth/network-request-failed') {
                    alert('El tiempo de espera se agotó, por favor intentalo nuevamente.');
                    return false;
                } else {
                    alert(errorMessage);
                    return false;
                }
            })




        }


    }; // end $scope.doLogin()

}])

.controller('appController', ['$scope', '$firebaseArray', 'CONFIG', '$document', '$state', 'storageFactory', function ($scope, $firebaseArray, CONFIG, $document, $state, storageFactory) {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {


        } else {
            // No user is signed in.
           $state.go("login", {reload: true}, {
                    reload: true
                });
        }
    });

    $scope.userDatos = storageFactory.obtener('usuario');


    $scope.doLogout = function () {

            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                //console.log("Logout successful");
                $state.go("login", {reload: true}, {
                    reload: true
                });

            }, function (error) {
                // An error happened.
                console.log(error);
            });

        } // end dologout()



}])

.controller('resetController', ['$scope', '$state', '$document', '$firebaseArray', 'CONFIG', function ($scope, $state, $document, $firebaseArray, CONFIG) {

    $scope.doResetemail = function (userReset) {



        //console.log(userReset);

        if ($document[0].getElementById("ruser_name").value != "") {


            firebase.auth().sendPasswordResetEmail(userReset.rusername).then(function () {
                // Sign-In successful.
                //console.log("Reset email sent successful");

                $state.go("login", {}, {
                    reload: true
                });


            }, function (error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);


                if (errorCode === 'auth/user-not-found') {
                    alert('No se encontro un usuario con este email.');
                    return false;
                } else if (errorCode === 'auth/invalid-email') {
                    alert('El email es invalido.');
                    return false;
                }

            });



        } else {

            alert('Por favor introduce un email valido para enviarte un link');
            return false;

        } //end check client username password


    }; // end $scope.doSignup()



}])



.controller('signupController', ['$scope', '$state', '$document', '$firebaseArray', 'CONFIG', function ($scope, $state, $document, $firebaseArray, CONFIG) {

    $scope.doSignup = function (userSignup) {




        if ($document[0].getElementById("cuser_name").value != "" && $document[0].getElementById("cuser_pass").value != "") {


            firebase.auth().createUserWithEmailAndPassword(userSignup.cusername, userSignup.cpassword).then(function () {
                // Sign-In successful.
                //console.log("Signup successful");

                var user = firebase.auth().currentUser;

                user.sendEmailVerification().then(function (result) {
                    console.log(result)
                }, function (error) {
                    console.log(error)
                });



            }, function (error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);

                if (errorCode === 'auth/weak-password') {
                    alert('Password is weak, choose a strong password.');
                    return false;
                } else if (errorCode === 'auth/email-already-in-use') {
                    alert('Email you entered is already in use.');
                    return false;
                }




            });



        } else {

            alert('Please enter email and password');
            return false;

        } //end check client username password


    }; // end $scope.doSignup()



}])



/***********************************/
/************ REGISTRO *************/
/***********************************/

.controller('registroController', ['$scope', '$firebaseArray', 'CONFIG', 'bodegaService', '$stateParams', '$window', function ($scope, $firebaseArray, CONFIG, bodegaService, $stateParams, $window) {

    if ($stateParams.reload) {
        $window.location.reload();

    }


    var bz = this;

    bz.almacenElegido = {};

    bz.listaAlmacenes = [];

    bodegaService.lista

        .then(function (res) {

        bz.listaAlmacenes = res.data.result;

    });

}])




.controller('registroIngresoController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'productoService', 'ordenService', 'proveedorService', '$state', function ($scope, $firebaseArray, CONFIG, $stateParams, productoService, ordenService, proveedorService, $state) {

   

    var bz = this;

    bz.bodega = {
        bodega: $stateParams.nombre,
        idBodega: $stateParams.id
    }

    bz.registro = {

        ingresos: []

    }

    bz.productos = [];

    bz.proveedores = []

    proveedorService.lista.then(function (res) {

        bz.proveedores = res.data.result;

    });

    productoService.lista

        .then(function (res) {

        bz.productos = res.data.result;

    });

    bz.registrar = function (registro, valido) {
       
        if (valido) {
            
            console.log("lo hace")
            
            ordenService.nuevoIngreso(registro).then(function (res) {

                $state.go('app.operacionResuelta', {
                    resultado: true,
                    operacion: "Registro de Ingreso",
                    destino: "app.registro"
                }, {
                    reload: true
                })
            })

        }

    }

}])

.controller('registroEgresoController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'trabajadorService', 'productoService', 'ordenService', 'storageFactory', '$state', function ($scope, $firebaseArray, CONFIG, $stateParams, trabajadorService, productoService, ordenService, storageFactory, $state) {


   

    var bz = this;

    bz.userDatos = storageFactory.obtener('usuario');


    bz.bodega = {
        bodega: $stateParams.nombre,
        idBodega: $stateParams.id
    }

    bz.registro = {
        egresos: []
    }

    bz.trabajadores = [];

    bz.productos = [];

    trabajadorService.lista.then(function (res) {

        bz.trabajadores = res.data.result;;

    });

    productoService.lista

        .then(function (res) {

        bz.productos = res.data.result;

    });

    bz.registrar = function (registro, valido) {
        if (valido) {

            ordenService.nuevoEgreso(registro).then(function (res) {

                $state.go('app.operacionResuelta', {
                    resultado: true,
                    operacion: "Registro de Egreso",
                    destino: "app.registro"
                })

            })
        }
    }





}])

/***********************************/
/********** PRODUCTOS **************/
/***********************************/

.controller('productosController', ['$scope', '$firebaseArray', 'CONFIG', 'productoService', '$ionicModal', '$stateParams', '$window', function ($scope, $firebaseArray, CONFIG, productoService, $ionicModal, $stateParams, $window) {

    if ($stateParams.reload) {
        $window.location.reload();

    }

    var bz = this;

    bz.productos = [];

    productoService.lista

        .then(function (res) {

        bz.productos = res.data.result;

    });

    bz.eliminar = function (idProducto, indice) {

        productoService.eliminar(idProducto)

        .then(function (res) {

                bz.productos.splice(indice, 1);
                bz.modal.hide();

            })
            .catch(function (res) {



            })

    }


    $ionicModal.fromTemplateUrl('templates/modals/productos.detalles.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modal = modal;
    });

    bz.abrirModal = function (datosProducto, indice) {
        console.log(datosProducto)
        bz.datosProducto = datosProducto;
        bz.indiceProducto = indice;
        bz.modal.show();
    };
    bz.cerrarModal = function () {
        bz.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        bz.modal.remove();
    });




}])



.controller('productosRegistroController', ['$scope', '$firebaseArray', 'CONFIG', 'productoService', "$state", function ($scope, $firebaseArray, CONFIG, productoService, $state) {

    

    var bz = this;

    bz.productos = {};

    bz.registrar = function (producto, valido) {

        if (valido) {

            productoService.registrar(producto).then(function (res) {

                $state.go('app.operacionResuelta', {
                    resultado: true,
                    operacion: "Registro de Producto",
                    destino: "app.productos"
                })

            })

        }

    }

}])




/***********************************/
/************ USUARIOS *************/
/***********************************/

.controller('usuariosController', ['$scope', '$firebaseArray', 'CONFIG', 'usuarioService', '$stateParams', '$window', function ($scope, $firebaseArray, CONFIG, usuarioService, $stateParams, $window) {

    if ($stateParams.reload) {
        $window.location.reload();

    }


    var bz = this;

    bz.usuarios = [];

    usuarioService.lista.then(function (res) {

        bz.usuarios = res.data.result;

    });

}])


.controller('usuariosRegistroController', ['$scope', 'usuarioService', '$firebaseAuth', "$state",  function ($scope, usuarioService, $firebaseAuth, $state) {


    var bz = this;

    bz.usuario = {};

    bz.registrar = function (usuario, valido) {

        if (valido) {

            $firebaseAuth().$createUserWithEmailAndPassword(usuario.email, usuario.clave).then(function (firebaseUser) {

                    usuario.uid = firebaseUser.uid;

                    usuarioService.registrar(usuario).then(function (res) {

                        $state.go('app.operacionResuelta', {
                            resultado: true,
                            operacion: "Registro de usuario",
                            destino: "app.usuarios"
                        })
                    });

                })
                .catch(function (error) {

                    /* ESPECIFICAR ERROR */
                    if (error.code == "auth/email-already-in-use") {

                        $state.go('app.operacionResuelta', {
                            resultado: false,
                            operacion: "Registro de usuario",
                            destino: "app.usuarios"
                        })

                    } else {

                        $state.go('app.operacionResuelta', {
                            resultado: false,
                            operacion: "Registro de usuario",
                            destino: "app.usuarios"
                        })

                    }

                })

        }

    }
}])

.controller('usuariosListadoController', ['$scope', '$firebaseArray', 'CONFIG', function ($scope, $firebaseArray, CONFIG) {


    this.algo = "yyy";

}])

/***********************************/
/*********** PROVEEDORES ***********/
/***********************************/


.controller('proveedoresController', ['$scope', '$firebaseArray', 'CONFIG', 'proveedorService', '$stateParams', '$window', function ($scope, $firebaseArray, CONFIG, proveedorService, $stateParams, $window) {

    if ($stateParams.reload) {
        $window.location.reload();

    }

    var bz = this;


    bz.proveedores = []

    proveedorService.lista.then(function (res) {

        bz.proveedores = res.data.result;

    });

}])


.controller('proveedoresRegistroController', ['$scope', '$firebaseArray', 'CONFIG', 'proveedorService', "$state", function ($scope, $firebaseArray, CONFIG, proveedorService, $state) {
    
   


    var bz = this;

    bz.proveedor = {};

    bz.registrar = function (proveedor, valido) {

        if (valido) {

            proveedorService.registrar(proveedor).then(function (res) {

                $state.go('app.operacionResuelta', {
                    resultado: true,
                    operacion: "Registro de Proveedor",
                    destino: "app.proveedores"
                })

            })

        }

    }

}])


/***********************************/
/********* TRABAJADORES ************/
/***********************************/

.controller('trabajadoresController', ['$scope', '$firebaseArray', 'CONFIG', 'trabajadorService', '$stateParams', '$window', function ($scope, $firebaseArray, CONFIG, trabajadorService, $stateParams, $window) {
    
      if ($stateParams.reload) {
        $window.location.reload();

    }

    var bz = this;

    bz.trabajadores = []

    trabajadorService.lista.then(function (res) {

        bz.trabajadores = res.data.result;

    });

}])

.controller('trabajadoresRegistroController', ['$scope', '$firebaseArray', 'CONFIG', 'trabajadorService', '$state', function ($scope, $firebaseArray, CONFIG, trabajadorService, $state) {

    var bz = this;

    bz.trabajador = {};

    bz.registrar = function (trabajador, valido) {

        if (valido) {

            trabajadorService.registrar(trabajador).then(function (res) {

                $state.go('app.operacionResuelta', {
                    resultado: true,
                    operacion: "Registro de Trabajador",
                    destino: "app.trabajadores"
                })

            })

        }

    }

}])

/***********************************/
/*********** ALMACENES *************/
/***********************************/

.controller('almacenesController', ['$scope', '$firebaseArray', 'CONFIG', 'bodegaService', '$window', '$stateParams', function ($scope, $firebaseArray, CONFIG, bodegaService, $window, $stateParams) {


    if ($stateParams.reload) {
        $window.location.reload();

    }



    var bz = this;

    bz.almacenElegido = {};

    bz.listaAlmacenes = [];

    bodegaService.lista

        .then(function (res) {

        bz.listaAlmacenes = res.data.result;

    });






}])

.controller('almacenesDetallesController', ['$scope', '$stateParams', 'bodegaService', 'paramsNoExisteResolve', '$ionicModal', '$state', 'productoService', 'movimientosService', '$window', function ($scope, $stateParams, bodegaService, paramsNoExisteResolve, $ionicModal, $state, productoService, movimientosService, $window) {


    if ($stateParams.reload) {
        
        $window.location.reload();

    }



    var bz = this;

    if (paramsNoExisteResolve) {

        bz.bodega = {
            bodega: paramsNoExisteResolve.nombre,
            idBodega: paramsNoExisteResolve.id
        }

    } else {

        bz.bodega = {
            bodega: $stateParams.nombre,
            idBodega: $stateParams.id
        }

    }



    bz.productos = [];

    bodegaService.productos(bz.bodega.idBodega).then(function (res) {

        bz.productos = res;

    })


    bz.eliminar = function (idAlmacen) {

        bodegaService.eliminar(idAlmacen).then(function (res) {

                $state.go('app.almacenes', {
                    reload: true
                }, {
                    reload: true
                });

            })
            .catch(function (res) {


            })
    }


    bz.movimientosProducto = [];





    /***** MODAL PARA ELIMINAR ALMACEN ***/

    $ionicModal.fromTemplateUrl('templates/modals/almacenes.eliminar.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modal = modal;
    });

    bz.abrirModal = function () {

        bz.modal.show();
    };
    bz.cerrarModal = function () {
        bz.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        bz.modal.remove();
    });






    /****MODAL PARA VER MOVIMIENTOS DE UN PRODUCTO*****/

    $ionicModal.fromTemplateUrl('templates/modals/almacenes.productos.detalles.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modalProducto = modal;
    });

    bz.abrirModalProducto = function (idAlmacen, idProducto) {

        console.log(idProducto)
        productoService.movimientos(idAlmacen, idProducto)

        .then(function (res) {
                bz.filtro = "Egreso";

                bz.movimientosProducto = res;
                bz.modalProducto.show();

            })
            .catch(function (res) {

                console.log("fallo")


            })

    };
    bz.cerrarModalProducto = function () {

        bz.modalProducto.hide();

    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {

        bz.modalProducto.remove();

    });




    /****MODAL PARA VER MOVIMIENTO ESPECIFICO*****/

    $ionicModal.fromTemplateUrl('templates/modals/almacenes.productos.movimiento.detalles.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modalMovimiento = modal;
    });

    bz.abrirModalMovimiento = function (movimiento) {


        var idMovimiento = (movimiento.tipo == "Ingreso") ? movimiento.idIngreso : movimiento.idEgreso;



        if (idMovimiento) {
            movimientosService.detalles(idMovimiento)

            .then(function (res) {
                    bz.movimiento = res;
                    bz.modalMovimiento.show();

                })
                .catch(function (res) {

                    console.log("fallo")


                })
        }

    };
    bz.cerrarModalMovimiento = function () {

        bz.modalMovimiento.hide();

    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {

        bz.modalMovimiento.remove();

    });


    bz.crearFecha = function (fecha) {


        var fechaCreada = new Date(fecha);

        return fechaCreada;

    }

}])


.controller('almacenesRegistroController', ['$scope', '$firebaseArray', 'CONFIG', 'bodegaService', "$state", '$window', '$stateParams', function ($scope, $firebaseArray, CONFIG, bodegaService, $state, $window, $stateParams) {

    if ($stateParams.reload) {
        $window.location.reload();

    }

    var bz = this;

    bz.nombre = "";

    bz.registrar = function (bodega, valido) {

        if (valido) {

            bodegaService.registrar(bodega).then(function (res) {

                $state.go('app.operacionResuelta', {
                    resultado: true,
                    operacion: "Registro de Almacen",
                    destino: "app.almacenes",
                            reload: true
                }, {
                    reload: true
                })

            });

        }

    }

}])



.controller('almacenesReporteTodoController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'bodegaService', 'paramsNoExisteResolve', '$ionicModal', 'movimientosService', '$window', function ($scope, $firebaseArray, CONFIG, $stateParams, bodegaService, paramsNoExisteResolve, $ionicModal, movimientosService, $window) {

    if ($stateParams.reload) {
        $window.location.reload();

    }

    var bz = this;

    if (paramsNoExisteResolve) {

        bz.bodega = {
            bodega: paramsNoExisteResolve.nombre,
            idBodega: paramsNoExisteResolve.id
        }

    } else {

        bz.bodega = {
            bodega: $stateParams.nombre,
            idBodega: $stateParams.id
        }

    }


    bz.movimientos = [];

    bodegaService.movimientos(bz.bodega.idBodega).then(function (res) {

        bz.movimientos = res;

    });




    bz.eliminarMovimiento = function (idMovimiento, indice) {
        console.log(idMovimiento);

        movimientosService.eliminarMovimiento(idMovimiento)

        .then(function (res) {

                bz.movimientos.splice(indice, 1);

                bz.cerrarModalMovimiento()

            })
            .catch(function (res) {

                console.log("fallo");

            })

    }



    /****MODAL PARA VER MOVIMIENTO ESPECIFICO*****/

    $ionicModal.fromTemplateUrl('templates/modals/almacenes.todo.movimiento.detalles.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modalMovimiento = modal;
    });

    bz.abrirModalMovimiento = function (movimiento, indice) {


        bz.indiceMovimiento = indice;

        if (movimiento.idMovimiento) {

            movimientosService.detalles(movimiento.idMovimiento)

            .then(function (res) {

                    bz.movimiento = res;


                    bz.modalMovimiento.show();

                })
                .catch(function (res) {

                    console.log("fallo")

                })
        }

    };

    bz.cerrarModalMovimiento = function () {

        bz.modalMovimiento.hide();

    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {

        bz.modalMovimiento.remove();

    });


    bz.crearFecha = function (fecha) {


        var fechaCreada = new Date(fecha);

        return fechaCreada;

    }


}])

.controller('almacenesReporteIngresosController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'bodegaService', 'paramsNoExisteResolve', 'movimientosService', '$ionicModal', '$window', function ($scope, $firebaseArray, CONFIG, $stateParams, bodegaService, paramsNoExisteResolve, movimientosService, $ionicModal, $window) {

    if ($stateParams.reload) {
        $window.location.reload();

    }

    var bz = this;

    if (paramsNoExisteResolve) {

        bz.bodega = {
            bodega: paramsNoExisteResolve.nombre,
            idBodega: paramsNoExisteResolve.id
        }

    } else {

        bz.bodega = {
            bodega: $stateParams.nombre,
            idBodega: $stateParams.id
        }

    }

    bz.ingresos = []

    bodegaService.ingresos(bz.bodega.idBodega).then(function (res) {

        bz.ingresos = res;

    });



    bz.eliminarOrden = function (idIngreso, indice) {

        movimientosService.eliminarOrden("ingreso", idIngreso)

        .then(function (res) {

                bz.ingresos.splice(indice, 1);
                bz.modalMovimientos.hide();

            })
            .catch(function (res) {

            })

    }



    /****MODAL PARA VER LISTA DE MOVIMIENTOS DE ORDEN ESPECIFICA*****/

    $ionicModal.fromTemplateUrl('templates/modals/almacenes.ingresos.detalles.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modalMovimientos = modal;
    });



    bz.abrirModalMovimientos = function (ingreso, idAlmacen, indice) {

        if (ingreso.idIngreso) {
            bz.ordenIngreso = ingreso;
            bz.indiceOrden = indice;

            movimientosService.movimientosOrden("ingreso", ingreso.idIngreso, idAlmacen)

            .then(function (res) {
                    bz.movimientos = res;
                    bz.modalMovimientos.show();


                })
                .catch(function (res) {

                    console.log("fallo")


                })
        }

    };
    bz.cerrarModalMovimientos = function () {

        bz.modalMovimientos.hide();

    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {

        bz.modalMovimientos.remove();

    });



    /****MODAL PARA VER MOVIMIENTO ESPECIFICO*****/

    $ionicModal.fromTemplateUrl('templates/modals/almacenes.ingresos.movimiento.detalles.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modalMovimiento = modal;
    });

    bz.abrirModalMovimiento = function (movimiento) {


        bz.movimiento = movimiento;
        bz.modalMovimiento.show();



    };
    bz.cerrarModalMovimiento = function () {

        bz.modalMovimiento.hide();

    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {

        bz.modalMovimiento.remove();

    });


    bz.crearFecha = function (fecha) {


        var fechaCreada = new Date(fecha);

        return fechaCreada;

    }



}])

.controller('almacenesReporteEgresosController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'bodegaService', 'paramsNoExisteResolve', '$ionicModal', 'movimientosService', '$window', function ($scope, $firebaseArray, CONFIG, $stateParams, bodegaService, paramsNoExisteResolve, $ionicModal, movimientosService, $window) {

    if ($stateParams.reload) {
        $window.location.reload();

    }


    var bz = this;

    if (paramsNoExisteResolve) {

        bz.bodega = {
            bodega: paramsNoExisteResolve.nombre,
            idBodega: paramsNoExisteResolve.id
        }

    } else {

        bz.bodega = {
            bodega: $stateParams.nombre,
            idBodega: $stateParams.id
        }

    }

    bz.egresos = []

    bodegaService.egresos(bz.bodega.idBodega).then(function (res) {

        bz.egresos = res;

    });

    bz.eliminarOrden = function (idEgreso, indice) {

        movimientosService.eliminarOrden("egreso", idEgreso)

        .then(function (res) {

                bz.egresos.splice(indice, 1);
                bz.modalMovimientos.hide();

            })
            .catch(function (res) {

            })

    }



    /****MODAL PARA VER LISTA DE MOVIMIENTOS DE ORDEN ESPECIFICA*****/

    $ionicModal.fromTemplateUrl('templates/modals/almacenes.egresos.detalles.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modalMovimientos = modal;
    });



    bz.abrirModalMovimientos = function (egreso, idAlmacen, indice) {

        if (egreso.idEgreso) {

            bz.ordenEgreso = egreso;
            bz.indiceOrden = indice;

            movimientosService.movimientosOrden("egreso", egreso.idEgreso, idAlmacen)

            .then(function (res) {
                    bz.movimientos = res;
                    bz.modalMovimientos.show();


                })
                .catch(function (res) {

                    console.log("fallo")


                })
        }

    };
    bz.cerrarModalMovimientos = function () {

        bz.modalMovimientos.hide();

    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {

        bz.modalMovimientos.remove();

    });



    /****MODAL PARA VER MOVIMIENTO ESPECIFICO*****/

    $ionicModal.fromTemplateUrl('templates/modals/almacenes.egresos.movimiento.detalles.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modalMovimiento = modal;
    });

    bz.abrirModalMovimiento = function (movimiento) {


        bz.movimiento = movimiento;
        bz.modalMovimiento.show();



    };
    bz.cerrarModalMovimiento = function () {

        bz.modalMovimiento.hide();

    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {

        bz.modalMovimiento.remove();

    });


    bz.crearFecha = function (fecha) {


        var fechaCreada = new Date(fecha);

        return fechaCreada;

    }

}])



.controller('operacionResueltaController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', "$state", function ($scope, $firebaseArray, CONFIG, $stateParams, $state) {

    var bz = this;

    bz.datos = {

        operacion: $stateParams.operacion,
        resultado: $stateParams.resultado,
        destino: $stateParams.destino

    }

    bz.redirigir = function (destino) {

        $state.go(destino, {
            reload: true
        });

    }

}])

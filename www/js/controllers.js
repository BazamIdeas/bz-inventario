angular.module('bz-inventario')

.controller('loginController', ['$scope', '$firebaseArray', 'CONFIG', '$document', '$state', function ($scope, $firebaseArray, CONFIG, $document, $state) {



    // Perform the login action when the user submits the login form
    $scope.doLogin = function (userLogin) {



        console.log(userLogin);

        if ($document[0].getElementById("user_name").value != "" && $document[0].getElementById("user_pass").value != "") {


            firebase.auth().signInWithEmailAndPassword(userLogin.username, userLogin.password).then(function () {
                // Sign-In successful.
                //console.log("Login successful");




                var user = firebase.auth().currentUser;

                var name, email, uid;

                if (user.emailVerified) { //check for verification email confirmed by user from the inbox

                    console.log("email verified");
                    $state.go("app.registro");

                    name = user.displayName;
                    email = user.email;

                    uid = user.uid;

                    //console.log(name + "<>" + email + "<>" +  photoUrl + "<>" +  uid);



                } else {

                    alert("Email not verified, please check your inbox or spam messages")
                    return false;

                } // end check verification email


            }, function (error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                if (errorCode === 'auth/invalid-email') {
                    alert('Enter a valid email.');
                    return false;
                } else if (errorCode === 'auth/wrong-password') {
                    alert('Incorrect password.');
                    return false;
                } else if (errorCode === 'auth/argument-error') {
                    alert('Password must be string.');
                    return false;
                } else if (errorCode === 'auth/user-not-found') {
                    alert('No such user found.');
                    return false;
                } else if (errorCode === 'auth/too-many-requests') {
                    alert('Too many failed login attempts, please try after sometime.');
                    return false;
                } else if (errorCode === 'auth/network-request-failed') {
                    alert('Request timed out, please try again.');
                    return false;
                } else {
                    alert(errorMessage);
                    return false;
                }
            });



        } else {

            alert('Please enter email and password');
            return false;

        } //end check client username password


    }; // end $scope.doLogin()

}])

.controller('appController', ['$scope', '$firebaseArray', 'CONFIG', '$document', '$state', function ($scope, $firebaseArray, CONFIG, $document, $state) {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {




        } else {
            // No user is signed in.
            $state.go("login");
        }
    });


    $scope.doLogout = function () {

            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                //console.log("Logout successful");
                $state.go("login");

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

                $state.go("login");


            }, function (error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);


                if (errorCode === 'auth/user-not-found') {
                    alert('No user found with provided email.');
                    return false;
                } else if (errorCode === 'auth/invalid-email') {
                    alert('Email you entered is not complete or invalid.');
                    return false;
                }

            });



        } else {

            alert('Please enter registered email to send reset link');
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

.controller('registroController', ['$scope', '$firebaseArray', 'CONFIG', 'bodegaService', function ($scope, $firebaseArray, CONFIG, bodegaService) {


    var bz = this;

    bz.almacenElegido = {};

    bz.listaAlmacenes = [];

    bodegaService.lista

        .then(function (res) {

        bz.listaAlmacenes = res.data.result;

    });

}])




.controller('registroIngresoController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'productoService', 'ordenService', 'proveedorService', function ($scope, $firebaseArray, CONFIG, $stateParams, productoService, ordenService, proveedorService) {

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

    bz.registrar = function (registro) {

        ordenService.nuevoIngreso(registro).then(function (res) {

            console.log(res)
        })

    }

}])

.controller('registroEgresoController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'trabajadorService', 'productoService', 'ordenService', function ($scope, $firebaseArray, CONFIG, $stateParams, trabajadorService, productoService, ordenService) {


    var bz = this;

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

    bz.registrar = function (registro) {

        console.log(registro)

        ordenService.nuevoEgreso(registro).then(function (res) {


            console.log(res)
        })

    }





}])

/***********************************/
/********** PRODUCTOS **************/
/***********************************/

.controller('productosController', ['$scope', '$firebaseArray', 'CONFIG', 'productoService', '$ionicModal', function ($scope, $firebaseArray, CONFIG, productoService, $ionicModal) {

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

.controller('usuariosController', ['$scope', '$firebaseArray', 'CONFIG', 'usuarioService', function ($scope, $firebaseArray, CONFIG, usuarioService) {

    var bz = this;

    bz.usuarios = [];

    usuarioService.lista.then(function (res) {

        bz.usuarios = res.data.result;

    });

}])


.controller('usuariosRegistroController', ['$scope', 'usuarioService', '$firebaseAuth', "$state", function ($scope, usuarioService, $firebaseAuth, $state) {

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


    this.algo = "hola";

}])

/***********************************/
/*********** PROVEEDORES ***********/
/***********************************/


.controller('proveedoresController', ['$scope', '$firebaseArray', 'CONFIG', 'proveedorService', function ($scope, $firebaseArray, CONFIG, proveedorService) {

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

.controller('trabajadoresController', ['$scope', '$firebaseArray', 'CONFIG', 'trabajadorService', function ($scope, $firebaseArray, CONFIG, trabajadorService) {

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

.controller('almacenesController', ['$scope', '$firebaseArray', 'CONFIG', 'bodegaService', function ($scope, $firebaseArray, CONFIG, bodegaService) {

    var bz = this;

    bz.almacenElegido = {};

    bz.listaAlmacenes = [];

    bodegaService.lista

        .then(function (res) {

        bz.listaAlmacenes = res.data.result;

    });



}])

.controller('almacenesDetallesController', ['$scope', '$stateParams', 'bodegaService', 'paramsNoExisteResolve', '$ionicModal', '$state', 'productoService', 'movimientosService', function ($scope, $stateParams, bodegaService, paramsNoExisteResolve, $ionicModal, $state, productoService, movimientosService) {

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

                $state.go('app.almacenes');

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


.controller('almacenesRegistroController', ['$scope', '$firebaseArray', 'CONFIG', 'bodegaService', "$state", function ($scope, $firebaseArray, CONFIG, bodegaService, $state) {

    var bz = this;

    bz.nombre = "";

    bz.registrar = function (bodega, valido) {

        if (valido) {

            bodegaService.registrar(bodega).then(function (res) {

                $state.go('app.operacionResuelta', {
                    resultado: true,
                    operacion: "Registro de Almacen",
                    destino: "app.almacenes"
                })

            });

        }

    }

}])



.controller('almacenesReporteTodoController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'bodegaService', 'paramsNoExisteResolve', '$ionicModal', 'movimientosService',function ($scope, $firebaseArray, CONFIG, $stateParams, bodegaService, paramsNoExisteResolve, $ionicModal, movimientosService) {


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
                
                console.log(bz.movimiento)
              
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

.controller('almacenesReporteIngresosController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'bodegaService', 'paramsNoExisteResolve', 'movimientosService', '$ionicModal', function ($scope, $firebaseArray, CONFIG, $stateParams, bodegaService, paramsNoExisteResolve, movimientosService, $ionicModal) {

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

      
    
    bz.eliminarOrden = function (idProducto, indice) {

        movimientosService.eliminarOrden(idProducto)

        .then(function (res) {

                bz.productos.splice(indice, 1);
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

    
    // CAMBIAR IDINGRESO POR EL OBJECTO INGRESO
    bz.abrirModalMovimientos = function (ingreso, idAlmacen) {

        if (ingreso.idIngreso) {
            
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

.controller('almacenesReporteEgresosController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'bodegaService', 'paramsNoExisteResolve', '$ionicModal', 'movimientosService', function ($scope, $firebaseArray, CONFIG, $stateParams, bodegaService, paramsNoExisteResolve, $ionicModal, movimientosService) {

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
    
    
    
    /****MODAL PARA VER LISTA DE MOVIMIENTOS DE ORDEN ESPECIFICA*****/

    $ionicModal.fromTemplateUrl('templates/modals/almacenes.egresos.detalles.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modalMovimientos = modal;
    });

    
    // CAMBIAR IDINGRESO POR EL OBJECTO EGRESO
    bz.abrirModalMovimientos = function (egreso, idAlmacen) {
        
        if (egreso.idEgreso) {
            movimientosService.movimientosOrden("egreso", egreso.idEgreso, idAlmacen)

            .then(function (res) {
                console.log(res)
                
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

        $state.go(destino);

    }

}])

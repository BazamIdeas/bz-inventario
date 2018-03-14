angular.module('bz-inventario')

.controller('loginController', ['$scope', '$firebaseArray', 'CONFIG', '$document', '$state', 'usuarioService', 'storageFactory', '$ionicPopup', function ($scope, $firebaseArray, CONFIG, $document, $state, usuarioService, storageFactory, $ionicPopup) {

    $scope.deshabilitar = false;

    // Perform the login action when the user submits the login form
    $scope.doLogin = function (userLogin, valido) {

        if (valido) {

            $scope.deshabilitar = true;

            firebase.auth().signInWithEmailAndPassword(userLogin.username, userLogin.password).then(function (firebaseUser) {
                // Sign-In successful.



                usuarioService.login(firebaseUser.email, firebaseUser.uid).then(function (res) {
                    $scope.deshabilitar = false;

                    storageFactory.definir('usuario', res);

                    $state.go("app.registro", {}, {
                        reload: true
                    });

                })

                .catch(function (res) {
                    $scope.deshabilitar = false;


                    $ionicPopup.alert({
                        template: 'Error del servidor'
                    });

                })


            }).catch(function (error) {

                $scope.deshabilitar = false;

                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;


                if (errorCode === 'auth/invalid-email') {

                    $ionicPopup.alert({
                        template: 'Usa un email valido.'
                    });


                } else if (errorCode === 'auth/wrong-password') {


                    $ionicPopup.alert({
                        template: 'Contraseña incorrecta.'
                    });

                } else if (errorCode === 'auth/argument-error') {
                    $ionicPopup.alert({
                        template: 'Contraseña incorrecta.'
                    });
                } else if (errorCode === 'auth/user-not-found') {
                    $ionicPopup.alert({
                        template: 'Usuario no encontrado.'
                    });
                } else if (errorCode === 'auth/too-many-requests') {

                    $ionicPopup.alert({
                        template: 'Demasiados intentos, por favor en unos minutos.'
                    });
                } else if (errorCode === 'auth/network-request-failed') {

                    $ionicPopup.alert({
                        template: 'El tiempo de espera se agotó, por favor intentalo nuevamente.'
                    });
                } else {
                    $ionicPopup.alert({
                        template: errorMessage
                    });
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
            $state.go("login", {
                reload: true
            }, {
                reload: true
            });
        }
    });

    $scope.userDatos = storageFactory.obtener('usuario');


    $scope.doLogout = function () {

            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                //console.log("Logout successful");
                $state.go("login", {
                    reload: true
                }, {
                    reload: true
                });

            }, function (error) {
                // An error happened.
                console.log(error);
            });

        } // end dologout()



}])

.controller('resetController', ['$scope', '$state', '$firebaseArray', 'CONFIG', '$ionicPopup', function ($scope, $state, $firebaseArray, CONFIG, $ionicPopup) {

    $scope.doResetEmail = function (userReset, valido) {




        if (valido) {


            firebase.auth().sendPasswordResetEmail(userReset).then(function () {


                $ionicPopup.alert({
                    template: 'Correo de cambio de contraseña enviada.'
                });


            }, function (error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;


                if (errorCode === 'auth/user-not-found') {



                    $ionicPopup.alert({
                        template: 'No se encontró un usuario con este correo.'
                    });


                } else if (errorCode === 'auth/invalid-email') {


                    $ionicPopup.alert({
                        template: 'El correo es invalido.'
                    });


                }

            });



        } //end check client username password


    }; // end $scope.doSignup()


    $ionicPopup

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

    bodegaService.lista()

        .then(function (res) {

        bz.listaAlmacenes = res.data.result;

    });

}])




.controller('registroIngresoController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'productoService', 'ordenService', 'proveedorService', '$state', 'storageFactory', function ($scope, $firebaseArray, CONFIG, $stateParams, productoService, ordenService, proveedorService, $state, storageFactory) {


    var bz = this;

    bz.deshabilitar = false;

    bz.userDatos = storageFactory.obtener('usuario');

    bz.bodega = {
        bodega: $stateParams.nombre,
        idBodega: $stateParams.id
    }

    bz.registro = {

        ingresos: [{
            tipo: 'Ingreso',
            bodegas_idBodega: bz.bodega.idBodega,
            usuarios_idUsuario: bz.userDatos.idUsuario
        }]

    }

    bz.productos = [];

    bz.proveedores = [];

    proveedorService.lista().then(function (res) {

        bz.proveedores = res.data.result;

    });

    productoService.lista()

        .then(function (res) {

        bz.productos = res.data.result;

    });

    bz.registrar = function (registro, valido) {

        if (valido) {

            bz.deshabilitar = true;


            ordenService.nuevoIngreso(registro).then(function (res) {
                bz.deshabilitar = false;
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

.controller('registroEgresoController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'trabajadorService', 'productoService', 'ordenService', 'storageFactory', '$state', '$ionicPopup', 'bodegaService', function ($scope, $firebaseArray, CONFIG, $stateParams, trabajadorService, productoService, ordenService, storageFactory, $state, $ionicPopup, bodegaService) {




    var bz = this;

    bz.deshabilitar = false;

    bz.userDatos = storageFactory.obtener('usuario');


    bz.bodega = {
        bodega: $stateParams.nombre,
        idBodega: $stateParams.id
    }

    bz.registro = {
        egresos: [{
            tipo: 'egreso',
            bodegas_idBodega: bz.bodega.idBodega,
            usuarios_idUsuario: bz.userDatos.idUsuario
        }]
    }

    bz.trabajadores = [];

    bz.productos = [];

    trabajadorService.lista().then(function (res) {

        bz.trabajadores = res.data.result;

    });

    /* productoService.lista

         .then(function (res) {

         bz.productos = res.data.result;

     });*/


    bodegaService.productos(bz.bodega.idBodega)
        .then(function (res) {

            bz.productos = res;

        })


    bz.registrar = function (registro, valido) {

        if (valido) {

            bz.deshabilitar = true;

            ordenService.nuevoEgreso(registro).then(function (res) {

                if (res.response) {

                    bz.deshabilitar = false;
                    $state.go('app.operacionResuelta', {
                        resultado: true,
                        operacion: "Registro de Egreso",
                        destino: "app.registro"
                    })


                } else {

                    bz.deshabilitar = false;

                    bz.productosExcedidos = res.resul;

                    $ionicPopup.alert({
                        scope: $scope,
                        template: '<div>No se pudo completar el egreso debido a que las cantidades usadas superan las existencias en el Almacen. Se listan los productos en conflicto a continuación: </div><div class="row" ng-repeat="producto in registroEgreso.productosExcedidos"><div class="col">{{producto}}</div></div>'
                    });

                }

            })
        }
    }


    bz.calcularDiferencia = function (cantidad, id) {

        var cantidadExistente = 0;

        bz.productos.forEach(function (producto, index) {

            if (producto.idProducto == id) {

                cantidadExistente = producto.existencia;

            }

        })

        return parseInt(cantidad) > parseInt(cantidadExistente);

    }

}])

/***********************************/
/********** PRODUCTOS **************/
/***********************************/

.controller('productosController', ['$scope', '$firebaseArray', 'CONFIG', 'productoService', '$ionicModal', '$stateParams', '$window', '$timeout', function ($scope, $firebaseArray, CONFIG, productoService, $ionicModal, $stateParams, $window, $timeout) {


    var bz = this;

    bz.deshabilitar = false;

    bz.productos = [];

    productoService.lista()

        .then(function (res) {

        bz.productos = res.data.result;

        bz.productos.forEach(function (producto, index) {

            productoService.valorUltimoMovimiento(producto.idProducto)

            .then(function (res) {

                bz.productos[index].ultimoPrecio = res.precio;

            })

        })



    });


    bz.eliminar = function (idProducto, indice) {

        bz.deshabilitar = true;

        productoService.eliminar(idProducto)

        .then(function (res) {

                bz.deshabilitar = false;
                bz.productos.splice(indice, 1);
                bz.modal.hide();

            })
            .catch(function (res) {

                bz.deshabilitar = false;

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

    bz.deshabilitar = false;

    bz.productos = {};

    bz.registrar = function (producto, valido) {

        if (valido) {

            bz.deshabilitar = true;

            productoService.registrar(producto).then(function (res) {

                bz.deshabilitar = false;

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

.controller('usuariosController', ['$scope', '$firebaseArray', 'CONFIG', 'usuarioService', '$ionicModal', function ($scope, $firebaseArray, CONFIG, usuarioService, $ionicModal) {

    var bz = this;

    bz.deshabilitar = false;

    bz.usuarios = [];

    usuarioService.lista().then(function (res) {

        bz.usuarios = res.data.result;

    });

    //////////////////////////
    ////Modal de eliminar/////
    //////////////////////////

    $ionicModal.fromTemplateUrl('templates/modals/usuarios.eliminar.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modal = modal;
    });

    bz.abrirModal = function (usuario, indice) {

        bz.usuario = usuario;
        bz.modal.show();

    };
    bz.cerrarModal = function () {
        bz.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        bz.modal.remove();
    });


    ///////////////////////////
    /////Eliminar Usuario//////
    ///////////////////////////


    bz.eliminarUsuario = function (usuario) {



        bz.deshabilitar = true;

        usuarioService.eliminar(usuario.idUsuario)

        .then(function (res) {

            bz.usuarios.splice(bz.usuarios.indexOf(usuario), 1);
            bz.deshabilitar = false;
            bz.cerrarModal();

        })

        .catch(function (res) {


            bz.deshabilitar = false;
            bz.cerrarModal();

        })

    }


    //////////////////////////
    ////Modal de editar///////
    //////////////////////////

    $ionicModal.fromTemplateUrl('templates/modals/usuarios.editar.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modalEditar = modal;
    });


    bz.abrirModalEditar = function (usuario, indice) {

        bz.usuario = {
            idUsuario: usuario.idUsuario,
            nombre: usuario.nombre,
            email: usuario.email,
            tipoUser: usuario.tipoUser
        };
        bz.usuario.indice = bz.usuarios.indexOf(usuario);
        bz.modalEditar.show();

    };
    bz.cerrarModalEditar = function () {
        bz.modalEditar.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        bz.modalEditar.remove();
    });


    /////////////////////////
    ///////editar usuario////
    /////////////////////////


    bz.editarUsuario = function (usuario, valido) {

        var datos = {
            idUsuario: usuario.idUsuario,
            nombre: usuario.nombre,
            email: usuario.email,
            tipoUser: usuario.tipoUser

        }

        bz.deshabilitar = true;

        if (valido) {

            usuarioService.registrar(datos)

            .then(function (res) {
                console.log(res)
                bz.usuarios[usuario.indice].nombre = usuario.nombre;
                bz.deshabilitar = false;
                bz.cerrarModalEditar();

            })

            .catch(function (res) {


                bz.deshabilitar = false;
                bz.cerrarModalEditar();


            })
        }
    }




}])


.controller('usuariosRegistroController', ['$scope', 'usuarioService', '$firebaseAuth', "$state", function ($scope, usuarioService, $firebaseAuth, $state) {

    var bz = this;

    bz.deshabilitar = false;

    bz.usuario = {};

    bz.registrar = function (usuario, valido) {

        if (valido) {

            bz.deshabilitar = true;

            $firebaseAuth().$createUserWithEmailAndPassword(usuario.email, usuario.clave).then(function (firebaseUser) {

                    usuario.uid = firebaseUser.uid;

                    usuarioService.registrar(usuario).then(function (res) {
                        bz.deshabilitar = false;
                        $state.go('app.operacionResuelta', {
                            resultado: true,
                            operacion: "Registro de usuario",
                            destino: "app.usuarios"
                        })
                    })

                    .catch(function (res) {

                        bz.deshabilitar = false;

                    });

                })
                .catch(function (error) {
                    bz.deshabilitar = false;
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


.controller('proveedoresController', ['$scope', '$firebaseArray', 'CONFIG', 'proveedorService', '$ionicModal', function ($scope, $firebaseArray, CONFIG, proveedorService, $ionicModal) {

    var bz = this;


    bz.proveedores = []

    proveedorService.lista().then(function (res) {

        bz.proveedores = res.data.result;

    });


    //////////////////////////
    ////Modal de eliminar/////
    //////////////////////////

    $ionicModal.fromTemplateUrl('templates/modals/proveedores.eliminar.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modal = modal;
    });

    bz.abrirModal = function (proveedor, indice) {

        bz.proveedor = proveedor;
        bz.modal.show();

    };
    bz.cerrarModal = function () {
        bz.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        bz.modal.remove();
    });


    ///////////////////////////
    /////Eliminar Proveedor//////
    ///////////////////////////

    bz.eliminarProveedor = function (proveedor) {

        bz.deshabilitar = true;

        proveedorService.eliminar(proveedor.idProveedor)

        .then(function (res) {

            bz.proveedores.splice(bz.proveedores.indexOf(proveedor), 1);
            bz.deshabilitar = false;
            bz.cerrarModal();

        })

        .catch(function (res) {

            bz.deshabilitar = false;
            bz.cerrarModal();

        })

    }



}])


.controller('proveedoresRegistroController', ['$scope', '$firebaseArray', 'CONFIG', 'proveedorService', "$state", function ($scope, $firebaseArray, CONFIG, proveedorService, $state) {

    var bz = this;

    bz.deshabilitar = false;

    bz.proveedor = {};

    bz.registrar = function (proveedor, valido) {

        if (valido) {

            bz.deshabilitar = true;

            proveedorService.registrar(proveedor).then(function (res) {

                bz.deshabilitar = false;

                $state.go('app.operacionResuelta', {
                    resultado: true,
                    operacion: "Registro de Proveedor",
                    destino: "app.proveedores"
                })

            })

            .catch(function (res) {

                bz.deshabilitar = false;

            })

        }

    }

}])


/***********************************/
/********* TRABAJADORES ************/
/***********************************/

.controller('trabajadoresController', ['$scope', '$firebaseArray', 'CONFIG', 'trabajadorService', '$ionicModal', function ($scope, $firebaseArray, CONFIG, trabajadorService, $ionicModal) {

    var bz = this;

    bz.trabajadores = []

    trabajadorService.lista.then(function (res) {

        bz.trabajadores = res.data.result;

    });


    //////////////////////////
    ////Modal de eliminar/////
    //////////////////////////

    $ionicModal.fromTemplateUrl('templates/modals/trabajadores.eliminar.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        bz.modal = modal;
    });

    bz.abrirModal = function (trabajadores, indice) {

        bz.trabajador = trabajadores;
        bz.modal.show();

    };
    bz.cerrarModal = function () {
        bz.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        bz.modal.remove();
    });


    ///////////////////////////
    /////Eliminar Proveedor//////
    ///////////////////////////

    bz.eliminarTrabajador = function (trabajador) {

        bz.deshabilitar = true;


        trabajadorService.eliminar(trabajador.idTrabajador)

        .then(function (res) {

            bz.trabajadores.splice(bz.trabajadores.indexOf(trabajador), 1);
            bz.deshabilitar = false;
            bz.cerrarModal();

        })

        .catch(function (res) {

            bz.deshabilitar = false;
            bz.cerrarModal();

        })

    }


}])

.controller('trabajadoresRegistroController', ['$scope', '$firebaseArray', 'CONFIG', 'trabajadorService', '$state', function ($scope, $firebaseArray, CONFIG, trabajadorService, $state) {

    var bz = this;

    bz.deshabilitar = false;

    bz.trabajador = {};

    bz.registrar = function (trabajador, valido) {

        if (valido) {

            bz.deshabilitar = true;

            trabajadorService.registrar(trabajador).then(function (res) {

                bz.deshabilitar = false;

                $state.go('app.operacionResuelta', {
                    resultado: true,
                    operacion: "Registro de Trabajador",
                    destino: "app.trabajadores"
                })

            })

            .catch(function (res) {

                bz.deshabilitar = false;

            })

        }

    }

}])

/***********************************/
/*********** ALMACENES *************/
/***********************************/

.controller('almacenesController', ['$scope', '$firebaseArray', 'CONFIG', 'bodegaService', '$stateParams', function ($scope, $firebaseArray, CONFIG, bodegaService, $stateParams) {

    var bz = this;

    bz.almacenElegido = {};

    bz.listaAlmacenes = [];

    bodegaService.lista()

        .then(function (res) {

        bz.listaAlmacenes = res.data.result;

    });


    if ($stateParams.actualizar) {

        bodegaService.lista()

            .then(function (res) {

            bz.listaAlmacenes = res.data.result;

        });

    }





}])

.controller('almacenesDetallesController', ['$scope', '$stateParams', 'bodegaService', 'paramsNoExisteResolve', '$ionicModal', '$state', 'productoService', 'movimientosService', '$cordovaFileTransfer', 'apiRootFactory', '$ionicPopup', '$timeout', 'ionicDatePicker', function ($scope, $stateParams, bodegaService, paramsNoExisteResolve, $ionicModal, $state, productoService, movimientosService, $cordovaFileTransfer, apiRootFactory, $ionicPopup, $timeout, ionicDatePicker) {

    var bz = this;

    bz.deshabilitar = false;
    bz.desDescarga = true;

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

        bz.deshabilitar = true;

        bodegaService.eliminar(idAlmacen).then(function (res) {

                bz.deshabilitar = false;

                $state.go('app.almacenes');

            })
            .catch(function (res) {

                bz.deshabilitar = false;
            })
    }




    /**** link del excel ***/
    movimientosService.descargar(bz.bodega.idBodega)

    .then(function (res) {

        if (res.response == true) {

            bz.desDescarga = false;
            bz.linkDescarga = apiRootFactory + res.link;

        }

    })

    .catch(function (res) {

        bz.desDescarga = true;

    })


    /**** descargar excel ****/
    bz.descargar = function (link) {

        bz.progreso = 0;

        // File name only
        var nombreArchivo = link.split("/").pop();

        // Save location
        var directorio = cordova.file.externalRootDirectory + "reportesBargiotti/mensual/" + nombreArchivo;

        bz.progreso = "Iniciando descarga..."

        var popup = $ionicPopup.show({
            title: 'Progreso de la descarga',
            template: '{{almacenesDe.progreso}}',
            scope: $scope
        });

        $cordovaFileTransfer.download(link, directorio, {}, true).then(function (result) {

            bz.progreso = "Descarga Completa."

            $timeout(function () {
                popup.close();
            }, 2000);

        }, function (error) {

            bz.progreso = "Descarga fállida."

            $timeout(function () {
                popup.close();
            }, 2000);

        }, function (progress) {

            bz.progreso = (((progress.loaded / progress.total) * 100).trunc()).toString() + "%.";

        });




    }

    /**********/


    /***** excel por rango *****/


    bz.seleccionarRango = function (inicioFin) {



        ionicDatePicker.openDatePicker({
            callback: function (val) { //Mandatory

                if (inicioFin == 'inicio') {

                    bz.fechaInicioDocumento = new Date(val);

                } else if (inicioFin == 'fin') {

                    bz.fechaFinDocumento = new Date(val);

                }

            },
            setLabel: 'Seleccionar',
            todayLabel: 'Hoy',
            closeLabel: 'Cerrar',
            weeksList: ["D", "L", "M", "X", "J", "V", "S"],
            monthsList: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septtiembre", "Octubre", "Noviembre", "Diciembre"],
            from: new Date(2017, 1, 1), //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional

        });
    }



    bz.verificarRango = function (inicio, fin, bloqueo) {

        if (inicio && fin && !bloqueo) {
            return false;
        } else {
            return true;
        }
    }



    bz.descargarRango = function (link) {

        bz.desDescarga = true;

        movimientosService.descargar(bz.bodega.idBodega)

        .then(function (res) {

            if (res.response == true) {


                var link = apiRootFactory + res.link;


                bz.progreso = 0;

                // File name only
                var nombreArchivo = link.split("/").pop();

                // Save location
                var directorio = cordova.file.externalRootDirectory + "reportesBargiotti/rangos/" + nombreArchivo;

                bz.progreso = "Iniciando descarga..."

                var popup = $ionicPopup.show({
                    title: 'Progreso de la descarga',
                    template: '{{almacenesDe.progreso}}',
                    scope: $scope
                });

                $cordovaFileTransfer.download(link, directorio, {}, true).then(function (result) {

                    bz.progreso = "Descarga Completa."
                    bz.desDescarga = false;
                    $timeout(function () {
                        popup.close();
                    }, 2000);

                }, function (error) {

                    bz.progreso = "Descarga fállida."
                    bz.desDescarga = false;
                    bz.desDescarga = false;

                    $timeout(function () {
                        popup.close();
                    }, 2000);

                }, function (progress) {

                    bz.progreso = (((progress.loaded / progress.total) * 100).trunc()).toString() + "%.";

                });



            }

        })

        .catch(function (res) {

            bz.desDescarga = true;

        })




    }


    /*********/


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

        //console.log(movimiento)

        //var idMovimiento = (movimiento.tipo == "Ingreso") ? movimiento.idIngreso : movimiento.idEgreso; //AQUI AQUI AQUI

        bz.movimiento = movimiento;
        bz.modalMovimiento.show();
        /*
                if (idMovimiento) {
                    movimientosService.detalles(idMovimiento)

                    .then(function (res) {
                            
                            
                            bz.movimiento = res;
                            bz.modalMovimiento.show();

                        })
                        .catch(function (res) {

                            console.log("fallo")


                        })
                }*/

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

    bz.deshabilitar = false;

    bz.nombre = "";

    bz.registrar = function (bodega, valido) {

        if (valido) {

            bz.deshabilitar = true;

            bodegaService.registrar(bodega).then(function (res) {

                bz.deshabilitar = false;

                $state.go('app.operacionResuelta', {
                    resultado: true,
                    operacion: "Registro de Almacen",
                    destino: "app.almacenes"
                })

            });

        }

    }

}])



.controller('almacenesReporteTodoController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'bodegaService', 'paramsNoExisteResolve', '$ionicModal', 'movimientosService', function ($scope, $firebaseArray, CONFIG, $stateParams, bodegaService, paramsNoExisteResolve, $ionicModal, movimientosService) {


    var bz = this;

    bz.deshabilitar = false;

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
        bz.deshabilitar = true;

        movimientosService.eliminarMovimiento(idMovimiento)

        .then(function (res) {

                bz.deshabilitar = false;

                bz.movimientos.splice(indice, 1);

                bz.cerrarModalMovimiento()

            })
            .catch(function (res) {

                bz.deshabilitar = false;

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

    bz.deshabilitar = false;

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

        bz.deshabilitar = true;

        movimientosService.eliminarOrden("ingreso", idIngreso)

        .then(function (res) {

                bz.deshabilitar = false;
                bz.ingresos.splice(indice, 1);
                bz.modalMovimientos.hide();

            })
            .catch(function (res) {

                bz.deshabilitar = false;

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


    // CAMBIAR IDINGRESO POR EL OBJECTO EGRESO
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

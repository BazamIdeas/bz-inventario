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




.controller('registroIngresoController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', function ($scope, $firebaseArray, CONFIG, $stateParams) {


    var bz = this;

    bz.bodega = {
        bodega: $stateParams.nombre,
        idBodega: $stateParams.id
    }


}])

.controller('registroEgresoController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'trabajadorService', 'productoService', function ($scope, $firebaseArray, CONFIG, $stateParams, trabajadorService, productoService) {


    var bz = this;

    bz.bodega = {
        bodega: $stateParams.nombre,
        idBodega: $stateParams.id
    }

    bz.registro = {
        egreso: []
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



}])

/***********************************/
/********** PRODUCTOS **************/
/***********************************/

.controller('productosController', ['$scope', '$firebaseArray', 'CONFIG', 'productoService', function ($scope, $firebaseArray, CONFIG, productoService) {

    var bz = this;

    bz.productos = [];

    productoService.lista

        .then(function (res) {

        bz.productos = res.data.result;

    });

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


.controller('usuariosRegistroController', ['$scope', 'usuarioService', '$firebaseAuth', function ($scope, usuarioService, $firebaseAuth) {

    var bz = this;

    bz.usuario = {};

    bz.registrar = function (usuario, valido) {

        if (valido) {

            $firebaseAuth().$createUserWithEmailAndPassword(usuario.email, usuario.clave).then(function (firebaseUser) {

                    usuario.uid = firebaseUser.uid;

                    usuarioService.registrar(usuario).then(function (res) {
                        /* REVISAR */
                    });

                })
                .catch(function (error) {

                    if (error.code == "auth/email-already-in-use") {
                        console.log("El email se encuentra en uso")
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


.controller('proveedoresRegistroController', ['$scope', '$firebaseArray', 'CONFIG', 'proveedorService', function ($scope, $firebaseArray, CONFIG, proveedorService) {

    var bz = this;

    bz.proveedor = {};

    bz.registrar = function (proveedor, valido) {

        if (valido) {

            proveedorService.registrar(proveedor).then(function (res) {

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

        bz.trabajadores = res.data.result;;

    });

}])

.controller('trabajadoresRegistroController', ['$scope', '$firebaseArray', 'CONFIG', 'trabajadorService', function ($scope, $firebaseArray, CONFIG, trabajadorService) {

    var bz = this;

    bz.trabajador = {};

    bz.registrar = function (trabajador, valido) {

        if (valido) {


            trabajadorService.registrar(trabajador).then(function (res) {


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

.controller('almacenesDetallesController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', function ($scope, $firebaseArray, CONFIG, $stateParams) {

    var bz = this;

    bz.bodega = {
        bodega: $stateParams.nombre,
        idBodega: $stateParams.id
    }


}])


.controller('almacenesRegistroController', ['$scope', '$firebaseArray', 'CONFIG', 'bodegaService', function ($scope, $firebaseArray, CONFIG, bodegaService) {

    var bz = this;

    bz.nombre = "";

    bz.registrar = function (bodega, valido) {

        if (valido) {

            bodegaService.registrar(bodega).then(function (res) {

                /*REVISAR */
            });

        }

    }

}])



.controller('almacenesReporteTodoController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'bodegaService', function ($scope, $firebaseArray, CONFIG, $stateParams, bodegaService) {


    var bz = this;

    bz.bodega = {
        bodega: $stateParams.nombre,
        idBodega: $stateParams.id
    }


    bz.movimientos = []

    bodegaService.movimientos(bz.bodega.idBodega).then(function (res) {

        bz.movimientos = res;

    });




}])

.controller('almacenesReporteIngresosController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'bodegaService', function ($scope, $firebaseArray, CONFIG, $stateParams, bodegaService) {

    var bz = this;

    bz.bodega = {
        bodega: $stateParams.nombre,
        idBodega: $stateParams.id
    }

    bz.ingresos = []

    bodegaService.ingresos(bz.bodega.idBodega).then(function (res) {

        bz.ingresos = res;

    });

}])

.controller('almacenesReporteEgresosController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', 'bodegaService', function ($scope, $firebaseArray, CONFIG, $stateParams, bodegaService) {

    var bz = this;

    bz.bodega = {
        bodega: $stateParams.nombre,
        idBodega: $stateParams.id
    }


    bz.egresos = []

    bodegaService.egresos(bz.bodega.idBodega).then(function (res) {

        bz.egresos = res;

    });

}])

.controller('almacenesEliminarController', ['$scope', '$firebaseArray', 'CONFIG', '$stateParams', function ($scope, $firebaseArray, CONFIG, $stateParams) {


    this.algo = "hola";

}])

angular.module('bz-inventario')


.constant("apiConstant", {
    dominio: "http://api.bargiotti.cl/",

    path: "public/"
})


.factory("apiRootFactory", ["apiConstant", function (apiConstant) {

    return apiConstant.dominio + apiConstant.path;

}])


.factory('storageFactory', ['$window', '$rootScope', function ($window, $rootScope) {
    return {
        definir: function (llave, valor) {
            $window.localStorage.setItem(llave, JSON.stringify(valor));
            return this;
        },
        obtener: function (llave) {
            return JSON.parse($window.localStorage.getItem(llave));
        }
    };

    }])



/************************************************/
/**************** REGISTRO *******************/
/************************************************/

.service('ordenService', ["$http", "apiRootFactory", "$httpParamSerializer", "$q", function ($http, apiRootFactory, $httpParamSerializer, $q) {


    this.nuevoEgreso = function (egreso) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "egreso/registro", egreso, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        .then(function (res) {
            defered.resolve(res.data.result);
        })

        return promise;
    }

    this.nuevoIngreso = function (ingreso) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "ingreso/registro", ingreso, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        .then(function (res) {
            defered.resolve(res.data.result);
        })

        return promise;


    }





}])

/************************************************/
/********************* BODEGA *******************/
/************************************************/

.service('bodegaService', ["$http", "apiRootFactory", "$httpParamSerializer", "$q", function ($http, apiRootFactory, $httpParamSerializer, $q) {



    /** listado de bodegas **/
    this.lista = $http.get(apiRootFactory + "bodega/lista");

    /** todos los movimientos en una bodega**/

    this.movimientos = function (idAlmacen) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "movimiento/historial", $httpParamSerializer({

            idBodega: idAlmacen

        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        .then(function (res) {
            defered.resolve(res.data.result);



        })

        return promise;
    }


    /** todos los movimientos (Egresos) en una bodega**/

    this.egresos = function (idAlmacen) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "egreso/lista", $httpParamSerializer({

            idBodega: idAlmacen

        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        .then(function (res) {

            defered.resolve(res.data.result);



        })

        return promise;
    }

    /** todos los movimientos (ingresos) en una bodega**/

    this.ingresos = function (idAlmacen) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "ingreso/lista", $httpParamSerializer({

            idBodega: idAlmacen

        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        .then(function (res) {

            defered.resolve(res.data.result);


        })

        return promise;
    }


    /** todos los productos en una bodega**/

    this.productos = function (idAlmacen) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "bodega/productos", $httpParamSerializer({

            idBodega: idAlmacen

        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        .then(function (res) {

            defered.resolve(res.data.result);


        })

        return promise;
    }

    /* registrar una nuevo almacen */

    this.registrar = function (bodega) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "bodega/registro", $httpParamSerializer({

            bodega: bodega

        }), {
            headers: {

                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        .then(function (res) {

            defered.resolve(res.data.idInsertado);


        })

        return promise;
    }



    /* Eliminar un almacen */

    this.eliminar = function (idAlmacen) {


        var defered = $q.defer();
        var promise = defered.promise;


        $http.get(apiRootFactory + "bodega/borrar/" + idAlmacen)
            .then(function (res) {

                defered.resolve(res)

            })

        .catch(function (res) {

            defered.rejected(res)

        })

        return promise;
    }


}])


/************************************************/
/****************** PRODUCTOS *******************/
/************************************************/



.service('productoService', ["$http", "apiRootFactory", "$httpParamSerializer", "$q", function ($http, apiRootFactory, $httpParamSerializer, $q) {

    /** Listado de productos existentes **/

    this.lista = $http.get(apiRootFactory + "producto/lista");



    this.registrar = function (producto) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "producto/registro", $httpParamSerializer(producto), {
            headers: {

                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        .then(function (res) {

            defered.resolve(res.data.idInsertado);


        })

        return promise;
    }

    /*eliminar producto */

    this.eliminar = function (idProducto) {


        var defered = $q.defer();
        var promise = defered.promise;


        $http.get(apiRootFactory + "producto/borrar/" + idProducto)
            .then(function (res) {

                defered.resolve(res)

            })

        .catch(function (res) {

            defered.rejected(res)

        })

        return promise;
    }

    /** movimientos de un producto dentro de una bodega **/
    this.movimientos = function (idAlmacen, idProducto) {


        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "movimiento/historial/producto", $httpParamSerializer({
            idBodega: idAlmacen,
            idProducto: idProducto
        }), {
            headers: {

                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        .then(function (res) {

            defered.resolve(res.data.result);

        })

        .catch(function (res) {


        })

        return promise;



    }

}])


/************************************************/
/***************** PROVEEDORES ******************/
/************************************************/


.service('proveedorService', ["$http", "apiRootFactory", "$httpParamSerializer", "$q", function ($http, apiRootFactory, $httpParamSerializer, $q) {

    /** Listado de proveedor existentes **/

    this.lista = $http.get(apiRootFactory + "proveedor/lista");

    this.registrar = function (proveedor) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "proveedor/registro", $httpParamSerializer(proveedor), {
            headers: {

                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        .then(function (res) {

            defered.resolve(res.data.idInsertado);


        })

        return promise;
    }


}])



/************************************************/
/***************** TRABAJADORES *****************/
/************************************************/


.service('trabajadorService', ["$http", "apiRootFactory", "$httpParamSerializer", "$q", function ($http, apiRootFactory, $httpParamSerializer, $q) {

    /** Listado de proveedor existentes **/

    this.lista = $http.get(apiRootFactory + "trabajador/lista");

    /** Registrar trabajador **/

    this.registrar = function (trabajador) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "trabajador/registro", $httpParamSerializer(trabajador), {
            headers: {

                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        .then(function (res) {

            defered.resolve(res.data.idInsertado);


        })

        return promise;
    }



}])




/************************************************/
/***************** USUARIOS *****************/
/************************************************/


.service('usuarioService', ["$http", "apiRootFactory", "$httpParamSerializer", "$q", function ($http, apiRootFactory, $httpParamSerializer, $q) {

    /** Listado de usuarios existentes **/

    this.lista = $http.get(apiRootFactory + "usuario/lista");


    /** registrar usuario **/

    this.registrar = function (usuario) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "usuario/registro", $httpParamSerializer(usuario), {
            headers: {

                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        .then(function (res) {

            defered.resolve(res.data.idInsertado);


        })

        return promise;
    }


    this.login = function (email, uid) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.post(apiRootFactory + "usuario/login", $httpParamSerializer({
            email: email,
            uid: uid
        }), {
            headers: {

                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*'
            }
        })


        .then(function (res) {

            defered.resolve(res.data.result);


        })

        return promise;
    }

}])

/************************************************/
/***************** MOVIMIENTOS *****************/
/************************************************/


.service('movimientosService', ["$http", "apiRootFactory", "$httpParamSerializer", "$q", function ($http, apiRootFactory, $httpParamSerializer, $q) {


    /* movimientos de una orden */

    this.movimientosOrden = function (tipo, idOrden, idAlmacen) {

        var defered = $q.defer();
        var promise = defered.promise;

        var datos = {
            idBodega: idAlmacen
        }

        if (tipo == 'ingreso') {

            datos.idIngreso = idOrden;

        } else if (tipo == 'egreso') {

            datos.idEgreso = idOrden;

        }

        $http.post(apiRootFactory + tipo + "/datos", $httpParamSerializer(datos), {
            headers: {

                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        .then(function (res) {

            defered.resolve(res.data.result);

        })

        return promise;

    }


    /* detalle de un movimiento*/

    this.detalles = function (idMovimiento) {


        var defered = $q.defer();
        var promise = defered.promise;


        $http.get(apiRootFactory + "movimiento/datos/" + idMovimiento)
            .then(function (res) {

                defered.resolve(res.data.result)

            })

        .catch(function (res) {

            defered.rejected(res)

        })

        return promise;
    }

    this.eliminarOrden = function (tipo, idOrden) {



        var defered = $q.defer();
        var promise = defered.promise;


        $http.get(apiRootFactory + tipo + "/borrar/" + idOrden)
            .then(function (res) {

                defered.resolve(res)

            })

        .catch(function (res) {

            defered.rejected(res)

        })

        return promise;


    }

    /* Eliminar un movimiento */

    this.eliminarMovimiento = function (idMovimiento) {


        var defered = $q.defer();
        var promise = defered.promise;


        $http.get(apiRootFactory + "movimiento/borrar/" + idMovimiento)

        .then(function (res) {

            defered.resolve(res)

        })

        .catch(function (res) {

            defered.rejected(res)

        })

        return promise;
    }


    /* link del excel */



    this.descargar = function (idAlmacen) {

        var defered = $q.defer();
        var promise = defered.promise;


        $http.get(apiRootFactory + "movimiento/descargar/" + idAlmacen)

        .then(function (res) {

            defered.resolve(res.data)

        })

        .catch(function (res) {

            defered.rejected(res.data)

        })

        return promise;


    }



}])

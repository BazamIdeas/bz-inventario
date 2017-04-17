angular.module('bz-inventario')

.constant("apiConstant", {
    dominio: "//localhost/",

    path: "api-inventario/public/"
})


.factory("apiRootFactory", ["apiConstant", function (apiConstant) {

    return apiConstant.dominio + apiConstant.path;

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


}])


/************************************************/
/****************** PRODUCTOS *******************/
/************************************************/



.service('productoService', ["$http", "apiRootFactory", "$httpParamSerializer", "$q", function ($http, apiRootFactory, $httpParamSerializer, $q) {

    /** Listado de productos existentes **/

    this.lista = $http.get(apiRootFactory + "producto/lista");


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





}])

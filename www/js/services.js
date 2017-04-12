angular.module('bz-inventario')
.service('bodegaService', ["$http", function($http){
    

    
    this.lista = $http.get("//localhost/api-inventario/public/bodega/lista");
    
}])
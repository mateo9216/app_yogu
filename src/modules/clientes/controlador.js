const TABLA = "clientes";

module.exports = function(dbInyectada){
    let db = dbInyectada;

    if(!db){
        db = require('../../db/mysql');
    }   

    function todos(){
        return db.todos(TABLA);
    }
    
    function individual(id){
        return db.individual(TABLA, id);
    }
    
    function eliminar(body){
        return db.eliminar(TABLA, body);
    }
    
    function actualizar(body){
        return db.actualizar(TABLA, body);
    }
    
    function agregar(body){
        return db.agregar(TABLA, body);
    }
    return{
    todos,
    individual,
    eliminar,
    actualizar,
    agregar
    }
}
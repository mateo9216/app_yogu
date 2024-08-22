const TABLA = "user";
const auth = require('../auth');

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
    
    async function agregar(body) {
        const usuario = {
            id: body.id,
            username: body.username,
            activo: body.activo
        };
    
        const respuesta = await db.agregar(TABLA, usuario);
    
        // Obtener el id insertado
        let inserId = body.id;
        if (!body.id || body.id === 0) {
            inserId = respuesta.insertId;
        }
    
        // Agregar autenticación solo si se proporciona user o password
        if (body.user || body.password) {
            await auth.agregar({
                id: inserId, // Usar el mismo id de usuario
                user: body.user,
                password: body.password
            });
        }
    
        return true;
    }
    
    
    return{
    todos,
    individual,
    eliminar,
    actualizar,
    agregar
    }
}

const jws = require('jsonwebtoken');
const config = require('../config');
const error = require('../middleware/error');




const secret = config.jwt.secret
function asignarToken(data){
    return jws.sign(data, secret)
}

function verificarToken(token){
    return jws.verify(token, secret)
}

const chekToken = {
    confirmarToken: function(req){
        const decoficado = decodificarCabecera(req);

        if (decoficado.id !== id) {
            throw error('no tienes privilegios para esto', 401);
        }

    }
}

function obtenerToken(autorizacion){
    if (!autorizacion) {
        throw error('no viene token', 401);
    } 
    
    if (autorizacion.indexOf('Bearer') === -1) {
        throw error('formato invalido', 401);
    } 

    let token = autorizacion.replace('Bearer ', '')
    

    return token;

}

function decodificarCabecera(req){
    const autorizacion = req.headers.authorization || '';
    const token = obtenerToken(autorizacion);
    const decoficado = verificarToken(token);

    req.user = decoficado;

    return decoficado

}

module.exports ={
    asignarToken,
    chekToken
}
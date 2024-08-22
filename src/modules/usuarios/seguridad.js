const auth = require('../../autenticacion')

module.exports = function chekAuth(){
    function middleware(req, res, next){
        const id = req.body.id
        auth.chekToken.confirmarToken(req, id)
        next();
    }

    return middleware
}
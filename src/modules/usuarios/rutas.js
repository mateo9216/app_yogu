const express = require('express')
const router = express.Router();
const respuesta = require('../../red/respuestas')
const controlador = require('./index')
const seguridad = require('./seguridad')


router.get('/', todos);
router.get('/:id', individual);
router.delete('/', seguridad(), eliminar);
router.post('/', agregar);




async function todos (req, res, next){
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}; 

async function individual (req, res, next){
    try {
        const items = await controlador.individual(req.params.id);
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}; 

async function eliminar (req, res, next){
    try {
        const items = await controlador.eliminar(req.body);
        console.log(req.body);
        respuesta.success(req, res, 'item eliminado 📝 ok', 200);
    } catch (err) {
        next(err);
    }
}; 1


async function agregar (req, res, next){
    try {
        const items = await controlador.agregar(req.body);
        if(req.body.id == 0){
            mensaje ='item guardado 📝 con exito';
        }else{
            mensaje ='item actualizado 📝 con exito';
        }
        respuesta.success(req, res, mensaje, 200);
    } catch (err) {
        next(err);
    }
}; 


module.exports = router;
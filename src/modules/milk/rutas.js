const express = require('express');
const router = express.Router();
const respuesta = require('../../red/respuestas');
const controlador = require('./index');

// Definición de rutas
router.get('/', todos);
router.get('/:id', individual);
router.delete('/', eliminar);
router.post('/', agregar);
router.put('/', actualizar); // Ruta para actualizar

// Función para obtener todos los elementos
async function todos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

// Función para obtener un elemento individual por ID
async function individual(req, res, next) {
    try {
        const items = await controlador.individual(req.params.id);
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

// Función para eliminar un elemento por ID
async function eliminar(req, res, next) {
    try {
        const items = await controlador.eliminar(req.body);
        respuesta.success(req, res, 'Item eliminado con éxito', 200);
    } catch (err) {
        next(err);
    }
}

// Función para agregar o actualizar un elemento
async function agregar(req, res, next) {
    try {
        const items = await controlador.agregar(req.body);
        let mensaje = req.body.id === 0 ? 'Item guardado con éxito' : 'Item actualizado con éxito';
        respuesta.success(req, res, mensaje, 200);
    } catch (err) {
        next(err);
    }
}

// Función para actualizar un elemento
async function actualizar(req, res, next) {
    try {
        const items = await controlador.actualizar(req.body);
        respuesta.success(req, res, 'Item actualizado con éxito', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;

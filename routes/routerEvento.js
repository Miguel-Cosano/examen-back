const express = require('express')
const routerEvento = express.Router()
const {listarEventos, listarLogs, guardarEvento , borrarEvento, getEventoByNombre , getEventosProximos,
checkToken} = require('../controllers/eventoController')

routerEvento.get('/', listarEventos)
    .post('/', guardarEvento)
    .get('/logs', listarLogs)
    //.post('/filter', eventoController.filterEventos)
    .post('/', guardarEvento)
    .put('/',guardarEvento)
    .delete('/:id', borrarEvento)
    .post('/logUser',checkToken)
module.exports = {routerEvento};
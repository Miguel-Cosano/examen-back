const express = require('express')
const routerEvento = express.Router()
const {listarEventos, guardarEvento , borrarEvento, checkToken, logOutUser} = require('../controllers/eventoController')

routerEvento.get('/', listarEventos)
    .get('/:id', listarEventos)
    .post('/', guardarEvento)
    .post('/filter', listarEventos)
    .put('/',guardarEvento)
    .delete('/:id', borrarEvento)
module.exports = {routerEvento};
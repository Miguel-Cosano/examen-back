const express = require('express')
const routerGasto = express.Router()
const {listarGastos,
    guardarGasto,
    borrarGasto,
    getSaldo} = require('../controllers/gastoController')

routerGasto.get('/', listarGastos)
    .post('/', guardarGasto)
    .delete('/:id', borrarGasto)
    .get('/saldo/:eMail', getSaldo)

module.exports = {routerGasto};
const express = require('express')
const routerUsuario = express.Router()
const {getUserByToken, checkToken, logOutUser} = require('../controllers/eventoController')

routerUsuario.post('/logUser',checkToken)
    .get('/',getUserByToken)
    .post('/logOutUser',logOutUser)

module.exports = {routerUsuario};
const express = require('express')
const { createUsuarioController, getUsuarioByIdController, deleteUsuarioController, updateUsuarioController,
        updateValoracionController, getRatingUsuarioController, getValoracionUsuarioController,
        checkUserFromGoogle,checkToken
} = require('../controllers/usuarioController')

const routerUsuario = express.Router()

routerUsuario.post('/', createUsuarioController)
routerUsuario.get('/', getUsuarioByIdController)
routerUsuario.delete('/:correo', deleteUsuarioController)
routerUsuario.put('/', updateUsuarioController)
routerUsuario.put('/valoracion', updateValoracionController)
routerUsuario.get('/valoracionMedia', getRatingUsuarioController)
routerUsuario.get('/valoracion', getValoracionUsuarioController)
routerUsuario.post('/checkToken', checkToken)

module.exports = {
    routerUsuario
}

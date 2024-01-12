const express = require('express')
const routerLog = express.Router()
const {listarLogs} = require('../controllers/logController')

routerLog.get('/', listarLogs)


module.exports = {routerLog};
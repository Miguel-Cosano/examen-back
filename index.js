require('./db/mongoose')
console.log("INITIALIZING SERVER")
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

const {routerEvento} = require('./routes/routerEvento')
const {routerLog} = require('./routes/routerLog')
const {routerUsuario} = require('./routes/routerUsuario')

app.use(bodyParser.json())

app.use(cors())

app.use('/evento', routerEvento)
app.use('/log', routerLog)
app.use('/user',routerUsuario)

const port = 5001
app.listen(port, () => {
    console.log('Listening on port ' + port)
})
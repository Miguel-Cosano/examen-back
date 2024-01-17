require('./db/mongoose')
console.log("INITIALIZING SERVER")
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')


const {routerUsuario} = require('./routes/routerUsuario')
const {routerGasto} = require('./routes/routerGasto')

app.use(bodyParser.json())

app.use(cors())


app.use('/user',routerUsuario)
app.use('/gasto', routerGasto)

const port = 5001
app.listen(port, () => {
    console.log('Listening on port ' + port)
})
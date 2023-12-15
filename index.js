require('./db/mongoose')
console.log("INITIALIZING SERVER")
const express = require('express')
const NodeCache = require('node-cache');
const cors = require('cors')
const app = express()
if(global.cache === undefined){
    console.log("INITIALIZING CACHE")
    global.cache = new NodeCache();
}else{
    console.log("CACHE ALREADY INITIALIZED")
}

const bodyParser = require('body-parser')

const {routerImage} = require('./routes/routerImage')
const {routerProducto} = require('./routes/routerProducto')
const {routerUsuario} = require('./routes/usuarioRoute')
const {routerLocation} = require('./routes/routerLocation')

app.use(cors())

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));


app.get('/', (req, res, next) => {
    res.send('App working!')
    next()
})



app.use('/upload', routerImage)
app.use('/producto', routerProducto)
app.use('/usuario', routerUsuario)
app.use('/location', routerLocation)

const port = 5001
app.listen(port, () => {
    console.log('Listening on port ' + port)
})
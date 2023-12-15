require('./db/mongoose')
console.log("INITIALIZING SERVER")
const express = require('express')
const cors = require('cors')
const app = express()

const bodyParser = require('body-parser')

const {routerImage} = require('./routes/routerImage')
const {routerEvento} = require('./routes/routerEvento')

app.use(cors())

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));


app.get('/', (req, res, next) => {
    res.send('App working!')
    next()
})



app.use('/upload', routerImage)
app.use('/evento', routerEvento)

const port = 5001
app.listen(port, () => {
    console.log('Listening on port ' + port)
})
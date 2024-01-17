require ('dotenv').config()
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect("mongodb+srv://canal:canal@cluster0.vodgj.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to Mongo')
})
.catch((error) => {
    console.log('Error ocurred connecting Mongo: ', error)
})

module.exports = mongoose
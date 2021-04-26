const express = require('express')
const app = express()
const mongoose = require('mongoose')
var cors = require('cors')
const expressValidator = require('express-validator')

app.get('/', (req, res) => {
    res.send('OK')
})

const admineRouter = require('./routes/admine')
const conducteurRouter = require('./routes/conducteur')

app.use(express.json())
app.use(expressValidator())
app.use(cors())

// config app
require('dotenv').config()

// connection to database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
.then(() => console.log('connected to database'))
.catch(() => console.log('database is not connected'))

app.use('/api/admine', admineRouter)
app.use('/api/conducteur', conducteurRouter)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`app is now listening at port ${port}`))


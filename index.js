const express = require('express')
const path = require('path')

const app = express()
const PORT = 3000

app.use('/', require('./routes/index'));

app.set('views',path.join(__dirname, 'views'))
app.set('view engine','hbs')

app.listen(PORT)

module.exports = app
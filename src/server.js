const express = require('express')
const routes = require('./routes')

const app = express()
const PORT = 3002

app.use(express.json())
app.use(routes)

app.listen(PORT, () => {
    console.log('Server running on ' + PORT)
})
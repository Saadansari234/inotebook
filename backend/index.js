const ConnectToMongo= require("./db")
const express = require('express')

ConnectToMongo()
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

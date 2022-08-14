const { response } = require('express')
const express = require('express')
const app = express()

let persons = require('./persons.json')

app.get('/', (request, response) => {
    response.send(`<h1>G'day m8!</h1>`)
})

app.get ('/api/persons', (request, response) => {
    response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}!`)
})
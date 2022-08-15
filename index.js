const express = require('express')
const app = express()

let persons = require('./persons.json')

app.get('/', (request, response) => {
    response.send(`<h1>G'day m8!</h1>`)
})

app.get('/info', (request, response) => {
    const numPeople = persons.length
    const date = new Date()
    response.send(`
    <div>
        <div>Phonebook has info for ${numPeople} people</div>
        <br />
        <div>${date}</div>
    </div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const newPerson = persons.find(person => {
        console.log(person)
        return person.id === id
    })
    if (newPerson) {
        response.json(newPerson)
    } else {
        response.status(404).end()
    }
})

app.get ('/api/persons', (request, response) => {
    response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}!`)
})
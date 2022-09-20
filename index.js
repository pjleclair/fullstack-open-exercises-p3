const { response } = require('express')
const express = require('express')
var morgan = require('morgan')
let persons = require('./persons.json')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('person', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))


const generateId = (range) => {
    const id = Math.floor(Math.random()*range)
    if (persons.find(person => person.id === id)) {
        id = Math.floor(Math.random()*range)
    } else {
        return id
    }
}

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
    const newPerson = persons.find(person => {
        return person.id === id
    })
    if (newPerson) {
        response.json(newPerson)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    persons = persons.filter(person => {
        console.log(person.id)
        return person.id !== id
    })
    
    console.log(persons)

    response.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    if (!person.name || !person.number) {
        return res.status(400).json({
            error: "name/number is missing!"
        })
    } else if (persons.find(people => people.name.toLowerCase() === person.name.toLowerCase())) {
        return res.status(400).json({
            error: "name must be unique!"
        })
    }

    const newPerson = {
        id: generateId(1000),
        name: person.name,
        number: person.number
    }

    persons = persons.concat(newPerson)
    console.log(newPerson)
    res.json(newPerson)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const PORT = process.env.PORT || 3001
const host = '0.0.0.0'
app.listen(PORT, host, () => {
    console.log(`Server running on ${PORT}!`)
})
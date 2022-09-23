require('dotenv').config()
const { response } = require('express')
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

const name = process.argv[3]
const number = process.argv[4]

const Person = require('./models/person')

morgan.token('person', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/', (request, response) => {
    response.send(`<h1>G'day m8!</h1>`)
})

app.get('/info', (request, response) => {
    Person.find({}).then(res => {
        const date = new Date()
        const numPeople = res.length
        response.send(`
            <div>
                <div>Phonebook has info for ${numPeople} people</div>
                <br />
                <div>${date}</div>
            </div>
        `)
    })
    
    
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {
        next(error)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const person = req.body
    if (!person.name || !person.number) {
        return res.status(400).json({
            error: "name/number is missing!"
        })
    }
    //If request hasn't been redirected to PUT, check to see if name exists already
    Person.find({}).then(response => {
        const found = response.find(people => {
            people.name.toLowerCase() === person.name.toLowerCase()
        })
        if (found !== undefined) {
            return res.status(400).json({
                error: "name must be unique!"
            })
        }
    })

    if (person === undefined) {
        return response.status(400).json({error: 'content missing'})
    }

    const newPerson = new Person({
        name: person.name,
        number: person.number
    })

    newPerson
    .save()
    .then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error=>next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body
    const newPerson = {
        name: name,
        number: number
    }
    console.log(request.params.id)

    Person
    .findByIdAndUpdate(request.params.id, newPerson, {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error)
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
const host = '0.0.0.0'
app.listen(PORT, host, () => {
    console.log(`Server running on ${PORT}!`)
})
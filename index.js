const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')

const Person = require('./models/person')

app.use(bodyParser.json())
const cors = require('cors')

app.use(cors())

const morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'))
morgan.token('reqData', function(req, res) {
  return JSON.stringify(req.body)
})

app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (request, response) => {
  const timeNow = new Date( Date.now() )
  Person.find({}).then(persons => {
    response.send(`Phonebook has info for ${persons.length} people.<br>${timeNow}`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.phone) {
    return response.status(400).json({
      error: 'phone number missing'
    })
  }

  const person = new Person({
    name: body.name,
    phone: body.phone,
  })

  person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    phone: body.phone,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => updatedPerson.toJSON())
    .then (updatedAndFormattedPerson => {
      response.json(updatedAndFormattedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
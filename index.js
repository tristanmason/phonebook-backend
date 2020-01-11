require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'));

morgan.token('reqData', function(req, res) {
	return JSON.stringify(req.body);
});

const Person = require('./models/person')

  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons.map(person => person.toJSON()))
    })
  })

  app.get('/info', (request, response) => {
    const timeNow = new Date( Date.now() );
    Person.find({}).then(persons => {
      response.send(`Phonebook has info for ${persons.length} people.<br>${timeNow}`)
    })
  })

  app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person.toJSON())
    })
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  
  app.post('/api/persons', (request, response) => {
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
  
    /* persons = persons.concat(person) */
  
    person.save().then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
    {
        "name": "Arto Hellas",
        "phone": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "phone": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Codey McCodeface",
        "phone": "123-456-7890",
        "id": 3
      },
      {
        "name": "Foo Foobarsson",
        "phone": "123-444-3333",
        "id": 4
      }
  ]
  
  app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Phonebook Backend</h1><p>Please visit <a href="/api/persons">/api/persons</a> to view data</p>')
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/info', (req, res) => {
    const timeNow = new Date( Date.now() );
    res.send(`Phonebook has info for ${persons.length} people.<br>${timeNow}`)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const generateId = () => {
    return Math.floor( Math.random() * (10**12) );
  }
  
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

    if (persons.find(person => (person.name === body.name))) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
  
    const person = {
      name: body.name,
      phone: body.phone,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
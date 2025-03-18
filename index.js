const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', (req) => JSON.stringify(req.body));


app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :body'))
app.use(cors())



let persons = [
        { 
          "id": "1",
          "name": "Arto Hellas", 
          "number": "040-123456"
        },
        { 
          "id": "2",
          "name": "Ada Lovelace", 
          "number": "39-44-5323523"
        },
        { 
          "id": "3",
          "name": "Dan Abramov", 
          "number": "12-43-234345"
        },
        { 
          "id": "4",
          "name": "Mary Poppendieck", 
          "number": "39-23-6423122"
        }
    ]


app.get('/', (request, response) => {
        response.send('<h1>Phonebook</h1>')
    })
    

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`

    )
})

app.get('/api/persons/:id', (request, response) => {
    let id = request.params.id
    let person = persons.find(person => person.id === id)

    if (!person) {
        response.status(404)
        response.send(`Person not found.`)
    }
    
    response.json(person)
})


app.delete('/api/persons/:id', (request, response) => {
    let id = request.params.id
    persons = persons.filter(person => person.id !== id)

    if (!persons) {
        response.status(404)
        response.send(`Person not found.`)
    }
    
    response.send(persons)
    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(n => Number(n.id))) : 0
    return String(maxId + 1)
}

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body.name || !body.number)  {
        return response.status(400).json({
            error: 'name or phone is missing'
        })
    }
    
    if (persons.some(check => check.name === body.name)) {
        return response.json({
            error: 'name must be unique' 
        })
    }
    
    const person = {
            id: generateId(),
            name: body.name,
            number: body.number,
        }
    
    persons = persons.concat(person)
    response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
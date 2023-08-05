require('dotenv').config()
const express = require('express')
const  morgan = require('morgan')
const cors = require('cors')
const PersonModel = require('./models/person')

morgan.token('body', function (req, res) { return JSON.stringify(req.body)})

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}

app.get('/api/persons', (request, response, next) => {
    PersonModel.find({}).then(persons => {
        response.json(persons)
    }).catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
    let time = new Date();

    PersonModel
		.countDocuments()
		.then(result => {
			response.send(
				`<p>Phonebook has info for ${result} persons</p><p>${time.toString()}</p>`
			)
		})
		.catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    PersonModel.findById(id).then(person => {        
        if (person) {
            response.json(person)
        } else {
            response.status(404).end() 
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    PersonModel.findByIdAndRemove(id)
    .then(() => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body    

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'name or number missing' 
        })
    }

    const person = new PersonModel({
        name: body.name, 
        number: body.number
    })

    console.log("This is okey");

    person.save().then(savedPerson => {             
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    PersonModel.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)
  
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
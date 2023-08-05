import { useState,useEffect } from 'react'
import personsService from './services/persons'
import PersonForm from './PersonForm'
import Filter from './Filter'
import Persons from './Persons'
import Notification from './Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [messageStatus, setMessageStatus] = useState('')

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const personsToShow = filter === ''
  ? persons
  : persons.filter(person => person.name.toLowerCase().match(`^${filter}`))

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
      setNewNumber(event.target.value)
  }

  const messageToNull = () => {
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber
    }    

    if (!persons.some(p => p.name === person.name )) {      
      personsService.create(person)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
        setMessageStatus(`sucess`)
        setErrorMessage(`Added ${person.name}`)
        messageToNull();
      }).catch(error => {
        setMessageStatus(`error`)
        setErrorMessage(error.response.data.error)
        messageToNull();
      })
    }else if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
      person.id = persons.find(p => p.name === person.name ).id
      updatePerson(person.id,person)
    } 
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if(window.confirm(`Eliminate ${person.name} ?`)){
      personsService
      .remove(id)
      .then(response => {
        setPersons(persons.filter(person => person.id !== id))
        setMessageStatus(`error`)
        setErrorMessage(`Deleted ${person.name}`)
        messageToNull();
      })
    }
   
  }

  const updatePerson = (id,personUpdate) => {
    const person = persons.find(person => person.id === id)
    const changePersons = { ...person, number: personUpdate.number }

    personsService
      .update(id, changePersons)
      .then(response => {
        setPersons([...persons.filter(person => person.id !== id),response])
        setNewName('')
        setNewNumber('')
        setMessageStatus(`sucess`)
        setErrorMessage(`Update ${changePersons.name}`)
        messageToNull();
      })
      .catch(error => {
        setMessageStatus(`error`)
        setErrorMessage(error.response.data.error)
        setPersons(persons.filter(person => person.id !== id))        
        messageToNull();
      })
  }

  useEffect(() => {
    personsService.getAll().then(responseData => {
            setPersons(responseData)
          })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} status={messageStatus} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add new</h2>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow}  deletePerson={deletePerson} />
    </div>
  )
}

export default App
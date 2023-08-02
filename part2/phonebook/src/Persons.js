const Person = ({person,deletePerson}) => {
    return <p>{person.name} {person.number} <button onClick={()=> deletePerson(person.id)}>delete</button></p>
}

const Persons = ({personsToShow,deletePerson}) => {
    return (
        <ul>
            {personsToShow.map(person => 
                <Person key={person.name} person={person} deletePerson={deletePerson} />
            )}
      </ul>
    )
}

export default Persons
const Header = ({name}) => {
  return (
      <h1>{name}</h1>
  )
}

const Part = ({part}) => {
  return (
      <p>
        {part.name} {part.exercises}
      </p>
  )
}

const Total = ({totalAmount}) =>{
  return <p>total of {totalAmount} exercises</p>;
}

const Content = ({parts}) => {  
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part} />)}
    </div>
  )
}
  
const Course = ({course}) =>{
  const total = course.parts.reduce((exercises, part) => {
    return exercises+part.exercises;
  },0)

  return <div>
    <Header name={course.name}  />
    <Content parts={course.parts} />
    <Total totalAmount={total}  />
  </div>
}

export default Course
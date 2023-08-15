import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitleBlog, setNewTitleBlog] = useState('')
  const [newAuthorBlog, setNewAuthorBlog] = useState('')
  const [newUrlBlog, setNewUrlBlog] = useState('')

  const handleNewTitleBlog = (event) => {
    setNewTitleBlog(event.target.value)
  }
  const handleNewAuthorBlog = (event) => {
    setNewAuthorBlog(event.target.value)
  }
  const handleNewUrlBlog = (event) => {
    setNewUrlBlog(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blog = {
      title: newTitleBlog,
      author: newAuthorBlog,
      url: newUrlBlog
    }

    createBlog(blog)

    setNewTitleBlog('')
    setNewAuthorBlog('')
    setNewUrlBlog('')
  }
  return  (<div>
    <form onSubmit={addBlog}>
      <div>
          title:
        <input id='inputTitleBlog'
          value={newTitleBlog}
          onChange={handleNewTitleBlog}
        />
      </div>
      <div>
          author:
        <input id='inputAuthorBlog'
          value={newAuthorBlog}
          onChange={handleNewAuthorBlog}
        />
      </div>
      <div>
          url:
        <input id='inputUrlBlog'
          value={newUrlBlog}
          onChange={handleNewUrlBlog}
        />
      </div>
      <button id='submitNewBlogButton' type="submit">create</button>
    </form>
  </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
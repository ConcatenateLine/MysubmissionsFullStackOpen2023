import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likedBlog, deleteBlog }) => {
  const [user, setUser] = useState( { username:'Sin usuario' })
  const [visible, setVisible] = useState(false)
  const textWhenVisible = visible ? 'hide' : 'show'

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = () => {
    likedBlog(blog.id,blog)
  }

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleVisibility} className='togglableBlogButton'>{textWhenVisible}</button>
      {visible && <div className='togglableBlogElement'>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={addLike}>like</button> </p>
        <p>{blog.author}</p>
        {blog.user.username === user.username && <button onClick={() => deleteBlog(blog)}>remove</button> }
      </div>}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likedBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}

export default Blog
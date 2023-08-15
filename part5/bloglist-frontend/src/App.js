import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageStatus, setMessageStatus] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const sortByLikes = (preorderBlogs) => {
    return preorderBlogs.sort(function(a, b){return b.likes - a.likes})
  }

  const messageToNull = () => {
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const createBlog = (blog) => {
    blogFormRef.current.toggleVisibility()
    if (!blogs.some(b => b.title === blog.title )) {
      blogService.create(blog)
        .then(response => {
          setBlogs(blogs.concat(response))
          setMessageStatus('sucess')
          setErrorMessage(`a new blog ${blog.title} by ${blog.author} added`)
          messageToNull()
        }).catch(error => {
          setMessageStatus('error')
          setErrorMessage(error.response.data.error)
          messageToNull()
        })
    }else if(window.confirm(`${blog.title} is already added, replace the old blog with a new one?`)){
      blog.id = blogs.find(b => b.title === blog.title ).id
      updateBlog(blog.id,blog)
    }
  }

  const updateBlog = (id,blogUpdate) => {
    const blog = blogs.find(b => b.id === id)
    const changeBlog = { ...blog, author: blogUpdate.author, url: blogUpdate.url }

    blogService
      .update(id, changeBlog)
      .then(response => {
        setBlogs([...blogs.filter(b => b.id !== id),response])
        setMessageStatus('sucess')
        setErrorMessage(`Update ${changeBlog.title}`)
        messageToNull()
      })
      .catch(error => {
        setMessageStatus('error')
        setErrorMessage(error.response.data.error)
        setBlogs(blogs.filter(b => b.id !== id))
        messageToNull()
      })
  }

  const deleteBlog = (blog) => {
    if(window.confirm(`Eliminate ${blog.title} ?`)){
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
          setMessageStatus('error')
          setErrorMessage(`Deleted ${blog.title}`)
          messageToNull()
        }).catch(error => {
          setMessageStatus('error')
          setErrorMessage(error.response.data.error)
          setBlogs(blogs.filter(b => b.id !== blog.id))
          messageToNull()
        })
    }
  }

  const likedBlog = (id,blog) => {
    const changeBlog = { ...blog, likes: blog.likes+1 }

    blogService
      .update(id, changeBlog)
      .then(response => {
        setBlogs([...blogs.filter(b => b.id !== id),response])
        setMessageStatus('sucess')
        setErrorMessage(`like to ${changeBlog.title}`)
        messageToNull()
      })
      .catch(error => {
        setMessageStatus('error')
        setErrorMessage(error.response.data.error)
        setBlogs(blogs.filter(b => b.id !== id))
        messageToNull()
      })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to aplication</h2>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="loginButton" type="submit">login</button>
    </form>
  )

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessageStatus('error')
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      <Notification message={errorMessage} status={messageStatus}  />

      {!user && <div>
        {loginForm()}
      </div>}
      {user && <div>
        <h2>blogs</h2>
        <p>{user.name} logged in  <button type='bottom' onClick={logOut}>Log out</button></p>
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <BlogForm createBlog={createBlog}/>
        </Togglable>
        {sortByLikes(blogs).map(blog =>
          <Blog key={blog.id} blog={blog} likedBlog={likedBlog} deleteBlog={deleteBlog} />
        )}
      </div>
      }
    </div>
  )
}

export default App
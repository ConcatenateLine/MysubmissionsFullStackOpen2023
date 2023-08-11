const blogsRouter = require('express').Router()
const BlogModel = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await BlogModel.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/info', async (request, response) => {
  let time = new Date()

  const blogsTotal = await BlogModel.countDocuments()
  response.send(
    `<p>Phonebook has info for ${blogsTotal} blogs</p><p>${time.toString()}</p>`
  )
})

blogsRouter.get('/:id', async (request, response) => {
  const user = request.user

  if(!user){
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await BlogModel.findById(user.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  if(!user){
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await BlogModel.findById(request.params.id)
  if(blog.user.toString() === user.id){
    await BlogModel.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }else{
    return response.status(401).json({ error: 'Unauthorized to delete the blog' })
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'title or url missing'
    })
  }

  const blog = new BlogModel({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await BlogModel.findByIdAndUpdate(request.params.id, blog, { new: true })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    return response.status(400).json({
      error: `Blog ${blog.title} was already removed from server`
    })
  }
})

module.exports = blogsRouter
const BlogModel = require('../models/blog')
const UserModel = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: ''
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: ''
  },
]

const nonExistingId = async () => {
  const blog = new BlogModel({ title: 'willremovethissoon', author: 'Rebeca Jones', userId: '' })
  await blog.save()
  await blog.deleteOne()

  return blog.id.toString()
}

const blogsInDb = async () => {
  const blogs = await BlogModel.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await UserModel.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}
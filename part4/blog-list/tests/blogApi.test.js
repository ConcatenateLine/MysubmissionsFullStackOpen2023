const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const BlogModel = require('../models/blog')
const UserModel = require('../models/user')

const api = supertest(app)
const user = { user: '', token: '' }

beforeEach(async () => {
  await UserModel.deleteMany({})

  const newUser = {
    username: 'Trantino',
    name: 'Tara liro',
    password: 'salainen'
  }

  user.user = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  user.token = await api
    .post('/api/login')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

})

beforeEach(async () => {
  await BlogModel.deleteMany({})

  for (let blog of helper.initialBlogs) {
    blog['user'] = user.user.body.id
    let blogObject = new BlogModel(blog)
    await blogObject.save()
  }
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog =    {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      userId: user.user.body.id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${ user.token.body.token }`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  },100000)

  test('blog without like content is set 0', async () => {
    const newBlog =   {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      userId: user.user.body.id
    }

    const responseBlogs = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${ user.token.body.token }`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(responseBlogs.body.likes).toBe(0)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)
  })

  test('blog without title or url content can not be added', async () => {
    const newBlog =   {
      title: 'TDD harms licenciature',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Licenciature.html',
      userId: user.user.body.id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${ user.token.body.token }`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('blog without token can not be added', async () => {
    const newBlog =   {
      title: 'TDD harms licenciature',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Licenciature.html',
      userId: user.user.body.id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${ user.token.body.token }`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })
})

describe('updating a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .put(`/api/blogs/${blogToView.id}`)
      .set('Authorization', `Bearer ${ user.token.body.token }`)
      .send({ likes:20 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body.likes).toBe(20)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${ user.token.body.token }`)
      .expect(404)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
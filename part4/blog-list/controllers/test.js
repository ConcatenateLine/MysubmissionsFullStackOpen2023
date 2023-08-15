const testRouter = require('express').Router()
const BlogModel = require('../models/blog')
const UserModel = require('../models/user')

testRouter.post('/reset', async (request, response) => {
  await BlogModel.deleteMany({})
  await UserModel.deleteMany({})

  response.status(204).end()
})

module.exports = testRouter
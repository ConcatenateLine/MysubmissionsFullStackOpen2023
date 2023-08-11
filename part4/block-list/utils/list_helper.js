const lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  let total = 0
  return blogs.reduce((acumulator, blog) => acumulator + blog.likes, total)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0)
    return null
  return blogs.reduce((blogFavorite, blog) => blog.likes > blogFavorite.likes ? blogFavorite = blog : blogFavorite )
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0)
    return null
  let result = lodash(blogs)
    .groupBy('author')
    .map(function(item,itemId) {
      let obj = {}
      obj['author'] = itemId
      obj['blogs'] = lodash.countBy(item, 'author')[itemId]
      return obj
    }).value()

  return  result.reduce((authorFavorite, author) => author.blogs > authorFavorite.blogs ? authorFavorite = author : authorFavorite )
}

const mostLikes = (blogs) => {
  if(blogs.length === 0)
    return null
  let result = lodash(blogs)
    .groupBy('author')
    .map(function(item,itemId) {
      let obj = {}
      obj['author'] = itemId
      obj['likes'] = lodash.sumBy(item, 'likes')
      return obj
    }).value()

  return  result.reduce((authorFavorite, author) => author.likes > authorFavorite.likes ? authorFavorite = author : authorFavorite )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
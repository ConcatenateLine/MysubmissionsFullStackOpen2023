import React from 'react'
import '@testing-library/jest-dom/'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Constantine',
    url: 'http://local/blog1',
    likes: 10
  }

  const deleteBlog = () => {}
  const likeBlog = () => {}

  const { container } = render(<Blog blog={blog} deleteBlog={deleteBlog} likedBlog={likeBlog} />)

  const element = screen.getByText('Component testing is done with react-testing-library Constantine')
  expect(element).toBeDefined()

  const blogElement = container.querySelector('.blog')
  expect(blogElement).not.toHaveTextContent('http://local/blog1')
  expect(blogElement).not.toHaveTextContent('likes')

})

describe('Detail blog togglable', () => {
  let container
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Constantine',
    url: 'http://local/blog1',
    likes: 10,
    user:{
      username:'tamalito',
    }
  }

  const deleteBlog = () => {}
  const mockHandler = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog blog={blog} deleteBlog={deleteBlog} likedBlog={mockHandler} />
    ).container
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const div = container.querySelector('.togglableBlogElement')
    expect(div).toBeDefined()
    expect(div).toHaveTextContent('http://local/blog1')
    expect(div).toHaveTextContent('likes')
  })

  test('likes button click twice', async () => {
    const users = userEvent.setup()
    const buttonToggle = screen.getByText('show')
    await users.click(buttonToggle)

    const button = screen.getByText('like')
    await users.click(button)
    await users.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})


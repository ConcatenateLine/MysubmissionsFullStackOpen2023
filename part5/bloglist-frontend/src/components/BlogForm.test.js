import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Constantine',
    url: 'http://local/blog1'
  }
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const container = render(<BlogForm createBlog={createBlog} />).container

  const inputTitle = container.querySelector('#inputTitleBlog')
  const inputAuthor = container.querySelector('#inputAuthorBlog')
  const inputUrl = container.querySelector('#inputUrlBlog')

  const sendButton = screen.getByText('create')

  await user.type(inputTitle, blog.title)
  await user.type(inputAuthor, blog.author)
  await user.type(inputUrl, blog.url)

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(blog)
})
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/test/reset')

    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }

    const userSecond = {
      name: 'Marti Likaku',
      username: 'mlikaku',
      password: 'salainen'
    }

    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.request('POST', 'http://localhost:3001/api/users/', userSecond)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to aplication')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#loginButton').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainenwrong')
      cy.get('#loginButton').click()

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('salainen')
        cy.get('#loginButton').click()

        cy.contains('create new blog').click()
        cy.get('#inputTitleBlog').type('a blog created by camile')
        cy.get('#inputAuthorBlog').type('Camile')
        cy.get('#inputUrlBlog').type('https://local.com/blog2')
        cy.get('#submitNewBlogButton').click()
      })

      it('A blog can be created', function() {
        cy.contains('create new blog').click()
        cy.get('#inputTitleBlog').type('a blog created by cypress')
        cy.get('#inputAuthorBlog').type('Selenio')
        cy.get('#inputUrlBlog').type('https://local.com/blog1')
        cy.get('#submitNewBlogButton').click()
        cy.contains('a new blog a blog created by cypress by Selenio added')
      })

      it('user can like a blog', function() {
        cy.contains('a blog created by camile Camile').contains('show').click()
        cy.contains('likes').contains('like').click()
      })

      it('user who created a blog can delete it', function() {
        cy.contains('a blog created by camile Camile').contains('show').click()
        cy.contains('a blog created by camile Camile').contains('remove').click()
      })

      it('only the creator can see the delete button of a blog, not anyone else', function() {
        cy.contains('Matti Luukkainen logged in').contains('Log out').click()

        cy.get('#username').type('mlikaku')
        cy.get('#password').type('salainen')
        cy.get('#loginButton').click()

        cy.contains('Marti Likaku logged in')
        cy.contains('a blog created by camile Camile').contains('show').click()
        cy.contains('a blog created by camile Camile').contains('remove').should('not.exist')
      })

      it('blogs are ordered according to likes with the blog with the most likes being first', function() {
        cy.contains('create new blog').click()
        cy.get('#inputTitleBlog').type('a camile blog created')
        cy.get('#inputAuthorBlog').type('Camile')
        cy.get('#inputUrlBlog').type('https://local.com/blog3')
        cy.get('#submitNewBlogButton').click()

        cy.contains('a blog created by camile Camile').contains('show').click()
        cy.contains('likes').contains('like').click()

        cy.get('.blog').eq(0).should('contain', 'a blog created by camile Camile')
        cy.get('.blog').eq(1).should('contain', 'a camile blog created Camile')
      })
    })

  })


})
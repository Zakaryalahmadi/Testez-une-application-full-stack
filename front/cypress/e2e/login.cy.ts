/// <reference types="cypress" />

describe('Login Page E2E', () => {
  const VALID_USER = {
    email: 'yoga@studio.com',
    password: '123456'
  }

  beforeEach(() => {
    cy.visit('/login')
  })

  const login = (email: string, password: string) => {
    cy.get('[data-cy="email-input"]').type(email)
    cy.get('[data-cy="password-input"]').type(password)
    cy.get('button[type="submit"]').click()
  }

  describe('Login Attempts', () => {
    it('should login successfully with valid credentials', () => {
      login(VALID_USER.email, VALID_USER.password)

      // Vérifie uniquement la redirection après connexion réussie
      cy.url().should('include', '/sessions')
    })

    it('should display error with invalid credentials', () => {
      login('wrong@email.com', 'wrongpassword')

      cy.get('.error')
        .should('be.visible')
        .and('contain', 'An error occurred')
    })

    it('should disable submit button with invalid form', () => {
      cy.get('button[type="submit"]').should('be.disabled')
      
      cy.get('[data-cy="email-input"]').type('invalid-email')
      cy.get('button[type="submit"]').should('be.disabled')
      
      cy.get('[data-cy="email-input"]').clear().type('valid@email.com')
      cy.get('button[type="submit"]').should('be.disabled')
    })

    it('should toggle password visibility', () => {
      cy.get('[data-cy="password-input"]')
        .should('have.attr', 'type', 'password')

      cy.get('button[mat-icon-button]').click()

      cy.get('[data-cy="password-input"]')
        .should('have.attr', 'type', 'text')

      cy.get('button[mat-icon-button]').click()

      cy.get('[data-cy="password-input"]')
        .should('have.attr', 'type', 'password')
    })
  })
})
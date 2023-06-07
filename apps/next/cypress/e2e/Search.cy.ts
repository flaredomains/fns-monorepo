describe('Search page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.viewport(1920, 1080)
  })

  context('Gradients background', () => {
    it('Gradients background should be visible', () => {
      cy.findByAltText('Gradient Top').should('be.visible')
      cy.findByAltText('Gradient Bottom').should('be.visible')
    })
  })

  context('Navbar section', () => {
    // Logo
    it('Logo should be visible', () => {
      cy.findByAltText('Logo').should('be.visible')
    })

    it('Logo is clickable', () => {
      cy.get("[data-test='Logo Search']")
        .should('have.prop', 'href')
        .and('not.be.empty')
    })

    // My Account
    it('My Account should be visible', () => {
      cy.findByText('My Account').should('be.visible')
    })

    it('Should go to my_account page when clicked My Account', () => {
      cy.findByText('My Account').click()
      cy.location('pathname').should('eq', '/my_account')
    })

    // FAQ
    it('FAQ should be visible', () => {
      cy.findByText('FAQ').should('be.visible')
    })

    it('Should go to faq page when clicked FAQ', () => {
      cy.findByText('FAQ').click()
      cy.location('pathname').should('eq', '/faq')
    })
  })

  context('Center Section', () => {
    it('Find Your Next .flr Domain should be visible', () => {
      cy.findByText('Find Your Next .flr Domain').should('be.visible')
    })
    // Input
    it('Search Image should be visible', () => {
      cy.findByAltText('Search').should('be.visible')
    })
    it('Placeholder should be visible', () => {
      cy.findByPlaceholderText('Search New Names or Addresses').should(
        'be.visible'
      )
    })
    it('Should display an error for incorrect input', () => {
      cy.findByPlaceholderText('Search New Names or Addresses').type(
        'simone{enter}'
      )

      cy.findByPlaceholderText('Search New Names or Addresses')
        .invoke('prop', 'validationMessage')
        .should(
          'eq',
          'Should be a name with .flr at the end or flare wallet address.'
        )
    })

    it('Should go to register page after write the correct input', () => {
      cy.findByPlaceholderText('Search New Names or Addresses').type(
        'simone.flr{enter}'
      )
      cy.location('pathname').should('eq', '/register')
      cy.location('search').should('eq', '?result=simone.flr')
    })
  })

  context('Bottom Section / Links', () => {
    it('Github link should be clickable', () => {
      cy.findByAltText('Github').should('be.visible')
      cy.get('a[href="https://github.com/flaredomains"]')
        .should('have.prop', 'href')
        .and('not.be.empty')
    })
    it('Discord link should be clickable', () => {
      cy.findByAltText('Discord').should('be.visible')
      cy.get('a[href="https://discord.gg/wDd3pGsscZ"]')
        .should('have.prop', 'href')
        .and('not.be.empty')
    })
    it('Twitter link should be clickable', () => {
      cy.findByAltText('Twitter').should('be.visible')
      cy.get('a[href="https://twitter.com/flarenaming"]')
        .should('have.prop', 'href')
        .and('not.be.empty')
    })
    it('Docs link should be clickable', () => {
      cy.findByAltText('Docs').should('be.visible')
      cy.get('a[href="https://docs.flrns.domains/"]')
        .should('have.prop', 'href')
        .and('not.be.empty')
    })
    it('Website link should be clickable', () => {
      cy.findByAltText('Website').should('be.visible')
      cy.get('a[href="https://flrns.domains/"]')
        .should('have.prop', 'href')
        .and('not.be.empty')
    })
  })
})

describe('Subdomains page', () => {
  beforeEach(() => {
    cy.intercept('/subdomains?result=elevate.flr').as('getResult')
    cy.visit('/subdomains?result=elevate.flr', {
      timeout: 3000,
    })
  })

  it('WalletConnect should not connected', () => {
    cy.get('img[alt="X"]').should('be.visible')
    cy.findByText('Wallet Not Connected').should('be.visible')
    cy.findByText('Your wallet is not connected').should('be.visible')
    cy.findByText(
      'Please connect your wallet to register your FNS domain.'
    ).should('be.visible')
  })

  context('PageButtons', () => {
    it('PageButtons -- Every Image and Text should be visible', () => {
      // Register
      cy.findByAltText('Account').should('be.visible')
      cy.findByText('Register').should('be.visible')

      // Details
      cy.findByAltText('Details').should('be.visible')
      cy.findByText('Details').should('be.visible')

      // Subdomain
      cy.findByAltText('Subdomain').should('be.visible')
      cy.findByText('Subdomain').should('be.visible')

      // Search
      cy.findByAltText('Search').should('be.visible')
      cy.findByPlaceholderText('Search New Names or Addresses').should(
        'be.visible'
      )

      cy.viewport('iphone-7')

      // Register
      cy.findByAltText('Account').should('be.visible')
      cy.findByText('Register').should('be.visible')

      // Details
      cy.findByAltText('Details').should('be.visible')
      cy.findByText('Details').should('be.visible')

      // Subdomain
      cy.findByAltText('Subdomain').should('be.visible')
      cy.findByText('Subdomain').should('be.visible')

      // Search
      cy.findByAltText('Search').should('be.visible')
      cy.findByPlaceholderText('Search New Names or Addresses').should(
        'be.visible'
      )
    })
    it('Pagebutton -- Testing input search', () => {
      // Testing input (Wrong)
      cy.findByPlaceholderText('Search New Names or Addresses').type(
        'simone{enter}',
        { force: true }
      )

      cy.findByPlaceholderText('Search New Names or Addresses')
        .invoke('prop', 'validationMessage')
        .should(
          'eq',
          'Should end with .flr and not contain special characters or two or more consecutive dots.'
        )

      // Clear
      cy.findByPlaceholderText('Search New Names or Addresses').clear()

      // Testing input (Right)
      cy.findByPlaceholderText('Search New Names or Addresses').type(
        'simone.flr{enter}'
      )
      cy.location('pathname').should('eq', '/subdomains')
      cy.location('search').should('eq', '?result=simone.flr')
      cy.go('back')

      cy.viewport('iphone-7')

      // Testing input (Wrong)
      cy.findByPlaceholderText('Search New Names or Addresses').type(
        'simone{enter}'
      )

      cy.findByPlaceholderText('Search New Names or Addresses')
        .invoke('prop', 'validationMessage')
        .should(
          'eq',
          'Should end with .flr and not contain special characters or two or more consecutive dots.'
        )

      // Clear
      cy.findByPlaceholderText('Search New Names or Addresses').clear()

      // Testing input (Right)
      cy.findByPlaceholderText('Search New Names or Addresses').type(
        'simone.flr{enter}'
      )
      cy.location('pathname').should('eq', '/subdomains')
      cy.location('search').should('eq', '?result=simone.flr')
      cy.go('back')
    })
  })

  it('Subdomain section HAS subdomain', () => {
    // Check domain
    cy.findByText('elevate.flr').should('be.visible')

    cy.get('img[alt="Question"]').should('not.exist')
    cy.findByText('No subdomains have been added yet').should('not.exist')

    cy.findByText('yort.elevate.flr').should('be.visible')
  })

  context(`Subdomain section HASN'T subdomain`, () => {
    beforeEach(() => {
      cy.visit('/subdomains?result=simone.flr')
    })
    it('Should appear No subdomains have been added yet', () => {
      // Check domain
      cy.findByText('simone.flr').should('be.visible')

      cy.get('img[alt="Question"]').should('be.visible')
      cy.findByText('No subdomains have been added yet').should('be.visible')
    })
  })
})

export {}

describe('Details page', () => {
  beforeEach(() => {
    cy.intercept('/details?result=elevate.flr').as('getResult')
    cy.visit('/details?result=elevate.flr', {
      timeout: 3000,
    })
  })

  it('Loading', () => {
    cy.wait('@getResult')
    cy.get("[data-test='Loading Alert']").eq(0).should('be.visible')
    cy.get("[data-test='Loading Alert']").eq(1).should('be.visible')
    cy.get("[data-test='Loading Alert']").eq(2).should('be.visible')
    cy.get("[data-test='Loading Alert']").eq(3).should('be.visible')
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
      cy.location('pathname').should('eq', '/details')
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
      cy.location('pathname').should('eq', '/details')
      cy.location('search').should('eq', '?result=simone.flr')
      cy.go('back')
    })
  })

  it('Details section ALREADY REGISTERED', () => {
    // Check domain
    cy.findByText('elevate.flr').should('be.visible')
    // cy.dataTest('Domain Text').should('have.text', 'elevate.flr')

    // Alert
    cy.findByAltText('Dislike').should('be.visible')
    cy.findByText('This name is already registered').should('be.visible')

    cy.findByAltText('Like').should('not.exist')
    cy.findByText('This name is available!').should('not.exist')

    // Available part
    cy.findByText('Parent').should('be.visible')
    cy.findByText('flr').should('be.visible')
    cy.get('img[alt="Clipboard"]').eq(0).should('be.visible')
    cy.findByText('Registrant').should('be.visible')
    cy.findByText('0xf491...7bF8').should('be.visible')
    cy.get('img[alt="Clipboard"]').eq(1).should('be.visible')
    cy.findByText('Controller').should('be.visible')
    cy.findByText('0xBfbf...0104').should('be.visible')
    cy.get('img[alt="Clipboard"]').eq(2).should('be.visible')
    cy.findByText('Expiration Date').should('be.visible')
    cy.findByText('May 5, 2024').should('be.visible')
    cy.findByText('Records').should('be.visible')
    cy.findByText('Addresses').should('be.visible')
    cy.findByText('ETH').should('be.visible')
    cy.findByText('BTC').should('be.visible')
    cy.findByText('LTC').should('be.visible')
    cy.findByText('DOGE').should('be.visible')
    cy.findByText('Text Records').should('be.visible')
    cy.findByText('Email').should('be.visible')
    cy.findByText('URL').should('be.visible')
    cy.findByText('Avatar').should('be.visible')
    cy.findByText('Description').should('be.visible')
    cy.findByText('Notice').should('be.visible')
    cy.findByText('Keywords').should('be.visible')
    cy.findByText('com.discord').should('be.visible')
    cy.findByText('com.github').should('be.visible')
    cy.findByText('com.reddit').should('be.visible')
    cy.findByText('org.telegram').should('be.visible')
  })

  context('Details section IS AVAILABLE', () => {
    beforeEach(() => {
      cy.visit('/details?result=simone.flr')
    })
    it('Already registered text and image should NOT be visible', () => {
      // Check domain
      cy.findByText('simone.flr').should('be.visible')

      // Alert
      cy.findByAltText('Dislike').should('not.exist')
      cy.findByText('This name is already registered.').should('not.exist')
    })
    it('Is available text and image should be visible', () => {
      // Check domain
      cy.findByText('simone.flr').should('be.visible')

      // Alert
      cy.findByAltText('Like').should('be.visible')
      cy.findByText('This name is available!').should('be.visible')

      // Available part
      cy.dataTest('Content').should('not.exist')
    })
  })
})

export {}

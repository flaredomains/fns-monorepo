describe('Register page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register?result=elevate.flr', {
      timeout: 5000,
    })
  })

  it('Loading', () => {
    cy.get("[data-test='Loading Alert']").eq(0).should('be.visible')
    cy.get("[data-test='Loading Alert']").eq(1).should('be.visible')
    cy.get("[data-test='Loading Alert']").eq(2).should('be.visible')
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
    beforeEach(() => {
      cy.viewport(1920, 1080)
    })
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
      cy.location('pathname').should('eq', '/register')
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
      cy.location('pathname').should('eq', '/register')
      cy.location('search').should('eq', '?result=simone.flr')
      cy.go('back')
    })
  })

  it('Register section ALREADY REGISTERED', () => {
    // Check domain
    cy.findByText('elevate.flr').should('be.visible')
    // cy.dataTest('Domain Text').should('have.text', 'elevate.flr')

    // Alert
    cy.findByAltText('Dislike').should('be.visible')
    cy.findByText('This name is already registered.').should('be.visible')
    cy.findByText(
      'Please check the Details tab to see when this domain will free up.'
    ).should('be.visible')

    cy.findByAltText('Like').should('not.exist')
    cy.findByText('This name is available!').should('not.exist')
    cy.findByText(
      'Please complete the form below to secure this domain for yourself.'
    ).should('not.exist')

    // Available part
    cy.get("[data-test='Selector']").should('not.exist')
    cy.get("[data-test='FinalPrice']").should('not.exist')
    cy.get("[data-test='StepTitle']").should('not.exist')
    cy.get("[data-test='Steps']").should('not.exist')
    cy.get("[data-test='Bottom']").should('not.exist')
  })

  context('Register section IS AVAILABLE', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/register?result=simone.flr')
      cy.viewport(1920, 1080)
      cy.wait(500)
    })
    it('Already registered text and image should NOT be visible', () => {
      // Check domain
      cy.findByText('simone.flr').should('be.visible')

      // Alert
      cy.findByAltText('Dislike').should('not.exist')
      cy.findByText('This name is already registered.').should('not.exist')
      cy.findByText(
        'Please check the Details tab to see when this domain will free up.'
      ).should('not.exist')
    })
    it('Is available text and image should be visible', () => {
      // Check domain
      cy.findByText('simone.flr').should('be.visible')

      // Alert
      cy.findByAltText('Like').should('be.visible')
      cy.findByText('This name is available!').should('be.visible')
      cy.findByText(
        'Please complete the form below to secure this domain for yourself.'
      ).should('be.visible')

      // Available part
      cy.get("[data-test='Selector']").should('be.visible')
      cy.dataTest('Minus').should(
        'have.css',
        'background-color',
        'rgb(51, 65, 85)'
      )
      cy.dataTest('Plus').should(
        'have.css',
        'background-color',
        'rgb(249, 115, 22)'
      )

      // Selector
      cy.findByText('1 year').should('be.visible')
      cy.dataTest('Plus').click()
      cy.findByText('2 years').should('be.visible')
      cy.findByAltText('Minus').should('be.visible')
      cy.findByAltText('Plus').should('be.visible')
      cy.findByText('Registration Period').should('be.visible')
      cy.findByText('Registration price in Flare').should('be.visible')
      cy.findByText('Increase period to save on gas fees').should('be.visible')
      cy.get('img[alt="Info"]').eq(0).should('be.visible')

      // Final Price
      cy.findByText('Estimated Total Price').should('be.visible')
      cy.findByText('+').should('be.visible')
      cy.findByText('Gas Fee (at most)').should('be.visible')
      cy.findByText('At most').should('be.visible')
      cy.findByText('Calculated to').should('be.visible')

      // StepTitle
      cy.findByText('Registering requires 3 steps').should('be.visible')
      cy.viewport('iphone-x')
      cy.get("[data-test='StepTitle']").should('not.be.visible')

      // Steps
      cy.findByText('Request to Register').should('be.visible')
      cy.findByText(
        `Your wallet will open and you will be asked to confirm the first of two transactions required for registration. If the second transaction is not processed within 7 days of the first, you will need to start again from step 1.`
      ).should('be.visible')
      cy.findByText('Wait for 1 minute').should('be.visible')
      cy.findByText(
        `The waiting period is required to ensure another person hasn't tried to register the same name and protect you after your request.`
      ).should('be.visible')
      cy.findByText('Complete Registration').should('be.visible')
      cy.findByText(
        `Click 'register' and your wallet will re-open. Only after the 2nd transaction is confirmed you'll know if you got the name.`
      ).should('be.visible')

      // Bottom
      cy.get('img[alt="Info"]').eq(1).should('be.visible')
      cy.findByText('No wallet connected. Please connect to continue.').should(
        'be.visible'
      )
    })
  })
})

export {}

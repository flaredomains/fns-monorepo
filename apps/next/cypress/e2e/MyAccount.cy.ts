describe('Subdomains page', () => {
  beforeEach(() => {
    cy.visit('/my_account')
  })

  it('WalletConnect should not connected', () => {
    cy.get('img[alt="X"]').should('be.visible')
    cy.findByText('Wallet Not Connected').should('be.visible')
    cy.findByText('Your wallet is not connected').should('be.visible')
    cy.findByText(
      'Please connect your wallet to register your FNS domain.'
    ).should('be.visible')
  })

  it('PageButtons should not appear', () => {
    cy.dataTest('PageButtons').should('not.exist')
  })

  context(`MyAccount section`, () => {
    it('Test search input', () => {
      // Search
      cy.findByAltText('Search').should('be.visible')
      cy.findByPlaceholderText('Search New Names or Addresses').should(
        'be.visible'
      )
      cy.findByPlaceholderText('Search New Names or Addresses').type(
        'simone{enter}',
        { force: true }
      )

      cy.findByPlaceholderText('Search New Names or Addresses')
        .invoke('prop', 'validationMessage')
        .should(
          'eq',
          'Should be a name with .flr at the end or ethereum address.'
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

      cy.findByAltText('Search').should('not.be.visible')
      cy.findByPlaceholderText('Search New Names or Addresses').should(
        'not.be.visible'
      )
    })

    it('Text and image should appear when wallet is NOT connected', () => {
      // My Account
      cy.findByAltText('Account').should('be.visible')
      cy.findByText('Not Connected').should('be.visible')
      cy.findByText('Manage Your Domain Here').should('be.visible')
      cy.findByText('Owned Domains').should('be.visible')
      cy.findByText('Manage Your Account Here').should('be.visible')
      cy.findByPlaceholderText('Search New Names or Addresses').should(
        'be.visible'
      )

      // Not Connected
      cy.dataTest('Reverse_Record').should('not.exist')
      // cy.dataTest('Reverse_Record').eq(1).should('not.exist')
      cy.findByText(
        `This sets one of your FNS names to represent your Flare account and becomes your Web3 username and profile. You may only use one per account and can change it at any time.`
      ).should('not.exist')
      cy.findByText(`Only FNS Domains you own can be used here`).should(
        'not.exist'
      )
    })
  })
})

export {}

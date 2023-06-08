// Desktop
describe('Search page Desktop', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('http://localhost:3000/register?result=elevate.flr')
  })

  context('Logo and Menu section', () => {
    it('Logo should be visible and clickable -- Menu Icon should NOT be visible', () => {
      // Logo
      cy.findByAltText('Logo').should('be.visible')
      cy.get('a[href="https://flrns.domains/"]')
        .eq(0)
        .should('have.prop', 'href')
        .and('not.be.empty')

      // Menu
      cy.findByAltText('Menu').should('not.be.visible')
    })
  })

  context('Middle section', () => {
    it('Search/My Account/FAQ should be visible', () => {
      cy.findByAltText('Search SideNavbar').should('be.visible')
      cy.findByAltText('Account SideNavbar').should('be.visible')
      cy.findByAltText('FAQ').should('be.visible')
    })

    it('Should go to Search page when clicked Search For Domain', () => {
      cy.findByText('Search For Domain').click()
      cy.location('pathname').should('eq', '/')
    })

    it('Should go to my_account page when clicked My Account', () => {
      cy.findByText('My Account').click()
      cy.location('pathname').should('eq', '/my_account')
    })

    it('Should go to FAQ page when clicked FAQ', () => {
      cy.findByText('FAQ').click()
      cy.location('pathname').should('eq', '/faq')
    })
  })

  context('Bottom section', () => {
    // Social links
    it('Github/Discord/Twitter/Docs/Website link should be visible and clickable', () => {
      // Github
      cy.get('a[href="https://github.com/flaredomains"]')
        .should('be.visible')
        .should('have.prop', 'href')
        .and('not.be.empty')

      // Discord
      cy.get('a[href="https://discord.gg/wDd3pGsscZ"]')
        .should('have.prop', 'href')
        .and('not.be.empty')

      // Twitter
      cy.get('a[href="https://twitter.com/flarenaming"]')
        .should('be.visible')
        .should('have.prop', 'href')
        .and('not.be.empty')

      // Docs
      cy.get('a[href="https://docs.flrns.domains/"]')
        .should('be.visible')
        .should('have.prop', 'href')
        .and('not.be.empty')

      // Website
      cy.get('a[href="https://flrns.domains/"]')
        .eq(1)
        .should('be.visible')
        .should('have.prop', 'href')
        .and('not.be.empty')
    })

    // Built on Flare
    it('Show built on Flare (image)', () => {
      cy.findByText('Built on').should('be.visible')
      cy.findByAltText('Logo bottom').should('be.visible')
    })
  })
})

// Mobile
describe('Search page Mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-7')
    cy.visit('http://localhost:3000/register?result=elevate.flr')
  })

  context('Logo section', () => {
    it('Logo should be visible and clickable --- Menu Icon should be visible', () => {
      // Logo
      cy.findByAltText('Logo').should('be.visible')
      cy.get('a[href="https://flrns.domains/"]')
        .should('have.prop', 'href')
        .and('not.be.empty')

      // Menu
      cy.findByAltText('Menu').should('be.visible')
    })
  })

  it('Search/My Account/FAQ should NOT exist', () => {
    cy.findByAltText('Search SideNavbar').should('not.exist')
    cy.findByAltText('Account SideNavbar').should('not.exist')
    cy.findByAltText('FAQ').should('not.exist')
  })

  context(
    'Middle section that should BE visible after clicked Menu icon',
    () => {
      beforeEach(() => {
        cy.findByAltText('Menu').click()
      })

      it('Search/My Account/FAQ should be visible', () => {
        cy.findByAltText('Search SideNavbar').should('be.visible')
        cy.findByAltText('Account SideNavbar').should('be.visible')
        cy.findByAltText('FAQ').should('be.visible')
      })

      it('Should go to Search page when clicked Search For Domain', () => {
        cy.findByText('Search For Domain').click()
        cy.location('pathname').should('eq', '/')
      })

      it('Should go to my_account page when clicked My Account', () => {
        cy.findByText('My Account').click()
        cy.location('pathname').should('eq', '/my_account')
      })

      it('Should go to FAQ page when clicked FAQ', () => {
        cy.findByText('FAQ').click()
        cy.location('pathname').should('eq', '/faq')
      })
    }
  )

  context('Bottom section', () => {
    // Social links
    it('Github/Discord/Twitter/Docs/Website link should be clickable', () => {
      // Github
      cy.get('a[href="https://github.com/flaredomains"]')
        .should('be.visible')
        .should('have.prop', 'href')
        .and('not.be.empty')

      // Discord
      cy.get('a[href="https://discord.gg/wDd3pGsscZ"]')
        .should('have.prop', 'href')
        .and('not.be.empty')

      // Twitter
      cy.get('a[href="https://twitter.com/flarenaming"]')
        .should('be.visible')
        .should('have.prop', 'href')
        .and('not.be.empty')

      // Docs
      cy.get('a[href="https://docs.flrns.domains/"]')
        .should('be.visible')
        .should('have.prop', 'href')
        .and('not.be.empty')

      // Website
      cy.get('a[href="https://flrns.domains/"]')
        .eq(1)
        .should('be.visible')
        .should('have.prop', 'href')
        .and('not.be.empty')
    })

    // Built on Flare
    it('Show built on Flare (image) should NOT be visible', () => {
      cy.findByText('Built on').should('not.be.visible')
      cy.findByAltText('Logo bottom').should('not.be.visible')
    })
  })
})

export {}

import '@testing-library/cypress/add-commands'

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      dataTest(value: string): Chainable<any>
    }
  }
}

Cypress.Commands.add('configureCypressTestingLibrary', (config) => {
  cy.configureCypressTestingLibrary(config)
})

Cypress.Commands.add('dataTest', (value) => {
  return cy.get(`[data-test=${value}]`)
})

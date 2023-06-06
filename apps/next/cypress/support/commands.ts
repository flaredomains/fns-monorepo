import '@testing-library/cypress/add-commands'

Cypress.Commands.add('configureCypressTestingLibrary', (config) => {
  cy.configureCypressTestingLibrary(config)
})

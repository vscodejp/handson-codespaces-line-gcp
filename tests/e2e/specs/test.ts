describe('E2E Test', () => {
  it('TopTitle check', () => {
    cy.visit(Cypress.env('base_url'))
    cy.contains('【手書きメッセージカード】')
  })
})

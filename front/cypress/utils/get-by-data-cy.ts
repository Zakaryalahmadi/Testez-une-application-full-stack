export function getByDataCy(name: string): Cypress.Chainable<JQuery<HTMLElement>>{
    return cy.get(`[data-cy="${name}"]`);
}
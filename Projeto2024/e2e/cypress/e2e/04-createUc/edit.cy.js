describe('Edit Uc Tests', () => {
    it('Edit uc', () => {
        cy.login('admin@uminho.pt', '123')

        cy.createUC('TOedit', 'Edit Edit', 'Teste','16/6/2025',"quinta das 14h às 16h, sala Ed.1 - 0.04","quinta das 14h às 16h, sala Ed.1 - 0.04","8 Trabalhos de casa (20%)")

        cy.get('[href="/ucs/update/TOedit"]').click()

        cy.get('[name="titulo"]').clear().type('EDITED')
        cy.get('#submit').click()
        cy.get('[href="/ucs/update/TOedit"]').click()

        cy.get('[name="titulo"]').should('have.value', 'EDITED')
    }) // TODO
})
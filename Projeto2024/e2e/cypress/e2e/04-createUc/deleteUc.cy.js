describe('Create Uc Tests', () => {
    it('Delete one UC', () => {
        cy.login('admin@uminho.pt', '123')

        cy.createUC('TO Delete', 'Delete Delete', 'Teste','16/6/2025',"quinta das 14h às 16h, sala Ed.1 - 0.04","quinta das 14h às 16h, sala Ed.1 - 0.04","8 Trabalhos de casa (20%)")

        cy.get('[href="/ucs/delete/TO Delete"]').click()

        cy.get('#uc-TO\ Delete > :nth-child(1)').should('not.exist')
    })
})
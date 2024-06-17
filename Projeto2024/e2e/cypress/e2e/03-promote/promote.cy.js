describe('Edit as cargos dos utilizadores', () => {
    it('Promover utilizador para Productor', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/admin/promote"]').click()

        cy.contains('Promover').first().click()
        //TODO verificar que o card nao existe
        
    })
})
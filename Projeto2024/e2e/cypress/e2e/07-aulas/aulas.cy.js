describe('Aulas Tests', () => {
    it('Create aulas', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()
        
        cy.get('.sec-center > .white-smoke').click()
        
        cy.get('[href="/ucs/EW24-25/aulas"]').click()

        cy.get('.space-between > .button').click()

        cy.get('[name="tipo"]').type("T")

        cy.get('[name="data"]').type("25/12/2025")

        cy.get('.CodeMirror-scroll').type("BOAS AULAS E BOM NATAL TAMBEM")

        cy.get('#submit').click()
    })

    it('Update aula', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/aulas"]').click()

        cy.contains('Atualizar').first().click()

        cy.get('[name="tipo"]').clear().type("TP")

        cy.get('#submit').click()

        cy.get('.card-header').should('have.text', '25/12/2025 (TP)')
    })

    it('Delete aula', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/aulas"]').click()

        cy.contains('Remover').first().click()

        cy.contains('Remover').should('not.exist')
    })

    it('Create 2 aulas', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/aulas"]').click()

        cy.get('.space-between > .button').click()

        cy.get('#newAula').click() 

        cy.get('#aula1 > :nth-child(1) > .w3-input').type("T")

        cy.get('#aula1 > :nth-child(2) > .w3-input').type("25/12/2025")

        cy.get('#aula1 > :nth-child(3) > .EasyMDEContainer > .CodeMirror > .CodeMirror-scroll').type("BOAS AULAS E BOM NATAL TAMBEM")

        cy.get(':nth-child(2) > :nth-child(1) > [name="tipo"]').type("T")

        cy.get(':nth-child(2) > :nth-child(2) > [name="data"]').type("25/12/2025")

        cy.get(':nth-child(2) > :nth-child(3) > .EasyMDEContainer > .CodeMirror > .CodeMirror-scroll').type("Ler o aviso anterior")

        cy.get('#submit').click()
    })
})

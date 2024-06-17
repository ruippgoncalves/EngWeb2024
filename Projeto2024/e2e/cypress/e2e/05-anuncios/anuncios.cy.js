describe('Create Anuncios Tests', () => {
    it('Create anuncio', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()
        cy.get('.rightBody > .flexbox > .button').click()

        cy.get('.w3-input').type("Notas")
        cy.get('.CodeMirror-scroll').type("Aviso 1")
        cy.get('#submit').click()
        cy.get(':nth-child(1) > td > .flexbox > .no-text-decoration > h1').should('have.text', 'Notas')
    })

    it('Delete anuncio', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()
        cy.get('.rightBody > .flexbox > .button').click()

        cy.get('.w3-input').type("delete")
        cy.get('.CodeMirror-scroll').type("Aviso 2")
        cy.get('#submit').click()

        cy.get(':nth-child(1) > td > .flexbox > div.w3-container > .w3-button').click()
        cy.get(':nth-child(1) > td > .flexbox > .no-text-decoration > h1').should('have.text', 'Notas')
    })
})

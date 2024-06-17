import path from "path";

describe('Docentes Tests', () => {
    it('Create docente', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/docentes"]').click()

        cy.get('.space-between > .button').click()

        cy.get('[name="nome"]').type("José Carlos Leite Ramalho")

        cy.get('[type="file"]').selectFile(path.join(__dirname, 'jcr-keep.png'))

        cy.get('[name="categoria"]').type("Regente")

        cy.get('[name="filiacao"]').type("Professor")

        cy.get('[name="email"]').type("jcr@uminho.pt")

        cy.get('[name="webpage"]').type("https://jcr.epl.di.uminho.pt/")

        cy.get('#submit').click()
    })

    it('Update docente', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/docentes"]').click()

        cy.contains('Atualizar').first().click()

        cy.get('[name="categoria"]').clear().type("Professor/Investigador/Empresário")

        cy.get('[type="file"]').selectFile(path.join(__dirname, 'jcr-keep.png'))

        cy.get('#submit').click()

        cy.contains('Atualizar').first().click()

        cy.get('[name="categoria"]').should('have.value', 'Professor/Investigador/Empresário')
    })

    it('Delete docente', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()


        cy.get('[href="/ucs/EW24-25/docentes"]').click()

        cy.contains('Remover').first().click()

        cy.contains('Remover').should('not.exist')
    })

    it('Create 2 docentes', () => { // TODO
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/docentes"]').click()

        cy.get('.space-between > .button').click()

        cy.get('#newDocente').click()

        cy.get('#docente1 > [name="nome"]').type("José Carlos Leite Ramalho")

        cy.get('#docente1 > [type="file"]').selectFile(path.join(__dirname, 'jcr-keep.png'))

        cy.get('#docente1 > [name="categoria"]').type("Professor/Investigador/Empresário")

        cy.get('#docente1 > [name="filiacao"]').type("Dep. Informática - Universidade do Minho")

        cy.get('#docente1 > [name="email"]').type("jcr@uminho.pt")

        cy.get('#docente1 > [name="webpage"]').type("https://jcr.epl.di.uminho.pt/")

        cy.get('#docente2 > [name="nome"]').type("Tiago")

        cy.get('#docente2 > [type="file"]').selectFile(path.join(__dirname, 'tiago.png'))

        cy.get('#docente2 > [name="categoria"]').type("Professor Convidado")

        cy.get('#docente2 > [name="filiacao"]').type("Dep. Informática - Universidade do Minho")

        cy.get('#docente2 > [name="email"]').type("d13753@di.uminho.pt")

        cy.get('#docente2 > [name="webpage"]').type("https://epl.di.uminho.pt/jcr/AULAS/EngWeb2024//")

        cy.get('#submit').click()
    })
})

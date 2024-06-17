import path from "path";

describe('Conteudo Tests', () => {
    it('Create conteudo PDF', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/resources"]').click()

        cy.get('.flex-grow > .button').click()

        cy.get('[type="text"]').type("SSA")

        cy.get('[type="file"]').selectFile(path.join(__dirname, "book-full.pdf"))

        cy.get('.CodeMirror-scroll').type("A um livro que fala sobre a forma do *static single assigment* (compliadores com otimizações).")

        cy.get('#submit').click()
    })

    it('Create conteudo Scratch', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/resources"]').click()

        cy.get('.flex-grow > .button').click()

        cy.get('[type="text"]').type("Flappy bird")

        cy.get('[type="file"]').selectFile(path.join(__dirname, "Flappy_bird____GamesAll.sb3"))

        cy.get('.CodeMirror-scroll').type("Jogo bastante popular ")

        cy.get('#submit').click()
    })

    it('Create conteudo Flash', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/resources"]').click()

        cy.get('.flex-grow > .button').click()

        cy.get('[type="text"]').type("Bitey of Brackenwood")

        cy.get('[type="file"]').selectFile(path.join(__dirname, "bitey1.swf"))
        cy.get('.CodeMirror-scroll').type("Animação em Flash")

        cy.get('#submit').click()
    })

    it('Remover conteudo PDF', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/resources"]').click()

        cy.get('.flex-grow > .button').click()

        cy.get('[type="text"]').type("SSA")

        cy.get('[type="file"]').selectFile(path.join(__dirname, "book-full.pdf"))

        cy.get('.CodeMirror-scroll').type("A um livro que fala sobre a forma do *static single assigment* (compliadores com otimizações).")

        cy.get('#submit').click()

        cy.contains('Remover Recurso').first().click()
    })
})

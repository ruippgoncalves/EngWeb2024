describe('Create Uc Tests', () => {
    it('Create uc', () => {
        cy.login('user1@gmail.com', '123') //TODO verificar se funcionou

        cy.get('.flex-grow > .button').click()

        cy.get('[name="sigla"]').type('EW24-25')
        cy.get('[name="titulo"]').type('Engenharia WEB')
        cy.get('[name="dataNome1"]').type('Teste')
        cy.get('[name="dataDia1"]').type('16/6/2025')
        cy.get('#newData').click()
        cy.get('[name="dataNome2"]').type('Exame')
        cy.get('[name="dataDia2"]').type('25/6/2025')
        cy.get('#horarioTeorico1').type("quinta das 14h às 16h, sala Ed.1 - 0.04")
        cy.get('#newHorarioPratico').click()
        cy.get('#newHorarioPratico').click()

        cy.get('#horarioPratico1').type("Turno 1: segunda das 14h às 16h, sala Ed. 7 - 1.09")
        //TODO 2 where are you??? (horario pratico 2)
        cy.get('#horarioPratico3').type("Turno 2: terça das 14h às 16h, sala Ed. 7 - 1.09")
        cy.get('#horarioPratico4').type("Turno 3: terça das 16h às 18h, sala Ed. 7 - 1.09")

        cy.get('#newAvaliacao').click()
        cy.get('#newAvaliacao').click()

        cy.get('#avaliacao1').type("8 Trabalhos de casa (20%)")
        cy.get('#avaliacao2').type("1 Projeto em grupo até 3 elementos (30%)[nota mínima de 10 val.")
        cy.get('#avaliacao3').type("1 Teste escrito (40%)[nota mínima de 10 val.")

        cy.get('#submit').click()
        cy.get('h1').should('have.text', 'Unidades Curriculares')
    })

    it('Error creating uc', () => {
        cy.login('admin@uminho.pt', '123')

        cy.createUC("EW24/2599", 'Engenharia WEB', 'Teste','16/6/2025',"quinta das 14h às 16h, sala Ed.1 - 0.04","quinta das 14h às 16h, sala Ed.1 - 0.04","8 Trabalhos de casa (20%)")

        cy.get('p').should('have.text', 'Nao foi possivel criar a UC')
    })
})



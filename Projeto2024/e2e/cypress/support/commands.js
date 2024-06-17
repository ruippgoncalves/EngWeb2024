Cypress.Commands.add('login', (email, password) => {
    cy.visit('http://localhost:5000')

    cy.get('[type="text"]').type(email)
    cy.get('[type="password"]').type(password)

    cy.get('.button').click()
})

Cypress.Commands.add('register', (name, email, pass, pass2=undefined) => {
    if (pass2 === undefined)
        pass2 = pass;

    cy.visit('http://localhost:5000/')

    cy.get('[href="/register"]').click()

    cy.get(':nth-child(1) > .w3-input').type(name)
    cy.get(':nth-child(2) > .w3-input').type(email)
    cy.get(':nth-child(3) > .w3-input').type(pass)
    cy.get(':nth-child(4) > .w3-input').type(pass2)
    cy.get('.flexbox > .w3-input').type("Estudante")
    
    cy.get('.space-between > .flexbox > .gold').click()
})

Cypress.Commands.add('createUC', (sigla, titulo, dataNome,dataDia,horarioTeorico,horarioPratico,avaliacao) => {

    cy.get('.flex-grow > .button').click()

    cy.get('[name="sigla"]').type(sigla)
    cy.get('[name="titulo"]').type(titulo)
    cy.get('[name="dataNome1"]').type(dataNome)
    cy.get('[name="dataDia1"]').type(dataDia)
    cy.get('#newData').click()
    cy.get('[name="dataNome2"]').type(dataNome)
    cy.get('[name="dataDia2"]').type(dataDia)
    cy.get('#horarioTeorico1').type(horarioTeorico)
    cy.get('#newHorarioPratico').click()
    cy.get('#newHorarioPratico').click()

    cy.get('#horarioPratico1').type(horarioPratico)
    //TODO 2 where are you??? (horario pratico 2)
    cy.get('#horarioPratico3').type(horarioPratico)
    cy.get('#horarioPratico4').type(horarioPratico)

    cy.get('#newAvaliacao').click()
    cy.get('#newAvaliacao').click()

    cy.get('#avaliacao1').type(avaliacao)
    cy.get('#avaliacao2').type(avaliacao)
    cy.get('#avaliacao3').type(avaliacao)

    cy.get('#submit').click()
})

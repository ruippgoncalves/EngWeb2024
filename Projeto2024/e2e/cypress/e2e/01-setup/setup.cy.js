const path = require('path')

describe('Perform setup', () => {
    it('wrong password', () => {
        cy.visit('http://localhost:5000')

        cy.get(':nth-child(2) > .w3-input').type('admin')
        cy.get(':nth-child(3) > .w3-input').type('UMinho')
        cy.get(':nth-child(4) > .w3-input').selectFile(path.join(__dirname, 'fav-icon-uminho.jpg'))
        cy.get(':nth-child(5) > .w3-input').type('admin@uminho.pt')
        cy.get(':nth-child(6) > .w3-input').type('123')
        cy.get(':nth-child(7) > .w3-input').type('1273')

        cy.get('.button').click()

        cy.get('p').should('have.text', 'As palavras-passe introduzidas não coincidem!')
    })

    it('Insert the data to setup the app', () => {
        cy.visit('http://localhost:5000')

        cy.get(':nth-child(2) > .w3-input').type('admin')
        cy.get(':nth-child(3) > .w3-input').type('UMinho')
        cy.get(':nth-child(4) > .w3-input').selectFile(path.join(__dirname, 'fav-icon-uminho.jpg'))
        cy.get(':nth-child(5) > .w3-input').type('admin@uminho.pt')
        cy.get(':nth-child(6) > .w3-input').type('123')
        cy.get(':nth-child(7) > .w3-input').type('123')

        cy.get('.button').click()

        cy.get('h1').should('have.text', 'Login')
    })
})

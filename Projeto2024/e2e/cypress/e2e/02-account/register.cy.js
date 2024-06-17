describe('Perform setup', () => {
    it('Password doesn\'t match', () => {
        cy.register('user1', 'user1@gmail.com', '123', '1234')

        cy.get('p').should('have.text', 'As palavras-passe introduzidas não coincidem!')
    })

    it('Create User', () => {
        cy.register('user1', 'user1@gmail.com', '123')

        cy.get('h1').should('have.text', 'Login')
    })

    it('User already exists', () => {
        cy.register('user1', 'user1@gmail.com', '123')

        cy.get('p').should('have.text', 'Ja existe um utilizador com esse Email')
    })
})

describe('Login Tests', () => {
    it('Wrong email or password', () => {
        cy.login('admin', '123')

        cy.get('p').should('have.text', 'O email ou a palavra-passe encontra-se erradas!')
    })

    it('Admin Login', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('h1').should('have.text', 'Unidades Curriculares')
    })

    it('Logout test', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('[href="/logout"]').click()

        cy.visit('http://localhost:5000/ucs')

        cy.get('h1').should('have.text', 'Login')
    })
})

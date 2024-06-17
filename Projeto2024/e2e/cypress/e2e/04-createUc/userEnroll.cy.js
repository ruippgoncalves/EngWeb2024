describe('User Enroll Test', () => {
    it('User Enroll', () => {  
        cy.register('userEnroll', 'userEnroll@gmail.com', '123')
        cy.login('userEnroll@gmail.com', '123')
        cy.get('.sec-center > .white-smoke').click()
        cy.get('.dropdown-a').click()

        cy.get('.w3-input').type("EW24-25")
        cy.get('#submit').click()

        cy.get('.ag-courses-item_title').should('have.text', 'EW24-25')
    })
})
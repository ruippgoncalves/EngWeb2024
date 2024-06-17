import path from "path";

describe('Export dips tests', () => {
    it('Export dip', () => {
        cy.login('admin@uminho.pt', '123')

        cy.intercept('GET', '/sip/export/admin').as('sipDownload'); // TODO xoto

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/sip/export/admin"]').click()

        cy.wait('@sipDownload');
    })

    it('Invalid sip', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/sip/import/admin"]').click()

        cy.get('#sip').selectFile(path.join(__dirname, "wrong-sip.zip"))

        cy.get('.flex-grow > .flexbox > .gold').click()

        cy.get('p').should('have.text', 'Nao foi possivel importar a UC')
    })

    it('Valid sip', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('.sec-center > .white-smoke').click()
        cy.get('[href="/sip/import/admin"]').click()

        cy.get('#sip').selectFile(path.join(__dirname, './../cypress/downloads/exportSystem.zip'))

        cy.get('.flex-grow > .flexbox > .gold').click()
        cy.get('h1').should('have.text', 'Unidades Curriculares')
    })
    
    it('Export UC\'s', () => {
        cy.login('user1@gmail.com', '123')

        cy.intercept('GET', '/sip/export').as('sipDownload'); // TODO xoto

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/sip/export"]').click()

        cy.wait('@sipDownload');
    })

    it('Import UC\'s', () => {
        cy.login('user1@gmail.com', '123')

        cy.get('.sec-center > .white-smoke').click()
        cy.get('[href="/sip/import"]').click()

        cy.get('#sip').selectFile(path.join(__dirname, './../cypress/downloads/exportUC.zip'))

        cy.get('.flex-grow > .flexbox > .gold').click()
        cy.get('h1').should('have.text', 'Unidades Curriculares')
    })
})

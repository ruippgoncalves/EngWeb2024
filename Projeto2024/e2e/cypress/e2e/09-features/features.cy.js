describe('Features tests', () => {
    it('Desativar registo', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/features"]').click()

        cy.get('#DISABLE_REGISTER').click()

        cy.get('button.button').click()

        cy.get('a.button').click()

        cy.get('[href="/logout"]').click()

        cy.get('[href="/register"]').should('not.exist')
    })

    it('Ativar registo', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/features"]').click()

        cy.get('#DISABLE_REGISTER').click()

        cy.get('button.button').click()

        cy.get('a.button').click()

        cy.get('[href="/logout"]').click()

        cy.get('[href="/register"]').should('exist')
    })

    it('Desativar renderização de recursos', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/features"]').click()

        cy.get('#SCRATCH_RENDERING').click()

        cy.get('#PDFJS_RENDERING').click()

        cy.get('#FLASH_RENDERING').click()

        cy.get('button.button').click()

        cy.get('a.button').click()

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/resources"]').click()

        cy.contains('Abrir Recurso').should('not.exist')
    })

    it('Ativar renderização de recursos', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/features"]').click()

        cy.get('#SCRATCH_RENDERING').click()

        cy.get('#PDFJS_RENDERING').click()

        cy.get('#FLASH_RENDERING').click()

        cy.get('button.button').click()

        cy.get('a.button').click()

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/resources"]').click()

        cy.contains('Abrir Recurso').should('exist')
    })

    it('Testar Scratch', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/resources"]').click()

        cy.get(':nth-child(1) > .card').contains('Abrir Recurso').click()
    
        cy.get(':nth-child(1) > .card').contains('Abrir noutro separador').click()

        cy.get('canvas').should('exist')
    })

    it('Testar Flash', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/resources"]').click()

        cy.get(':nth-child(2) > .card').contains('Abrir Recurso').click()
    
        cy.intercept('GET', 'http://localhost:5000/static/EW24-25/*.swf').as('flash')

        cy.get(':nth-child(2) > .card').contains('Abrir noutro separador').click()

        cy.wait('@flash')

        cy.get('ruffle-player').should('exist')
    })

    it('Testar PDF', () => {
        cy.login('admin@uminho.pt', '123')

        cy.get('#uc-EW24-25 > :nth-child(1) > a').click()

        cy.get('.sec-center > .white-smoke').click()

        cy.get('[href="/ucs/EW24-25/resources"]').click()

        cy.get(':nth-child(3) > .card').contains('Abrir Recurso').click()
    
        cy.get(':nth-child(3) > .card').contains('Abrir noutro separador').click()

        cy.get('iframe').should('exist')
    })
})

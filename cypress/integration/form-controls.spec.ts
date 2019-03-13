/// <reference types="Cypress" />

context('Calendar', () => {
    const widget = `calendar-showcase .calendar[widget]`;

    it('Load form controls', () => {
        cy.visit('http://localhost:4200/#/form-controls');
    });

    it('Calendar is visible', () => {
        cy.get(widget).should('be.visible');
    });

    const today = Cypress.moment();

    it('Shows current month', () => {
        cy.contains(`${widget} .month`, today.format('MMMM YYYY'))
            .should('be.visible');
    });

    it('Current day is active', () => {
        cy.contains(`${widget} .day .active`, today.format('D'))
            .should('be.visible');
    });

    const next_month = Cypress.moment().add(1, 'M').startOf('M');

    it('Changing to next month works', () => {
        cy.get(`${widget} .next`).click();
        cy.contains(`${widget} .month`, next_month.format('MMMM YYYY')).should('be.visible');
    });

    it('Change active day to 4th of next month', () => {
        next_month.add(3, 'd');
        cy.contains(`${widget} .day .content:not(.non-month)`, next_month.format('D')).click();
    })

    it('Should display the new date', () => {
        cy.contains(`calendar-showcase .container > .date`, next_month.format('DD MMM YYYY')).should('be.visible');
    })
});
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

context('Time Picker', () => {
    const widget = `time-picker-showcase`;

    it('Load form controls', () => {
        cy.visit('http://localhost:4200/#/form-controls/time-picker');
        cy.wait(1000);
    });

    it('Time picker should be visible', () => {
        cy.get(`${widget} [widget]`).should('be.visible');
    });

    it('Change start time to 11:30', () => {
        cy.contains(`${widget} [widget] .clockface .value`, '11').click();
        cy.wait(200);
        cy.contains(`${widget} [widget] .group-item .start .hours`, '11').should('be.visible');
        cy.wait(1000);
        cy.contains(`${widget} [widget] .clockface`, '00').should('be.visible');
        cy.contains(`${widget} [widget] .clockface .value`, '30').click();
        cy.wait(200);
        cy.contains(`${widget} [widget] .group-item .start .minutes`, '30').scrollIntoView().should('be.exist');
    });

    it('Change end time to 1:30', () => {
        cy.get(`${widget} [widget] .group-item .end .hours`).click()
        cy.contains(`${widget} [widget] .clockface .value`, ' 1 ').click();
        cy.wait(200);
        cy.contains(`${widget} [widget] .group-item .end .hours`, '01').should('be.visible');
        cy.wait(1000);
        cy.contains(`${widget} [widget] .clockface`, '00').should('be.visible');
        cy.contains(`${widget} [widget] .clockface .value`, '30').click();
        cy.wait(200);
        cy.contains(`${widget} [widget] .group-item .end .minutes`, '30').scrollIntoView().should('be.exist');
        cy.contains(`${widget} [widget] .duration`, ' 2 hours').should('be.visible');
    });

    it('Check start period change', () => {
            //
        if (cy.contains(`${widget} [widget] .group-item .start .period.active`, 'AM')) {
            cy.get(`${widget} [widget] .group-item .start .block.period`).click();
            cy.contains(`${widget} [widget] .group-item .start .period.active`, 'PM').should('be.visible');
        } else {
            cy.get(`${widget} [widget] .group-item .start .block.period`).click();
            cy.contains(`${widget} [widget] .group-item .start .period.active`, 'AM').should('be.visible');
        }
        cy.contains(`${widget} [widget] .duration`, '2 hours').should('be.visible');
    });

    it('Check end period change', () => {
        if (cy.contains(`${widget} [widget] .group-item .end .period.active`, 'AM')) {
            cy.get(`${widget} [widget] .group-item .end .block.period`).click();
            cy.contains(`${widget} [widget] .group-item .end .period.active`, 'PM').should('be.visible');
        } else {
            cy.get(`${widget} [widget] .group-item .end .block.period`).click();
            cy.contains(`${widget} [widget] .group-item .end .period.active`, 'AM').should('be.visible');
        }
        cy.contains(`${widget} [widget] .duration`, ' 14 hours').should('be.visible');
    })
});

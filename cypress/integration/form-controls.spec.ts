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
        cy.visit('http://localhost:4200/#/form-controls');
        cy.wait(1000);
    });

    it('Time picker should be visible', () => {
        cy.get(`${widget} .showcase`).scrollIntoView().should('be.visible');
        cy.get(`${widget} [widget] .group-item .start .period.active`).then(el => {
            if (el.text().includes('PM')) {
                cy.get(`${widget} [widget] .group-item .start .block.period`).should('be.visible').click({ force: true });
                cy.contains(`${widget} [widget] .group-item .start .period.active`, 'AM').should('be.visible');
            }
        });
    });

    it('Change start time to 8:30', () => {
        cy.contains(`${widget} [widget] .clockface .value`, '8').should('be.visible').click({ force: true });
        cy.wait(200);
        cy.contains(`${widget} [widget] .group-item .start .hours`, '8').should('be.visible');
        cy.wait(1000);
        cy.contains(`${widget} [widget] .clockface`, '00').should('be.visible');
        cy.contains(`${widget} [widget] .clockface .value`, '30').should('be.visible').click({ force: true });
        cy.wait(200);
        cy.contains(`${widget} [widget] .group-item .start .minutes`, '30').should('be.exist');
    });

    it('Change end time to 10:15', () => {
        cy.get(`${widget} [widget] .group-item .end .hours`).should('be.visible').click({ force: true })
        cy.contains(`${widget} [widget] .clockface .value`, ' 10 ').should('be.visible').click({ force: true });
        cy.wait(200);
        cy.contains(`${widget} [widget] .group-item .end .hours`, '10').should('be.visible');
        cy.wait(1000);
        cy.contains(`${widget} [widget] .clockface`, '00').should('be.visible');
        cy.contains(`${widget} [widget] .clockface .value`, '15').should('be.visible').click({ force: true });
        cy.wait(200);
        cy.contains(`${widget} [widget] .group-item .end .minutes`, '15').should('be.exist');
        cy.contains(`${widget} [widget] .duration`, ' 1 hour 45 minutes ').should('be.visible');
    });

    it('Check start period change', () => {
        const period = `${widget} [widget] .group-item .start`;
        cy.get(`${period} .period.active`).then(el => {
            if (el.text().includes('PM')) {
                cy.get(`${period} .block.period`).should('be.visible').click({ force: true });
                cy.contains(`${period} .period.active`, 'AM').should('be.visible');
            } else {
                cy.get(`${period} .block.period`).should('be.visible').click({ force: true });
                cy.contains(`${period} .period.active`, 'PM').should('be.visible');
            }
        });
        cy.contains(`${widget} [widget] .duration`, ' 1 hour 45 minutes ').should('be.visible');
    });

    it('Check end period change', () => {
        const period = `${widget} [widget] .group-item .end`;
        cy.get(`${period} .period.active`).then(el => {
            if (el.text().includes('PM')) {
                cy.get(`${period} .block.period`).should('be.visible').click({ force: true });
                cy.contains(`${period} .period.active`, 'AM').should('be.visible');
            } else {
                cy.get(`${period} .block.period`).should('be.visible').click({ force: true });
                cy.contains(`${period} .period.active`, 'PM').should('be.visible');
            }
        });
        cy.contains(`${widget} [widget] .duration`, ' 13 hours 45 minutes').should('be.visible');
        cy.get(`${period} .block.period`).should('be.visible').click({ force: true });
    });

    it('Check toggle to manual input', () => {
        cy.get(`${widget} [widget] .toggle`).should('be.visible').click({ force: true });
        cy.wait(200);
        cy.contains(`${widget} [widget] .display`, 'Set period').should('be.visible');
        cy.contains(`${widget} [widget] .picker`, 'Type in').should('be.visible');
        cy.get(`${widget} [widget] .clockface`).should('not.exist');
    });

    it('Change start time to 7:15 PM', () => {
        cy.get(`${widget} [widget] .start .hr input`)
            .should('be.visible').clear({ force: true }).type('19', { force: true })
            .should('have.value', '19');
        cy.get(`${widget} [widget] .start .min input`)
            .should('be.visible').clear({ force: true }).type('15', { force: true })
            .should('have.value', '15');
        cy.wait(200);
        cy.get(`${widget} [widget] .end .hr input`)
            .should('have.value', '21');
        cy.get(`${widget} [widget] .end .min input`)
            .should('have.value', '00');
        cy.get(`${widget} [widget] .toggle`).should('be.visible').click({ force: true });
        cy.wait(200);
        cy.contains(`${widget} [widget] .group-item .start .period.active`, 'PM').should('be.visible');
        cy.contains(`${widget} [widget] .group-item .start .hours`, '07').should('be.visible');
        cy.contains(`${widget} [widget] .group-item .start .minutes`, '15').should('be.visible');
        cy.get(`${widget} [widget] .toggle`).should('be.visible').click({ force: true });
        cy.wait(200);
    });

    it('Change end time to 9:30 PM', () => {
        cy.get(`${widget} [widget] .end .hr input`)
            .should('be.visible').clear({ force: true }).type('21', { force: true })
            .should('have.value', '21');
        cy.get(`${widget} [widget] .end .min input`)
            .should('be.visible').clear({ force: true }).type('30', { force: true })
            .should('have.value', '30');
        cy.wait(200);
        cy.get(`${widget} [widget] .start .hr input`)
            .should('have.value', '19');
        cy.get(`${widget} [widget] .start .min input`)
            .should('have.value', '15');
        cy.get(`${widget} [widget] .toggle`).should('be.visible').click({ force: true });
        cy.wait(200);
        cy.contains(`${widget} [widget] .group-item .end .period.active`, 'PM').should('be.visible');
        cy.contains(`${widget} [widget] .group-item .end .hours`, '09').should('be.visible');
        cy.contains(`${widget} [widget] .group-item .end .minutes`, '30').should('be.visible');
        cy.contains(`${widget} [widget] .duration`, ' 2 hours 15 minutes').should('be.visible');
        cy.get(`${widget} [widget] .toggle`).should('be.visible').click({ force: true });
        cy.wait(200);
    });
});

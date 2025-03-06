import React from 'react';
import Quiz from '../../client/src/components/Quiz';
import { mount } from 'cypress/react18';

describe('Quiz Component', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
    });

    it('renders the Start Quiz button initially', () => {
        mount(<Quiz />);
        cy.get('button').contains('Start Quiz').should('be.visible');
        cy.get('button').contains('Start Quiz').should('not.be.disabled');
    });

    it('allows for the Start Quiz button to be clicked', () => {
        mount(<Quiz />);
        cy.get('button').contains('Start Quiz').click();
    });

    it('displays the first question after loading', () => {
        mount(<Quiz />);
        cy.get('button').contains('Start Quiz').click();
        cy.wait('@getQuestions');

        cy.get('h2').should('contain', 'What is the output of print(2 ** 3)?');

        cy.get('.alert.alert-secondary').should('have.length', 4);
        cy.get('.alert.alert-secondary').eq(0).should('contain', '6');
        cy.get('.alert.alert-secondary').eq(1).should('contain', '8');
        cy.get('.alert.alert-secondary').eq(2).should('contain', '9');
        cy.get('.alert.alert-secondary').eq(3).should('contain', '12');
    });

    it('increments score when correct answer is selected', () => {
        mount(<Quiz />);
        cy.get('button').contains('Start Quiz').click();
        cy.wait('@getQuestions');

        // Select the correct answer (8) which is at index 1
        cy.get('.btn.btn-primary').eq(1).click();

        // Select the correct answer "list" which is at index 2
        cy.get('.btn.btn-primary').eq(2).click();

        // Select the correct answer "def" which is at index 2
        cy.get('.btn.btn-primary').eq(2).click();

        cy.get('.alert.alert-success').should('contain', 'Your score: 3/3');
    });

    it('does not increment score when incorrect answer is selected', () => {
        mount(<Quiz />);
        cy.get('button').contains('Start Quiz').click();
        cy.wait('@getQuestions');

        // Select incorrect answers for all questions
        cy.get('.btn.btn-primary').eq(0).click();
        cy.get('.btn.btn-primary').eq(0).click();
        cy.get('.btn.btn-primary').eq(0).click();

        cy.get('.alert.alert-success').should('contain', 'Your score: 0/3');
    });

    it('allows restarting the quiz after completion', () => {
        mount(<Quiz />);
        cy.get('button').contains('Start Quiz').click();
        cy.wait('@getQuestions');

        // Answer all questions to complete the quiz
        cy.get('.btn.btn-primary').eq(0).click();
        cy.get('.btn.btn-primary').eq(0).click();
        cy.get('.btn.btn-primary').eq(0).click();

        // Verify quiz is completed
        cy.get('.alert.alert-success').should('exist');

        cy.get('button').contains('Take New Quiz').click();
        cy.wait('@getQuestions');

        cy.get('h2').should('contain', 'What is the output of print(2 ** 3)?');
    });
});
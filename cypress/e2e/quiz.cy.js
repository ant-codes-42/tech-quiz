describe('Quiz E2E Tests', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
        cy.visit('/');
    });

    it('should display the quiz application', () => {
        cy.get('.btn.btn-primary').should('exist');
        cy.contains('Start Quiz').should('be.visible');
    });

    it('should start the quiz when clicking the Start Quiz button', () => {
        cy.get('.btn.btn-primary').contains('Start Quiz').click();
        cy.wait('@getQuestions');
        cy.get('h2').should('be.visible');
        cy.get('.btn.btn-primary').should('have.length.at.least', 3); // At least 3 answer buttons
    });

    it('should display the first question with multiple choice answers', () => {
        cy.get('.btn.btn-primary').contains('Start Quiz').click();
        cy.wait('@getQuestions');

        cy.get('h2').should('contain', 'What is the output of print(2 ** 3)?');
        cy.get('.alert.alert-secondary').should('have.length', 4);
        cy.get('.alert.alert-secondary').eq(0).should('contain', '6');
        cy.get('.alert.alert-secondary').eq(1).should('contain', '8');
        cy.get('.alert.alert-secondary').eq(2).should('contain', '9');
        cy.get('.alert.alert-secondary').eq(3).should('contain', '12');
    });

    it('should move to the next question after answering', () => {
        cy.get('.btn.btn-primary').contains('Start Quiz').click();
        cy.wait('@getQuestions');

        cy.get('.btn.btn-primary').eq(0).click();

        cy.get('h2').should('contain', 'Which of the following is a mutable data type in Python?');
    });

    it('should show the final score after answering all questions', () => {
        cy.get('.btn.btn-primary').contains('Start Quiz').click();
        cy.wait('@getQuestions');

        cy.get('.btn.btn-primary').eq(1).click();
        cy.get('.btn.btn-primary').eq(2).click();
        cy.get('.btn.btn-primary').eq(2).click();

        cy.contains('Quiz Completed').should('be.visible');
        cy.get('.alert.alert-success').should('contain', 'Your score: 3/3');
        cy.contains('Take New Quiz').should('be.visible');
    });

    it('should be able to restart the quiz after completion', () => {
        cy.get('.btn.btn-primary').contains('Start Quiz').click();
        cy.wait('@getQuestions');

        cy.get('.btn.btn-primary').eq(0).click();
        cy.get('.btn.btn-primary').eq(0).click();
        cy.get('.btn.btn-primary').eq(0).click();

        cy.contains('Take New Quiz').click();
        cy.wait('@getQuestions');

        cy.get('h2').should('contain', 'What is the output of print(2 ** 3)?');
    });

    it('should handle errors gracefully', () => {
        // Simulate an API error
        cy.intercept('GET', '/api/questions/random', {
            statusCode: 500,
            body: { message: 'Server error' }
        }).as('getQuestionsError');

        cy.get('.btn.btn-primary').contains('Start Quiz').click();
        cy.wait('@getQuestionsError');

        cy.get('.spinner-border').should('exist');
    });
});
/// <reference types="cypress" />

describe('Teachable Dashboard', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', 'https://developers.teachable.com/v1/courses', {
      body: {
        courses: [
          {
            id: '1',
            name: 'Test Course 1',
            image_url: 'https://example.com/image1.jpg',
            heading: 'Test Heading 1',
            is_published: true,
          },
          {
            id: '2',
            name: 'Test Course 2',
            image_url: 'https://example.com/image2.jpg',
            heading: 'Test Heading 2',
            is_published: true,
          },
        ],
      },
      delay: 1000, // Add delay to test loading state
    }).as('getCourses');

    cy.intercept('GET', 'https://developers.teachable.com/v1/users', {
      body: {
        users: [
          { id: 1, name: 'Student 1', email: 'student1@test.com' },
          { id: 2, name: 'Student 2', email: 'student2@test.com' },
          { id: 3, name: 'Student 3', email: 'student3@test.com' },
        ],
      },
    }).as('getStudents');

    cy.intercept(
      'GET',
      'https://developers.teachable.com/v1/courses/*/enrollments',
      {
        body: {
          enrollments: [
            { user_id: 1, percent_complete: 100 },
            { user_id: 2, percent_complete: 50 },
            { user_id: 3, percent_complete: 100 },
          ],
        },
        delay: 500, // Add delay to test loading state
      }
    ).as('getEnrollments');

    // Visit the page
    cy.visit('/');
  });

  it('shows loading state and then displays courses', () => {
    // Check loading state
    cy.contains('Loading courses...').should('be.visible');

    // Wait for courses to load
    cy.wait('@getCourses');
    cy.wait('@getStudents');

    // Verify courses are displayed
    cy.contains('Test Course 1').should('be.visible');
    cy.contains('Test Course 2').should('be.visible');
    cy.contains('Loading courses...').should('not.exist');
  });

  it('opens modal with student list when clicking View Students', () => {
    // Wait for initial data to load
    cy.wait('@getCourses');
    cy.wait('@getStudents');

    // Click View Students on first course
    cy.contains('Test Course 1').parent().contains('View Students').click();

    // Check loading state in modal
    cy.contains('Loading students...').should('be.visible');

    // Wait for enrollments to load
    cy.wait('@getEnrollments');

    // Verify student data is displayed
    cy.contains('Student 1').should('be.visible');
    cy.contains('Student 2').should('be.visible');
    cy.contains('Student 3').should('be.visible');
  });

  it('filters completed students when toggle is clicked', () => {
    // Wait for initial data to load
    cy.wait('@getCourses');
    cy.wait('@getStudents');

    // Open modal
    cy.contains('Test Course 1').parent().contains('View Students').click();

    cy.wait('@getEnrollments');

    // Initially all students should be visible
    cy.contains('Student 1').should('be.visible');
    cy.contains('Student 2').should('be.visible');
    cy.contains('Student 3').should('be.visible');

    // Click the Completed toggle
    cy.contains('label', 'Completed')
      .find('input[type="checkbox"]')
      .click({ force: true }); // force:true because the input is visually hidden

    // Only students with 100% completion should be visible
    cy.contains('Student 1').should('be.visible');
    cy.contains('Student 2').should('not.exist');
    cy.contains('Student 3').should('be.visible');
  });

  it('closes modal when clicking close button', () => {
    // Wait for initial data to load
    cy.wait('@getCourses');
    cy.wait('@getStudents');

    // Open modal
    cy.contains('Test Course 1').parent().contains('View Students').click();

    cy.wait('@getEnrollments');

    // Verify modal is open
    cy.contains('Students in Test Course 1').should('be.visible');

    // Click close button (using test id)
    cy.get('[data-testid="modal-content"]').find('button').click();

    // Verify modal is closed
    cy.contains('Students in Test Course 1').should('not.exist');
  });
});

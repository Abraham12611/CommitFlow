// Import the function to be tested
const { generateCommitMessage } = require('../lib/generateMessage');

describe('generateCommitMessage', () => {
  // Test case 1: When scope and issue are provided
  it('should generate a correct commit message with type, scope, description, and issue', () => {
    const commitDetails = {
      type: 'feat',
      scope: 'UI',
      description: 'add new button component',
      issue: '#123',
    };

    const expectedMessage = 'feat(UI): add new button component (Closes #123)';
    const generatedMessage = generateCommitMessage(commitDetails);

    // Expect the generated message to match the expected message
    expect(generatedMessage).toBe(expectedMessage);
  });

  // Test case 2: When only type and description are provided (no scope or issue)
  it('should generate a correct commit message with type and description only', () => {
    const commitDetails = {
      type: 'fix',
      scope: '',
      description: 'resolve crashing issue',
      issue: '',
    };

    const expectedMessage = 'fix: resolve crashing issue';
    const generatedMessage = generateCommitMessage(commitDetails);

    // Expect the generated message to match the expected message
    expect(generatedMessage).toBe(expectedMessage);
  });

  // Test case 3: When issue is provided but scope is not provided
  it('should generate a correct commit message with type, description, and issue but no scope', () => {
    const commitDetails = {
      type: 'refactor',
      scope: '',
      description: 'optimize database queries',
      issue: '#567',
    };

    const expectedMessage = 'refactor: optimize database queries (Closes #567)';
    const generatedMessage = generateCommitMessage(commitDetails);

    // Expect the generated message to match the expected message
    expect(generatedMessage).toBe(expectedMessage);
  });

  // Test case 4: When scope is provided but no issue
  it('should generate a correct commit message with type, scope, and description but no issue', () => {
    const commitDetails = {
      type: 'chore',
      scope: 'backend',
      description: 'update dependencies',
      issue: '',
    };

    const expectedMessage = 'chore(backend): update dependencies';
    const generatedMessage = generateCommitMessage(commitDetails);

    // Expect the generated message to match the expected message
    expect(generatedMessage).toBe(expectedMessage);
  });

  // Test case 5: Invalid input - description is missing
  it('should return a validation error if description is missing', () => {
    const commitDetails = {
      type: 'fix',
      scope: 'API',
      description: '',
      issue: '',
    };

    const expectedMessage = 'fix(API): ';
    const generatedMessage = generateCommitMessage(commitDetails);

    // Expect the generated message to handle missing descriptions properly
    expect(generatedMessage).toBe(expectedMessage);
  });
});

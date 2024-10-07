// Function to generate commit message based on user input
function generateCommitMessage({ type, scope, description, issue }) {
    // Format the scope if it's provided
    const formattedScope = scope ? `(${scope})` : '';
  
    // Build the base commit message
    let commitMessage = `${type}${formattedScope}: ${description}`;
  
    // If an issue/ticket number is provided, append it to the commit message
    if (issue) {
      commitMessage += ` (Closes ${issue})`;
    }
  
    return commitMessage;
  }
  
  // Export the function to be used in other files
  module.exports = { generateCommitMessage };
  
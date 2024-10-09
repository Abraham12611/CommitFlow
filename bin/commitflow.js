#!/usr/bin/env node
const { execSync } = require('child_process');
const { generateCommitMessage } = require('../lib/generateMessage.js');
const simpleGit = require('simple-git');
const { aiCommitMessage } = require('../src/aiCommit.js');
const { select, text, confirm } = require('@inquirer/prompts'); // Import specific prompt types

// Initialize git
const git = simpleGit();

// CLI Flow
async function runCommitFlow() {
  try {
    // Check if the user is using AI or manual mode
    const { mode } = await select({ 
      name: 'mode',
      message: 'Choose commit mode:',
      choices: [
        { title: 'Manual', value: 'manual' }, 
        { title: 'AI', value: 'ai' }
      ],
    });

    if (mode === 'manual') {
      // Manual Mode
      const commitDetails = await Promise.all([
        await text({ name: 'type', message: 'Commit type:' }), // Use await here
        await text({ name: 'scope', message: 'Commit scope:' }), // Use await here
        await text({ name: 'description', message: 'Commit description:' }), // Use await here
        await text({ name: 'issue', message: 'Issue/ticket number (optional):' }), // Use await here
      ]);
      const commitMessage = generateCommitMessage(commitDetails);
      console.log('Generated Commit Message:', commitMessage);

      // Ask to run the commit
      const { confirmCommit } = await confirm({
        name: 'confirmCommit',
        message: 'Commit with this message?'
      });

      if (confirmCommit) {
        git.commit(commitMessage);
        console.log('Committed successfully!');
      }
    } else {
      // AI Mode
      const { apiKey } = await text({
        name: 'apiKey',
        message: 'Enter your OpenAI API key:'
      });

      // Get changes from git
      const diff = execSync('git diff --staged', { encoding: 'utf8' });
      const commitMessage = await aiCommitMessage(diff, apiKey);

      console.log('AI-Generated Commit Message:', commitMessage);

      // Ask to run the commit
      const { confirmCommit } = await confirm({
        name: 'confirmCommit',
        message: 'Commit with this message?'
      });

      if (confirmCommit) {
        git.commit(commitMessage);
        console.log('Committed successfully!');
      }
    }
  } catch (error) {
    console.error('Error during commit flow:', error);
  }
}

runCommitFlow();

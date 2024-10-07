#!/usr/bin/env node
import { execSync } from 'child_process';
import { generateCommitMessage } from '../lib/generateMessage.js';
import { aiCommitMessage } from '../src/aiCommit.js';
import inquirer from 'inquirer';
import simpleGit from 'simple-git';

// Initialize git
const git = simpleGit();

// CLI Flow
async function runCommitFlow() {
  // Check if the user is using AI or manual mode
  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Choose commit mode:',
      choices: ['Manual', 'AI'],
    },
  ]);

  if (mode === 'Manual') {
    // Manual Mode
    const commitDetails = await inquirer.prompt([
      { name: 'type', message: 'Commit type:' },
      { name: 'scope', message: 'Commit scope:' },
      { name: 'description', message: 'Commit description:' },
      { name: 'issue', message: 'Issue/ticket number (optional):' },
    ]);
    const commitMessage = generateCommitMessage(commitDetails);
    console.log('Generated Commit Message:', commitMessage);

    // Ask to run the commit
    const { confirmCommit } = await inquirer.prompt([
      { type: 'confirm', name: 'confirmCommit', message: 'Commit with this message?' },
    ]);

    if (confirmCommit) {
      git.commit(commitMessage);
      console.log('Committed successfully!');
    }
  } else {
    // AI Mode
    const { apiKey } = await inquirer.prompt([
      { name: 'apiKey', message: 'Enter your OpenAI API key:' },
    ]);

    // Get changes from git
    const diff = execSync('git diff --staged', { encoding: 'utf8' });
    const commitMessage = await aiCommitMessage(diff, apiKey);

    console.log('AI-Generated Commit Message:', commitMessage);

    // Ask to run the commit
    const { confirmCommit } = await inquirer.prompt([
      { type: 'confirm', name: 'confirmCommit', message: 'Commit with this message?' },
    ]);

    if (confirmCommit) {
      git.commit(commitMessage);
      console.log('Committed successfully!');
    }
  }
}

runCommitFlow();

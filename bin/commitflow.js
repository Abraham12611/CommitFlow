#!/usr/bin/env node

// Import necessary modules
const simpleGit = require('simple-git');
const inquirer = require('inquirer');
const { generateCommitMessage } = require('../lib/generateMessage');

// Initialize simple-git instance
const git = simpleGit();

// Function to check if we're in a Git repository
async function checkIfGitRepo() {
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.error('Error: You are not in a Git repository.');
    process.exit(1);
  }
}

// Function to ask the user for commit details
async function askCommitDetails() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'What type of change are you committing?',
      choices: ['feat', 'fix', 'docs', 'chore', 'refactor', 'test', 'style'],
    },
    {
      type: 'input',
      name: 'scope',
      message: 'What is the scope of this change? (e.g., UI, API)',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Write a short description of the change:',
      validate: (input) => input ? true : 'Description cannot be empty.',
    },
    {
      type: 'input',
      name: 'issue',
      message: 'Optional: Add any issue or ticket number (e.g., #123):',
    },
  ]);
  return answers;
}

// Main function to handle commit generation
async function run() {
  await checkIfGitRepo();

  const commitDetails = await askCommitDetails();
  const commitMessage = generateCommitMessage(commitDetails);

  console.log('\nGenerated Commit Message:\n');
  console.log(commitMessage);

  const { confirmCommit } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmCommit',
      message: 'Do you want to use this commit message?',
    },
  ]);

  if (confirmCommit) {
    await git.commit(commitMessage);
    console.log('Commit successful!');
  } else {
    console.log('Commit aborted.');
  }
}

// Run the main function
run();

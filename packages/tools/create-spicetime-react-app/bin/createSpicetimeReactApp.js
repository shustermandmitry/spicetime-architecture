#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const prompts = require('prompts');
const { execSync } = require('child_process');

async function run() {
  const appName = process.argv[2];
  
  if (!appName) {
    console.error(chalk.red('Please provide a project name'));
    process.exit(1);
  }

  const appPath = path.resolve(process.cwd(), appName);
  const templatePath = path.resolve(__dirname, '../template');

  try {
    // Confirm if directory exists
    if (fs.existsSync(appPath)) {
      const response = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: 'Directory exists. Overwrite?',
        initial: false
      });

      if (!response.overwrite) {
        process.exit(1);
      }
      fs.removeSync(appPath);
    }

    // Copy template
    console.log(chalk.blue('Creating project structure...'));
    fs.copySync(templatePath, appPath);
    
    // Update package.json
    const packageJsonPath = path.join(appPath, 'package.json');
    const packageJson = require(packageJsonPath);
    packageJson.name = appName;
    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

    // Install dependencies
    console.log(chalk.blue('Installing dependencies...'));
    process.chdir(appPath);
    execSync('npm install', { stdio: 'inherit' });

    console.log(chalk.green('\nProject created successfully!'));
    console.log(chalk.blue('\nNext steps:'));
    console.log(`  cd ${appName}`);
    console.log('  npm start');
    
  } catch (err) {
    console.error(chalk.red('Error creating project:'), err);
    process.exit(1);
  }
}

run();
const fs = require('fs');
const path = require('path');
const prompts = require('prompts');

// Paths
const rootDir = process.cwd();
const templatesDir = path.join(rootDir, 'templates');
const scaffoldDir = path.join(rootDir, 'scaffolded-projects');

// Helper Functions
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFileSync(filePath, content) {
  ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

// CLI Commands
async function scaffoldProject() {
  const templateChoices = fs.readdirSync(templatesDir).map((name) => ({
    title: name,
    value: name,
  }));

  const { template } = await prompts({
    type: 'select',
    name: 'template',
    message: 'Select a template to scaffold from:',
    choices: templateChoices,
  });

  const { projectName } = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'Enter the name for your new project:',
  });

  if (!template || !projectName) {
    console.log('⚠️ Scaffolding cancelled.');
    return;
  }

  const templatePath = path.join(templatesDir, template);
  const destinationPath = path.join(scaffoldDir, projectName);

  copyTemplate(templatePath, destinationPath);
  console.log(`🎉 Project "${projectName}" scaffolded successfully at ${destinationPath}`);
}

function copyTemplate(templatePath, destinationPath) {
  ensureDirSync(destinationPath);

  fs.readdirSync(templatePath).forEach((file) => {
    const templateFilePath = path.join(templatePath, file);
    const destinationFilePath = path.join(destinationPath, file);

    if (fs.statSync(templateFilePath).isDirectory()) {
      copyTemplate(templateFilePath, destinationFilePath);
    } else {
      writeFileSync(destinationFilePath, fs.readFileSync(templateFilePath, 'utf8'));
    }
  });
}

async function addTemplateFile() {
  const templateChoices = fs.readdirSync(templatesDir).map((name) => ({
    title: name,
    value: name,
  }));

  const { template } = await prompts({
    type: 'select',
    name: 'template',
    message: 'Select which template to add a file to:',
    choices: templateChoices,
  });

  if (!template) {
    console.log('⚠️ Operation cancelled.');
    return;
  }

  const { filePath, content } = await prompts([
    {
      type: 'text',
      name: 'filePath',
      message: 'Enter the relative path for the new file within the template (e.g., src/new-file.ts):',
    },
    {
      type: 'text',
      name: 'content',
      message: 'Enter the initial content for the new file:',
    },
  ]);

  if (!filePath) {
    console.log('⚠️ Operation cancelled.');
    return;
  }

  const fullPath = path.join(templatesDir, template, filePath);
  writeFileSync(fullPath, content);
  console.log(`✨ File added successfully at "${fullPath}"`);
}

async function updateTemplateFile() {
  const templateChoices = fs.readdirSync(templatesDir).map((name) => ({
    title: name,
    value: name,
  }));

  const { template } = await prompts({
    type: 'select',
    name: 'template',
    message: 'Select which template to update a file in:',
    choices: templateChoices,
  });

  if (!template) {
    console.log('⚠️ Operation cancelled.');
    return;
  }

  // Find all files in the template
  const getAllFiles = (dirPath, fileList = []) => {
    fs.readdirSync(dirPath).forEach((file) => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    });
    return fileList;
  };

  const files = getAllFiles(path.join(templatesDir, template)).map((file) => ({
    title: file.replace(path.join(templatesDir, template) + path.sep, ''),
    value: file,
  }));

  const { file } = await prompts({
    type: 'select',
    name: 'file',
    message: 'Select the file to update:',
    choices: files,
  });

  const { content } = await prompts({
    type: 'text',
    name: 'content',
    message: 'Enter the updated content for the file:',
  });

  if (!file) {
    console.log('⚠️ Operation cancelled.');
    return;
  }

  writeFileSync(file, content);
  console.log(`✅ File "${file}" updated successfully.`);
}

async function removeTemplateFile() {
  const templateChoices = fs.readdirSync(templatesDir).map((name) => ({
    title: name,
    value: name,
  }));

  const { template } = await prompts({
    type: 'select',
    name: 'template',
    message: 'Select which template to remove a file from:',
    choices: templateChoices,
  });

  if (!template) {
    console.log('⚠️ Operation cancelled.');
    return;
  }

  const files = fs
    .readdirSync(path.join(templatesDir, template))
    .map((file) => ({ title: file, value: file }));

  const { file } = await prompts({
    type: 'select',
    name: 'file',
    message: 'Select the file to remove:',
    choices: files,
  });

  if (!file) {
    console.log('⚠️ Operation cancelled.');
    return;
  }

  const filePath = path.join(templatesDir, template, file);
  fs.unlinkSync(filePath);
  console.log(`❌ File "${file}" removed successfully.`);
}

// Main Menu
(async function main() {
  const { command } = await prompts({
    type: 'select',
    name: 'command',
    message: 'What do you want to do?',
    choices: [
      { title: 'Scaffold a new project', value: 'scaffold' },
      { title: 'Add a new file to a template', value: 'add-template' },
      { title: 'Update an existing file in a template', value: 'update-template' },
      { title: 'Remove a file from a template', value: 'remove-template' },
      { title: 'Exit', value: 'exit' },
    ],
  });

  switch (command) {
    case 'scaffold':
      await scaffoldProject();
      break;
    case 'add-template':
      await addTemplateFile();
      break;
    case 'update-template':
      await updateTemplateFile();
      break;
    case 'remove-template':
      await removeTemplateFile();
      break;
    default:
      console.log('Goodbye!');
      process.exit(0);
  }
})();
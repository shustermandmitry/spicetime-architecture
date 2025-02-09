#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')
const readline = require('readline')

const PATCH_DIR = 'patches'
const HISTORY_FILE = path.join(PATCH_DIR, 'history.json')
const VALID_COMMANDS = ['INSERT', 'DELETE', 'UPSERT', 'REVERT']
const COMMAND_START_REGEX = /\/\* COMMAND (\w+) PATH ([^\s]+) \*\//
const COMMAND_END_REGEX = /\/\* COMMAND (\w+) END\*\//

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

async function ensurePatchDir() {
  await fs.mkdir(PATCH_DIR, { recursive: true })
  try {
    await fs.access(HISTORY_FILE)
  } catch {
    await fs.writeFile(HISTORY_FILE, '[]')
  }
}

async function readPatchFile(patchFile) {
  let content = await fs.readFile(patchFile, 'utf8')
  let lines = content.split('\n')
  let commands = []
  let currentCommand = null
  let contentBuffer = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Check for command start
    let startMatch = line.match(COMMAND_START_REGEX)
    if (startMatch) {
      if (currentCommand) {
        throw { message: 'Nested command detected', line: i + 1 }
      }
      let [, command, filePath] = startMatch
      if (VALID_COMMANDS.includes(command)) {
        currentCommand = { command, filePath, content: '', startLine: i + 1 }
      }
      continue
    }

    // Check for command end
    let endMatch = line.match(COMMAND_END_REGEX)
    if (endMatch) {
      if (!currentCommand) {
        throw { message: 'End command without start', line: i + 1 }
      }
      let [, command] = endMatch
      if (command !== currentCommand.command) {
        throw {
          message: `Command mismatch: started with ${currentCommand.command}, ended with ${command}`,
          line: i + 1,
        }
      }
      currentCommand.content = contentBuffer.join('\n')
      commands.push(currentCommand)
      currentCommand = null
      contentBuffer = []
      continue
    }

    // Collect content between command markers
    if (currentCommand) {
      contentBuffer.push(line)
    }
  }

  if (currentCommand) {
    throw {
      message: `Unclosed command: ${currentCommand.command}`,
      line: currentCommand.startLine,
    }
  }

  return commands
}

async function processCommand(command) {
  const { command: type, filePath, content } = command
  const absolutePath = path.resolve(filePath)

  let previousContent
  try {
    previousContent = await fs.readFile(absolutePath, 'utf8')
  } catch {
  }

  switch (type) {
    case 'INSERT':
    case 'UPSERT':
      await fs.mkdir(path.dirname(absolutePath), { recursive: true })
      await fs.writeFile(absolutePath, content)
      break
    case 'DELETE':
      try {
        await fs.unlink(absolutePath)
      } catch (e) {
        if (e.code !== 'ENOENT') throw e
      }
      break
    case 'REVERT':
      const steps = parseInt(content) || 1
      await revertPatches(steps)
      break
  }

  return {
    type,
    path: absolutePath,
    previousContent,
  }
}

async function commitChanges(operations, patchFile) {
  const files = operations.map(op => op.path)

  // Stage only affected files
  for (const file of files) {
    execSync(`git add "${file}"`)
  }

  // Generate default commit message
  let defaultMessage = `patch: ${path.basename(patchFile)}\n\n`
  defaultMessage += operations.map(op =>
    `${op.type}: ${op.path}`,
  ).join('\n')

  // Ask for commit message
  const useDefault = await question('Use default commit message? (Y/n) ')
  let commitMessage = defaultMessage

  if (useDefault.toLowerCase() === 'n') {
    commitMessage = await question('Enter commit message: ')
  }

  // Commit changes
  execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`)
}

async function processPatchFile(patchFile) {
  try {
    const commands = await readPatchFile(patchFile)
    const operations = []

    for (const command of commands) {
      console.log(`Processing ${command.command}: ${command.filePath}`)
      const result = await processCommand(command)
      operations.push(result)
    }

    // Record in history
    const history = JSON.parse(await fs.readFile(HISTORY_FILE, 'utf8'))
    history.unshift({
      timestamp: Date.now(),
      patchFile,
      operations,
    })
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2))

    // Commit changes
    await commitChanges(operations, patchFile)

    // Delete patch file only after successful processing
    await fs.unlink(patchFile)
    console.log('Patch processed successfully')
  } catch (error) {
    if (error.line) {
      console.error(`Error at line ${error.line}: ${error.message}`)
    } else {
      console.error('Error processing patch:', error)
    }
    process.exit(1)
  } finally {
    rl.close()
  }
}

async function main() {
  if (process.argv.length < 3) {
    console.error('Please provide a patch file')
    process.exit(1)
  }

  const patchFile = process.argv[2]
  await ensurePatchDir()
  await processPatchFile(patchFile)
}

main().catch(console.error)
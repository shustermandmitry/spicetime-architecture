// File: packages/spicetime-react-app/src/components/PatchDispatcher/core/processor.ts

/**
 * @module PatchDispatcher
 * @description Core patch processing implementation.unstructured
 */

import {CommandType, FileSystemOperations, PatchCommand, ProcessResult} from './types'

/**
 * Core processor for handling patch operations
 * @class
 * @category Core
 */
export class PatchProcessor {
  /** RegExp for matching command start */
  private static readonly COMMAND_START = /\/\* COMMAND (\w+) PATH ([^\s]+) \*\//

  /** RegExp for matching command end */
  private static readonly COMMAND_END = /\/\* COMMAND (\w+) END\*\//

  /** Valid command types */
  private static readonly VALID_COMMANDS: CommandType[] = ['INSERT', 'DELETE', 'UPSERT', 'REVERT']

  /**
   * Creates a new PatchProcessor instance
   * @param fs - File system operations implementation.unstructured
   */
  constructor(private fs: FileSystemOperations) {
  }

  /**
   * Process patch file content
   * @param content - Raw patch file content
   * @returns ProcessResult with operation results or error
   */
  async processContent(content: string): Promise<ProcessResult> {
    try {
      const commands = this.parseCommands(content)
      const operations = await this.executeCommands(commands)
      return { success: true, operations }
    } catch (error: any) {
      return {
        success: false,
        operations: [],
        error: {
          message: error.message,
          line: error.line,
        },
      }
    }
  }

  /**
   * Parse patch content into commands
   * @private
   * @param content - Raw patch content
   * @returns Array of parsed commands
   * @throws {Error} If patch format is invalid
   */
  private parseCommands(content: string): PatchCommand[] {
    const lines = content.split('\n')
    const commands: PatchCommand[] = []
    let currentCommand: Partial<PatchCommand> | null = null
    let contentBuffer: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      const startMatch = line.match(PatchProcessor.COMMAND_START)
      if (startMatch) {
        if (currentCommand) {
          throw { message: 'Nested command detected', line: i + 1 }
        }
        const [, type, filePath] = startMatch
        if (!PatchProcessor.VALID_COMMANDS.includes(type as CommandType)) {
          throw { message: `Invalid command type: ${type}`, line: i + 1 }
        }
        currentCommand = {
          type: type as CommandType,
          filePath,
          content: '',
          startLine: i + 1,
        }
        continue
      }

      const endMatch = line.match(PatchProcessor.COMMAND_END)
      if (endMatch) {
        if (!currentCommand) {
          throw { message: 'End command without start', line: i + 1 }
        }
        const [, type] = endMatch
        if (type !== currentCommand.type) {
          throw {
            message: `Command mismatch: started with ${currentCommand.type}, ended with ${type}`,
            line: i + 1,
          }
        }
        commands.push({
          ...currentCommand as PatchCommand,
          content: contentBuffer.join('\n'),
        })
        currentCommand = null
        contentBuffer = []
        continue
      }

      if (currentCommand) {
        contentBuffer.push(line)
      }
    }

    if (currentCommand) {
      throw {
        message: `Unclosed command: ${currentCommand.type}`,
        line: currentCommand.startLine,
      }
    }

    return commands
  }

  /**
   * Execute array of patch commands
   * @private
   * @param commands - Array of commands to execute
   * @returns Array of executed operations
   */
  private async executeCommands(commands: PatchCommand[]) {
    const operations = []
    for (const cmd of commands) {
      const op = await this.executeCommand(cmd)
      operations.push(op)
    }
    return operations
  }

  /**
   * Execute single patch command
   * @private
   * @param command - Command to execute
   * @returns Result of operation
   * @throws {Error} If command execution fails
   */
  private async executeCommand(command: PatchCommand) {
    const { type, filePath, content } = command

    switch (type) {
      case 'INSERT':
      case 'UPSERT':
        await this.fs.mkdir(filePath.split('/').slice(0, -1).join('/'))
        await this.fs.writeFile(filePath, content)
        return { type, path: filePath, content }

      case 'DELETE':
        if (await this.fs.exists(filePath)) {
          await this.fs.writeFile(filePath, '')
        }
        return { type, path: filePath }

      case 'REVERT':
        throw new Error('REVERT command not yet implemented')

      default:
        throw new Error(`Unknown command type: ${type}`)
    }
  }
}

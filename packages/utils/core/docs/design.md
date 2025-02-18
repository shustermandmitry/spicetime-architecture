# Error Utility Design Document

## Overview

The Error utility provides a robust, minimal-dependency error handling system for monorepo projects. It extends the native Error class with additional capabilities for location tracking, error information enrichment, and custom error type creation.

## Core Design Principles

1. **Minimal Dependencies**
   - Uses `find-up` for location resolution
   - No other external dependencies
   - Built on Node.js standard library

2. **Self-Contained Operation**
   - Automatic location resolution
   - Built-in error info enrichment
   - Standalone custom error factory

3. **Type Safety**
   - Full TypeScript support
   - Comprehensive type definitions
   - Internal type consistency

## Architecture

### Core Components

1. **Error Class**
   - Extends native Error
   - Adds error info structure
   - Provides location resolution
   - Supports error chaining

2. **Location Resolution**
   - Uses find-up for path detection
   - Resolves package.json location
   - Identifies STA root if present
   - Falls back to process.cwd()

3. **Error Information**
   - Structured error context
   - Location tracking
   - Extended info support
   - Type identification

### Type System

1. **Public Types**
   ```typescript
   interface Location {
     packagePath: string;
     staRootPath: string | null;
   }

   interface ErrorInfo {
     errorType: string;
     message: string;
     location: Location;
     extInfo: unknown | null;
   }
   ```

2. **Internal Types**
   ```typescript
   interface ErrorConstructor {
     new(message: string, extInfo?: unknown): Error;
     createCustomError(errorType: string): ErrorConstructor;
   }

   interface ErrorStatic {
     createCustomError(errorType: string): ErrorConstructor;
   }
   ```

## Implementation Details

### Error Creation Flow

1. **Base Error**
   ```typescript
   new Error("Operation failed")
   ```
   - Creates error instance
   - Resolves location
   - Builds error info
   - Attaches to instance

2. **Custom Error**
   ```typescript
   const ValidationError = Error.createCustomError('ValidationError')
   new ValidationError("Invalid input", { fields: ['email'] })
   ```
   - Creates custom constructor
   - Inherits base behavior
   - Adds custom type info
   - Supports extended info

### Location Resolution

1. **Resolution Process**
   ```typescript
   private resolveLocation(): Location {
     // Find nearest package.json
     const packagePath = findUpSync('package.json') || process.cwd();
     
     // Find STA root if exists
     const staRootPath = findUpSync('sta.json');
     
     return { packagePath, staRootPath };
   }
   ```

### Error Info Building

1. **Info Construction**
   ```typescript
   private buildErrorInfo(message: string, extInfo?: unknown): ErrorInfo {
     return {
       errorType: this.name,
       message,
       location: this.resolveLocation(),
       extInfo: extInfo || null
     };
   }
   ```

## Extended Features

1. **Circular Reference Handling**
   - Safe JSON serialization
   - Reference preservation
   - Circular structure detection

2. **Non-serializable Data**
   - Function handling
   - Symbol preservation
   - Safe stringification

3. **Error Chaining**
   - Nested error support
   - Context preservation
   - Stack trace maintenance

## Safety Considerations

1. **Error Recovery**
   - Graceful location fallbacks
   - Safe error info building
   - Protected factory methods

2. **Type Safety**
   - Runtime type checking
   - Safe type casting
   - Protected internals

## Testing Strategy

1. **Core Functionality**
   - Error creation
   - Info building
   - Location resolution

2. **Custom Errors**
   - Factory operation
   - Inheritance chain
   - Type preservation

3. **Safety Features**
   - Circular references
   - Non-serializable data
   - Error chaining

## Future Considerations

1. **Potential Enhancements**
   - Stack trace enrichment
   - Error categorization
   - Error event system

2. **Maintenance**
   - Type system updates
   - Dependency monitoring
   - Performance optimization
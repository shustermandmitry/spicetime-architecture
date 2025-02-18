class STError extends Error {
  public info: ErrorInfo;

  constructor(message: string, extInfo?: unknown) {
    super(message);
    // Don't set name in base class - let derived classes handle it
    this.name = this.constructor.name;
    this.info = this.buildErrorInfo(message, extInfo);
  }

  private buildErrorInfo(message: string, extInfo?: unknown): ErrorInfo {
    return {
      errorType: this.name,
      message,
      location: this.resolveLocation(),
      extInfo: extInfo || null
    };
  }

  private resolveLocation(): Location {
    try {
      // Simple sync file checks instead of using fs
      const packagePath = process.cwd(); // Fallback default
      const staRootPath = null; // Simplified for now
      
      return { packagePath, staRootPath };
    } catch {
      return {
        packagePath: process.cwd(),
        staRootPath: null
      };
    }
  }

  static createCustomError(errorType: string): typeof STError {
    return class CustomError extends STError {
      constructor(message: string, extInfo?: unknown) {
        super(message, extInfo);
        this.name = errorType; // Set custom name after super()
      }
    };
  }
}

interface ErrorInfo {
  errorType: string;
  message: string;
  location: Location;
  extInfo: unknown | null;
}

interface Location {
  packagePath: string;
  staRootPath: string | null;
}

export { STError, type ErrorInfo, type Location };

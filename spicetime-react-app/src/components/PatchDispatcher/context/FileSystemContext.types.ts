// Defines the operations that the FileSystemContext will provide
export interface FileSystemOperations {
    mkdir: (path: string) => Promise<void>;
}

// Defines the overall shape of the FileSystemContext
export interface FileSystemContextType {
    operations: FileSystemOperations;
}
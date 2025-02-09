import {FileSystemOperations} from './FileSystemContext.types';

// Mock for FileSystem operations
export const mockFileSystemOperations: FileSystemOperations = {
    mkdir: async (path: string) => {
        // Simulate a delay for asynchronous behavior
        return new Promise((resolve) => {
            console.log(`[Mock] Created directory at: ${path}`);
            setTimeout(() => resolve(), 500);
        });
    },
};
import {createContext, ReactNode, useContext} from 'react';

// Interface for File System Operations
export interface FileSystemOperations {
    mkdir: (path: string) => Promise<void>;
}

// Default implementation for file system operations
const defaultOperations: FileSystemOperations = {
    mkdir: async (path: string) => {
        console.log(`Created directory: ${path}`);
    },
};

// Creating the React context with default operations
export const FileSystemContext = createContext<FileSystemOperations>(defaultOperations);

// Custom hook to consume the FileSystemContext
export const useFileSystem = (): FileSystemOperations => {
    const context = useContext(FileSystemContext);
  if (!context) {
      throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
    return context;
};

// Props for the provider
interface FileSystemProviderProps {
    children: ReactNode;
}

// FileSystemProvider Component
export const FileSystemProvider: JSX.Element = ({children: ReactNode}) => {
    return (
        <FileSystemContext.Provider value = {defaultOperations} >
            {children}
            < /FileSystemContext.Provider>
    );
};
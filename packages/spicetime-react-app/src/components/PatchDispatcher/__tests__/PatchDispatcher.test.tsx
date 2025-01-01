/**
 * @module PatchDispatcher
 * @description Tests for PatchDispatcher component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { FileSystemContext } from '../context';
import { PatchDispatcher } from '../PatchDispatcher';
import { ACTIVE_PATCHES, PROCESS_PATCH } from '../graphql';

const mockFileSystem = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
  exists: jest.fn(),
  mkdir: jest.fn()
};

const mockPatches = [
  {
    id: 'test-1',
    timestamp: Date.now(),
    status: 'pending',
    patches: [
      {
        targetPath: '/test/file.txt',
        content: 'test content'
      }
    ]
  }
];

const mocks = [
  {
    request: {
      query: ACTIVE_PATCHES
    },
    result: {
      data: {
        activePatches: mockPatches
      }
    }
  },
  {
    request: {
      query: PROCESS_PATCH,
      variables: { id: 'test.patch.txt', content: 'test content' }
    },
    result: {
      data: {
        processPatch: { success: true, message: 'Processed' }
      }
    }
  }
];

describe('PatchDispatcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FileSystemContext.Provider value={mockFileSystem}>
          <PatchDispatcher />
        </FileSystemContext.Provider>
      </MockedProvider>
    );
    
    expect(screen.getByText('Patch Dispatcher')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FileSystemContext.Provider value={mockFileSystem}>
          <PatchDispatcher />
        </FileSystemContext.Provider>
      </MockedProvider>
    );

    expect(screen.getByText('Loading patches...')).toBeInTheDocument();
  });

  it('handles file drops correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FileSystemContext.Provider value={mockFileSystem}>
          <PatchDispatcher />
        </FileSystemContext.Provider>
      </MockedProvider>
    );

    const file = new File(['test content'], 'test.patch.txt', { type: 'text/plain' });
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve('test content')
    });

    const dropzone = await screen.findByText(/drag and drop/i);
    fireEvent.dragOver(dropzone);
    expect(screen.getByText('Drop files here')).toBeInTheDocument();

    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] }
    });

    await waitFor(() => {
      // Verify mutation was called
      expect(mocks[1].request.variables).toEqual({
        id: 'test.patch.txt',
        content: 'test content'
      });
    });
  });

  it('renders patches list correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FileSystemContext.Provider value={mockFileSystem}>
          <PatchDispatcher />
        </FileSystemContext.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('ID: test-1')).toBeInTheDocument();
      expect(screen.getByText('/test/file.txt')).toBeInTheDocument();
    });
  });

  it('throws error when used outside FileSystemContext', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <PatchDispatcher />
        </MockedProvider>
      );
    }).toThrow('PatchDispatcher must be used within a FileSystemContext provider');

    consoleError.mockRestore();
  });
});
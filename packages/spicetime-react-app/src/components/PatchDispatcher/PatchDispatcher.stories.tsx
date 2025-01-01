/**
 * @module PatchDispatcher
 * @description Storybook stories for PatchDispatcher component
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import { PatchDispatcher } from './PatchDispatcher';
import { FileSystemContext } from './context';
import { ACTIVE_PATCHES } from './graphql';

const mockFileSystem = {
  readFile: async () => 'test content',
  writeFile: async () => {},
  exists: async () => true,
  mkdir: async () => {}
};

const mockPatches = [
  {
    id: 'example-1',
    timestamp: Date.now(),
    status: 'completed',
    patches: [
      {
        targetPath: '/src/example.ts',
        content: 'console.log("Hello");'
      }
    ]
  },
  {
    id: 'example-2',
    timestamp: Date.now(),
    status: 'pending',
    patches: [
      {
        targetPath: '/src/test.ts',
        content: 'export const test = true;'
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
  }
];

const meta: Meta<typeof PatchDispatcher> = {
  title: 'Components/PatchDispatcher',
  component: PatchDispatcher,
  decorators: [
    (Story) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        <FileSystemContext.Provider value={mockFileSystem}>
          <div className="p-6 max-w-3xl mx-auto">
            <Story />
          </div>
        </FileSystemContext.Provider>
      </MockedProvider>
    )
  ],
  parameters: {
    docs: {
      description: {
        component: 'Component for handling patch file operations in the SpiceTime development environment.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof PatchDispatcher>;

export const Default: Story = {
  args: {
    dropzoneLabel: 'Drop patch files here'
  }
};

export const CustomStyling: Story = {
  args: {
    className: 'bg-gray-100 p-8 rounded-xl shadow-lg',
    dropzoneLabel: 'Custom drop zone label'
  }
};

export const Loading: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[]} addTypename={false}>
        <FileSystemContext.Provider value={mockFileSystem}>
          <div className="p-6">
            <Story />
          </div>
        </FileSystemContext.Provider>
      </MockedProvider>
    )
  ]
};

export const Error: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={[{
        request: { query: ACTIVE_PATCHES },
        error: new Error('Failed to load patches')
      }]} addTypename={false}>
        <FileSystemContext.Provider value={mockFileSystem}>
          <div className="p-6">
            <Story />
          </div>
        </FileSystemContext.Provider>
      </MockedProvider>
    )
  ]
};

// File: packages/spicetime-react-app/src/components/PatchDispatcher/PatchDispatcher.stories.tsx

import type {Meta, StoryObj} from '@storybook/react';
import {PatchDispatcher} from './PatchDispatcher';
import {FileSystemContext} from './context/FileSystemContext';

const mockFs = {
  readFile: async () => '',
  writeFile: async () => {},
  exists: async () => true,
  mkdir: async () => {}
};

const meta: Meta<typeof PatchDispatcher> = {
  title: 'Components/PatchDispatcher',
  component: PatchDispatcher,
  decorators: [
    (Story) => (
      <FileSystemContext.Provider value={mockFs}>
        <div style={{ padding: '2rem' }}>
          <Story />
        </div>
      </FileSystemContext.Provider>
    )
  ],
  parameters: {
    docs: {
      description: {
        component: 'Component for handling patch file operations in SpiceTime'
      }
    }
  },
  argTypes: {
    onPatchComplete: { action: 'patch complete' },
    onError: { action: 'error' }
  }
};

export default meta;
type Story = StoryObj<typeof PatchDispatcher>;

export const Default: Story = {
  args: {
    className: 'p-4 border rounded'
  }
};

export const WithCustomStyles: Story = {
  args: {
    className: 'p-8 bg-gray-100 border-2 border-dashed rounded-xl'
  }
};

export const Processing: Story = {
  args: {
    className: 'p-4 border rounded'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows processing state when handling patch files'
      }
    }
  }
};
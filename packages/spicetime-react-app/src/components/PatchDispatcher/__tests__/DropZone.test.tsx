/**
 * @module PatchDispatcher
 * @description Tests for DropZone component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropZone } from '../DropZone';

describe('DropZone', () => {
  const onDrop = jest.fn();
  const label = 'Drop files here';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct label', () => {
    render(<DropZone onDrop={onDrop} label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('handles drag over event', () => {
    render(<DropZone onDrop={onDrop} label={label} />);
    const dropzone = screen.getByText(label);
    
    fireEvent.dragOver(dropzone);
    expect(screen.getByText('Drop files here')).toBeInTheDocument();
  });

  it('handles drag leave event', () => {
    render(<DropZone onDrop={onDrop} label={label} />);
    const dropzone = screen.getByText(label);
    
    fireEvent.dragOver(dropzone);
    fireEvent.dragLeave(dropzone);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('handles file drop', () => {
    render(<DropZone onDrop={onDrop} label={label} />);
    const dropzone = screen.getByText(label);
    
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] }
    });

    expect(onDrop).toHaveBeenCalled();
  });
});
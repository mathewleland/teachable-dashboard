import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';
import { expect, jest } from '@jest/globals';

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Modal',
    children: <div>Test Content</div>,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders nothing when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('renders modal content when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with correct title', () => {
    render(<Modal {...defaultProps} title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders with correct styling classes', () => {
    render(<Modal {...defaultProps} />);
    // Check overlay styling
    expect(screen.getByTestId('modal-overlay')).toHaveClass(
      'fixed',
      'inset-0',
      'bg-black',
      'bg-opacity-50',
      'flex',
      'items-center',
      'justify-center',
      'z-50'
    );

    expect(screen.getByTestId('modal-content')).toHaveClass(
      'bg-white',
      'dark:bg-gray-800',
      'rounded-lg',
      'p-6',
      'max-w-2xl',
      'w-full',
      'mx-4',
      'max-h-[90vh]',
      'overflow-hidden'
    );
  });

  it('renders children content correctly', () => {
    const complexChildren = (
      <div>
        <h3>Complex Content</h3>
        <p>Some paragraph</p>
        <button>Action Button</button>
      </div>
    );

    render(
      <Modal {...defaultProps}>
        {complexChildren}
      </Modal>
    );
    expect(screen.getByText('Complex Content')).toBeInTheDocument();
    expect(screen.getByText('Some paragraph')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('renders close button with correct accessibility', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByRole('button');
    expect(closeButton).toHaveClass(
      'text-gray-500',
      'hover:text-gray-700',
      'dark:text-gray-400',
      'dark:hover:text-gray-200'
    );
  });
});

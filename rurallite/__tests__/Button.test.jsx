/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/Button';

describe('Button Component', () => {
  it('renders button with default label', () => {
    render(<Button />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('renders button with custom label', () => {
    render(<Button label="Submit" />);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} />);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    render(<Button label="Disabled" onClick={handleClick} disabled />);
    
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="danger" />);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500');

    rerender(<Button variant="secondary" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-500');

    rerender(<Button variant="primary" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-500');
  });

  it('applies disabled styles when disabled prop is true', () => {
    render(<Button disabled />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('has correct aria-label', () => {
    const label = 'Save Changes';
    render(<Button label={label} />);
    const button = screen.getByRole('button', { name: label });
    expect(button).toHaveAttribute('aria-label', label);
  });

  it('has data-testid for testing', () => {
    render(<Button />);
    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
  });
});

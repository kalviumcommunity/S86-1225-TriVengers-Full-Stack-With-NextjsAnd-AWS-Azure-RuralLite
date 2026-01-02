'use client';

import React from 'react';

/**
 * Simple Button component for testing
 */
export default function Button({ 
  label = 'Click me', 
  onClick, 
  disabled = false,
  variant = 'primary',
  className = '' 
}) {
  const baseStyles = 'px-4 py-2 rounded font-semibold transition-colors';
  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      data-testid="test-button"
      aria-label={label}
    >
      {label}
    </button>
  );
}

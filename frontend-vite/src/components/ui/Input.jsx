import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ 
  className, 
  type = 'text', 
  error = null, 
  label, 
  helperText, 
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-accent-600 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'form-input',
          error && 'border-accent-600 focus:ring-accent-500',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      {helperText && !error && (
        <p className="text-sm text-secondary-600">{helperText}</p>
      )}
      {error && (
        <p className="form-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };

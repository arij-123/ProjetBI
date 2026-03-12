import React from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = {
  variant: {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline btn-outline-primary',
    ghost: 'btn-outline border-transparent hover:bg-secondary-100',
    link: 'text-primary-600 underline-offset-4 hover:underline',
  },
  size: {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  },
};

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled = false,
  loading = false,
  icon,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        'btn',
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'relative',
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="spinner spinner-md"></div>
        </div>
      )}
      <span className={cn('flex items-center gap-2', loading && 'opacity-0')}>
        {icon && <i className={cn(icon, loading && 'opacity-0')}></i>}
        {children}
      </span>
    </button>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };

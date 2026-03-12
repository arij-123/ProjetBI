import React from 'react';
import { cn } from '../../lib/utils';

const Card = React.forwardRef(({ className, children, hover = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'card',
        hover && 'card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('card-header', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

const CardBody = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('card-body', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('card-footer', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };

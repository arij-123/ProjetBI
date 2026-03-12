import React from 'react';
import { cn } from '../../lib/utils';

const RangeSlider = React.forwardRef(({ 
  className, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  label, 
  unit = '', 
  showValue = true,
  disabled = false,
  color = 'primary',
  ...props 
}, ref) => {
  const colors = {
    primary: 'range-slider-primary',
    secondary: 'range-slider-secondary',
    accent: 'range-slider-accent',
    success: 'range-slider-success',
    warning: 'range-slider-warning',
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <label className="form-label">{label}</label>
          {showValue && (
            <span className="text-sm font-medium text-secondary-700">
              {value}{unit}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className={cn(
            'range-slider',
            colors[color],
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        <div className="flex justify-between text-xs text-secondary-500 mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
});

RangeSlider.displayName = 'RangeSlider';

export { RangeSlider };

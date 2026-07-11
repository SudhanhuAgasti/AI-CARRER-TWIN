/**
 * @file Button.tsx
 * @description Reusable atomic Button component with premium styled variants
 *  */

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    // Base classes
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none';

    // Style variants mapped to Tailwind variables
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 border border-transparent',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent',
      outline: 'border border-border bg-background/50 backdrop-blur-sm text-foreground hover:bg-accent hover:text-accent-foreground',
      ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground border border-transparent',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-transparent',
    };

    // Size mappings
    const sizes = {
      sm: 'h-9 rounded-md px-3.5 text-xs',
      md: 'h-10 rounded-lg px-5 py-2.5 text-sm tracking-wide',
      lg: 'h-11 rounded-xl px-8 text-base tracking-wide',
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <motion.button
        ref={ref as any}
        disabled={disabled || isLoading}
        className={combinedClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        {...(props as any)}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

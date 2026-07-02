/**
 * @file Input.tsx
 * @description Styled form input component supporting labels, prefixes, icons, and error message indicators.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', label, error, icon, disabled, ...props }, ref) => {
    return (
      <div className="w-full text-left">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-muted-foreground flex items-center justify-center pointer-events-none select-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={`w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm text-foreground transition-all duration-200 outline-none
              placeholder:text-muted-foreground/60
              focus:border-primary focus:ring-2 focus:ring-primary/20
              disabled:cursor-not-allowed disabled:opacity-50
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'border-border'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-destructive font-medium tracking-wide">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

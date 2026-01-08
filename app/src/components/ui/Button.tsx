'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ============================================
   BUTTON COMPONENT
   ============================================ */

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'accent' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-[#1E3A5F] hover:bg-[#15293F] text-white',
    'shadow-sm hover:shadow',
    'focus:ring-[#1E3A5F]/20'
  ),
  secondary: cn(
    'bg-gray-100 hover:bg-gray-200 text-gray-600',
    'focus:ring-gray-500/20'
  ),
  danger: cn(
    'bg-red-500 hover:bg-red-600 text-white',
    'shadow-sm hover:shadow',
    'focus:ring-red-500/20'
  ),
  ghost: cn(
    'hover:bg-gray-100 text-gray-500 hover:text-gray-700',
    'focus:ring-gray-500/20'
  ),
  outline: cn(
    'border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600',
    'focus:ring-gray-500/20'
  ),
  accent: cn(
    'bg-[#B5704A] hover:bg-[#9A5D3D] text-white',
    'shadow-sm hover:shadow',
    'focus:ring-[#B5704A]/20'
  ),
  success: cn(
    'bg-emerald-500 hover:bg-emerald-600 text-white',
    'shadow-sm hover:shadow',
    'focus:ring-emerald-500/20'
  )
};

const sizes: Record<ButtonSize, string> = {
  xs: 'px-2 py-0.5 text-[10px] gap-1',
  sm: 'px-2.5 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-xs gap-1.5',
  lg: 'px-4 py-2 text-sm gap-1.5',
  xl: 'px-5 py-2.5 text-sm gap-2'
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    leftIcon,
    rightIcon,
    fullWidth = false,
    children, 
    disabled, 
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium rounded',
          'transition-all duration-150 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Active/hover effects
          'active:scale-[0.99]',
          // Variants and sizes
          variants[variant],
          sizes[size],
          // Full width
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg 
            className="animate-spin h-4 w-4 shrink-0" 
            viewBox="0 0 24 24"
            fill="none"
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
        )}
        {!isLoading && leftIcon && (
          <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/* ============================================
   ICON BUTTON (Square button for icons)
   ============================================ */

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  label: string; // For accessibility
}

const iconButtonSizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-9 h-9'
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', isLoading, label, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded',
          'transition-all duration-150 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95',
          variants[variant],
          iconButtonSizes[size],
          className
        )}
        disabled={disabled || isLoading}
        aria-label={label}
        title={label}
        {...props}
      >
        {isLoading ? (
          <svg 
            className="animate-spin h-5 w-5" 
            viewBox="0 0 24 24"
            fill="none"
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
        ) : (
          children
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

/* ============================================
   BUTTON GROUP
   ============================================ */

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

function ButtonGroup({ children, className }: ButtonGroupProps) {
  return (
    <div className={cn('inline-flex items-center rounded-lg overflow-hidden', className)}>
      {children}
    </div>
  );
}

export { Button, IconButton, ButtonGroup };

'use client';

import { ReactNode, forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/* ============================================
   CARD COMPONENT
   ============================================ */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'elevated' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'default', padding = 'md', hover = false, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-gray-200',
      bordered: 'bg-white border border-gray-200',
      elevated: 'bg-white shadow-sm border border-gray-100',
      ghost: 'bg-transparent'
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-5'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md transition-all duration-200',
          variants[variant],
          paddings[padding],
          hover && 'hover:shadow-md hover:border-gray-300 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/* ============================================
   CARD HEADER
   ============================================ */

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

/* ============================================
   CARD TITLE
   ============================================ */

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, as: Tag = 'h3', ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn('text-sm font-medium text-gray-800 leading-tight', className)}
      {...props}
    >
      {children}
    </Tag>
  )
);

CardTitle.displayName = 'CardTitle';

/* ============================================
   CARD DESCRIPTION
   ============================================ */

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xs text-gray-500', className)}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

/* ============================================
   CARD CONTENT
   ============================================ */

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

/* ============================================
   CARD FOOTER
   ============================================ */

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-3 mt-3 border-t border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

/* ============================================
   STATS CARD (KPI)
   ============================================ */

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  onClick?: () => void;
}

function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendUp,
  variant = 'default',
  className,
  onClick
}: StatsCardProps) {
  const variantStyles = {
    default: {
      bg: 'bg-gray-100',
      iconColor: 'text-gray-500',
      valueColor: 'text-gray-700'
    },
    primary: {
      bg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      valueColor: 'text-blue-600'
    },
    success: {
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      valueColor: 'text-emerald-600'
    },
    warning: {
      bg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      valueColor: 'text-amber-600'
    },
    danger: {
      bg: 'bg-red-50',
      iconColor: 'text-red-500',
      valueColor: 'text-red-600'
    }
  };

  const styles = variantStyles[variant];

  return (
    <Card 
      className={cn('', onClick && 'cursor-pointer', className)} 
      onClick={onClick}
      hover={!!onClick}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', styles.bg)}>
            <div className={cn('[&>svg]:h-5 [&>svg]:w-5', styles.iconColor)}>
              {icon}
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={cn('text-xl font-semibold tabular-nums', styles.valueColor)}>{value}</p>
          <p className="text-xs text-gray-500 truncate">{title}</p>
        </div>
        {trend && (
          <div className={cn(
            'text-xs font-medium px-2 py-0.5 rounded flex-shrink-0',
            trendUp 
              ? 'bg-emerald-50 text-emerald-600' 
              : trendUp === false 
                ? 'bg-red-50 text-red-600'
                : 'bg-gray-100 text-gray-500'
          )}>
            {trend}
          </div>
        )}
      </div>
    </Card>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatsCard };


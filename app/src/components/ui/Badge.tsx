'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { 
  CertificateStatus, 
  Urgency, 
  IncidenciaStatus,
  STATUS_COLORS, 
  URGENCY_COLORS,
  INCIDENCIA_STATUS_COLORS 
} from '@/lib/types';

/* ============================================
   BASE BADGE COMPONENT
   ============================================ */

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent' | 'primary' | 'purple';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  pulse?: boolean;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-600 border-gray-200',
  success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  warning: 'bg-amber-50 text-amber-600 border-amber-100',
  error: 'bg-red-50 text-red-600 border-red-100',
  info: 'bg-blue-50 text-blue-600 border-blue-100',
  accent: 'bg-orange-50 text-orange-600 border-orange-100',
  primary: 'bg-[#1E3A5F] text-white border-[#15293F]',
  purple: 'bg-purple-50 text-purple-600 border-purple-100'
};

const badgeSizes: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[10px] leading-tight',
  sm: 'px-2 py-0.5 text-[11px] leading-tight',
  md: 'px-2.5 py-1 text-xs leading-tight'
};

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'sm',
  icon,
  pulse = false,
  className 
}: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 font-medium rounded-full border transition-all',
      badgeVariants[variant],
      badgeSizes[size],
      pulse && 'animate-pulse',
      className
    )}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

/* ============================================
   STATUS BADGE (Certificate Status)
   ============================================ */

interface StatusBadgeProps {
  status: CertificateStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  
  return (
    <span className={cn(
      'inline-flex items-center justify-center font-medium rounded-full border border-transparent leading-tight',
      colors.bg,
      colors.text,
      size === 'sm' ? 'px-2 py-0.5 text-[11px] min-h-[22px]' : 'px-2.5 py-1 text-xs min-h-[26px]'
    )}>
      {colors.label}
    </span>
  );
}

/* ============================================
   URGENCY BADGE
   ============================================ */

interface UrgencyBadgeProps {
  urgency: Urgency;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export function UrgencyBadge({ urgency, size = 'md', showIcon = true }: UrgencyBadgeProps) {
  const colors = URGENCY_COLORS[urgency];
  
  if (urgency === 'normal') return null;
  
  return (
    <span className={cn(
      'inline-flex items-center justify-center gap-1 font-medium rounded-full animate-pulse leading-tight',
      colors.bg,
      colors.text,
      size === 'sm' ? 'px-2 py-0.5 text-[11px] min-h-[22px]' : 'px-2.5 py-1 text-xs min-h-[26px]'
    )}>
      {showIcon && <span className="text-[10px] leading-none">🔴</span>}
      {colors.label}
    </span>
  );
}

/* ============================================
   INCIDENCIA BADGE
   ============================================ */

interface IncidenciaBadgeProps {
  status: IncidenciaStatus;
  size?: 'sm' | 'md';
}

export function IncidenciaBadge({ status, size = 'md' }: IncidenciaBadgeProps) {
  const colors = INCIDENCIA_STATUS_COLORS[status];
  
  return (
    <span className={cn(
      'inline-flex items-center justify-center font-medium rounded-full leading-tight',
      colors.bg,
      colors.text,
      size === 'sm' ? 'px-2 py-0.5 text-[11px] min-h-[22px]' : 'px-2.5 py-1 text-xs min-h-[26px]'
    )}>
      {colors.label}
    </span>
  );
}

/* ============================================
   COUNT BADGE (Numeric Indicators)
   ============================================ */

interface CountBadgeProps {
  count: number;
  variant?: 'default' | 'warning' | 'danger' | 'success' | 'primary';
  size?: 'sm' | 'md';
  max?: number;
}

export function CountBadge({ count, variant = 'default', size = 'md', max = 99 }: CountBadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-600',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    success: 'bg-emerald-100 text-emerald-700',
    primary: 'bg-[#1E3A5F] text-white'
  };
  
  const sizeClasses = {
    sm: 'min-w-[20px] h-5 px-1.5 text-[11px]',
    md: 'min-w-[24px] h-6 px-2 text-xs'
  };
  
  const displayValue = count > max ? `${max}+` : count;
  
  return (
    <span className={cn(
      'inline-flex items-center justify-center font-semibold rounded-full tabular-nums leading-none',
      variantClasses[variant],
      sizeClasses[size]
    )}>
      {displayValue}
    </span>
  );
}

/* ============================================
   AI BADGE (AI/ML Indicators)
   ============================================ */

interface AIBadgeProps {
  confidence?: number;
  showConfidence?: boolean;
  className?: string;
}

export function AIBadge({ confidence, showConfidence = false, className }: AIBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full min-h-[26px]',
      'bg-gradient-to-r from-purple-50 to-cyan-50 text-purple-600 border border-purple-100/50',
      className
    )}>
      <span className="text-xs leading-none">🤖</span>
      <span>IA</span>
      {showConfidence && confidence !== undefined && (
        <span className="text-purple-500 tabular-nums">
          ({Math.round(confidence * 100)}%)
        </span>
      )}
    </span>
  );
}

/* ============================================
   MOCK BADGE (Development/Demo Indicator)
   ============================================ */

interface MockBadgeProps {
  className?: string;
}

export function MockBadge({ className }: MockBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wider min-h-[20px]',
      'bg-purple-500 text-white',
      className
    )}>
      Mock
    </span>
  );
}

/* ============================================
   DOT BADGE (Simple Status Indicator)
   ============================================ */

interface DotBadgeProps {
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DotBadge({ color = 'gray', pulse = false, size = 'md', className }: DotBadgeProps) {
  const colorClasses = {
    green: 'bg-emerald-500',
    yellow: 'bg-amber-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    gray: 'bg-slate-400'
  };
  
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };
  
  return (
    <span className={cn(
      'inline-block rounded-full',
      colorClasses[color],
      sizeClasses[size],
      pulse && 'animate-pulse',
      className
    )} />
  );
}

/* ============================================
   NOTIFICATION BADGE (With Counter)
   ============================================ */

interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

export function NotificationBadge({ count, max = 9, className }: NotificationBadgeProps) {
  if (count === 0) return null;
  
  const displayValue = count > max ? `${max}+` : count;
  
  return (
    <span className={cn(
      'absolute -top-1 -right-1 flex items-center justify-center',
      'min-w-[18px] h-[18px] px-1 text-[10px] font-semibold tabular-nums',
      'bg-red-500 text-white rounded-full',
      'ring-2 ring-white',
      className
    )}>
      {displayValue}
    </span>
  );
}

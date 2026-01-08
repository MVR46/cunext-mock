'use client';

import { ReactNode, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

/* ============================================
   DRAWER COMPONENT (Slide-in Panel)
   ============================================ */

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full'
};

export function Drawer({ 
  isOpen, 
  onClose, 
  children, 
  side = 'right',
  size = 'lg',
  title,
  description,
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true
}: DrawerProps) {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeOnOutsideClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Drawer Panel */}
      <div className={cn(
        'fixed inset-y-0 flex max-w-full',
        side === 'right' ? 'right-0' : 'left-0'
      )}>
        <div 
          className={cn(
            'w-screen transform transition-transform',
            sizeClasses[size],
            side === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
          )}
        >
          <div className="flex h-full flex-col bg-white shadow-2xl">
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200">
                <div className="flex-1">
                  {title && (
                    <h2 className="text-lg font-semibold text-slate-800">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-slate-500">
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-slate-500" />
                  </button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   DRAWER BODY (Content container)
   ============================================ */

interface DrawerBodyProps {
  children: ReactNode;
  className?: string;
}

export function DrawerBody({ children, className }: DrawerBodyProps) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

/* ============================================
   DRAWER FOOTER (Actions)
   ============================================ */

interface DrawerFooterProps {
  children: ReactNode;
  className?: string;
}

export function DrawerFooter({ children, className }: DrawerFooterProps) {
  return (
    <div className={cn(
      'flex items-center gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50',
      className
    )}>
      {children}
    </div>
  );
}

/* ============================================
   DRAWER SECTION (Grouped content)
   ============================================ */

interface DrawerSectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function DrawerSection({ children, title, className }: DrawerSectionProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-slate-100', className)}>
      {title && (
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}


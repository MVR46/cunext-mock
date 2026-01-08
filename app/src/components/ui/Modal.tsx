'use client';

import { ReactNode, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

/* ============================================
   MODAL COMPONENT
   ============================================ */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]'
};

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true
}: ModalProps) {
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeOnOutsideClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={cn(
            'relative w-full bg-white rounded-2xl shadow-2xl transform transition-all',
            'animate-scale-fade',
            sizeClasses[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || description || showCloseButton) && (
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {title && (
                    <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                  )}
                </div>
                {showCloseButton && (
                  <button 
                    onClick={onClose}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <XMarkIcon className="h-5 w-5 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   MODAL FOOTER (Optional)
   ============================================ */

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn(
      'flex items-center justify-end gap-3 pt-4 mt-4 border-t border-slate-100',
      className
    )}>
      {children}
    </div>
  );
}

/* ============================================
   CONFIRMATION MODAL
   ============================================ */

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  isLoading = false
}: ConfirmModalProps) {
  const variantClasses = {
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    primary: 'bg-[#1E3A5F] hover:bg-[#15293F] text-white'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-slate-500 mb-6">{description}</p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50',
              variantClasses[variant]
            )}
          >
            {isLoading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

'use client';

import { ReactNode } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

/* ============================================
   FILTER CHIP (Single Toggle)
   ============================================ */

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
  className?: string;
}

export function FilterChip({ 
  label, 
  active = false, 
  onClick, 
  onRemove,
  icon,
  count,
  disabled = false,
  className 
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium min-h-[32px]',
        'border transition-all duration-150',
        'focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        active 
          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' 
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
        className
      )}
    >
      {icon && <span className="shrink-0 flex items-center justify-center">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span className={cn(
          'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded text-[11px] font-semibold tabular-nums',
          active 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-100 text-gray-600'
        )}>
          {count}
        </span>
      )}
      {active && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 hover:bg-white/20 rounded transition-colors flex items-center justify-center"
        >
          <XMarkIcon className="h-3.5 w-3.5" />
        </button>
      )}
    </button>
  );
}

/* ============================================
   FILTER CHIP GROUP
   ============================================ */

interface FilterChipGroupProps {
  children: ReactNode;
  className?: string;
  label?: string;
}

export function FilterChipGroup({ children, className, label }: FilterChipGroupProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {label && (
        <span className="text-[11px] text-gray-400 mr-1">{label}</span>
      )}
      {children}
    </div>
  );
}

/* ============================================
   SELECTABLE CHIPS (Radio-style selection)
   ============================================ */

interface SelectableChipOption {
  value: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface SelectableChipsProps {
  options: SelectableChipOption[];
  value?: string;
  onChange: (value: string) => void;
  allowDeselect?: boolean;
  className?: string;
}

export function SelectableChips({ 
  options, 
  value, 
  onChange, 
  allowDeselect = true,
  className 
}: SelectableChipsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => {
            if (allowDeselect && value === option.value) {
              onChange('');
            } else {
              onChange(option.value);
            }
          }}
          className={cn(
            'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium min-h-[36px]',
            'border transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-400',
            value === option.value 
              ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          )}
        >
          {value === option.value && (
            <CheckIcon className="h-4 w-4 shrink-0" />
          )}
          {option.icon && value !== option.value && (
            <span className="shrink-0 flex items-center justify-center">{option.icon}</span>
          )}
          <span>{option.label}</span>
          {option.count !== undefined && (
            <span className={cn(
              'inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-semibold tabular-nums',
              value === option.value 
                ? 'bg-white/20 text-white' 
                : 'bg-slate-100 text-slate-600'
            )}>
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ============================================
   ACTIVE FILTERS DISPLAY
   ============================================ */

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function ActiveFilters({ filters, onRemove, onClearAll, className }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm text-slate-500">Filtros activos:</span>
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
        >
          <span className="text-slate-500">{filter.label}:</span>
          <span className="font-medium">{filter.value}</span>
          <button
            onClick={() => onRemove(filter.key)}
            className="p-0.5 hover:bg-slate-200 rounded-full transition-colors"
          >
            <XMarkIcon className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </span>
      ))}
      {onClearAll && filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-slate-500 hover:text-slate-700 underline"
        >
          Limpiar todo
        </button>
      )}
    </div>
  );
}

/* ============================================
   FILTER CHIPS (AI Search Filters Display)
   ============================================ */

import { useAppStore } from '@/lib/store';
import { STATUS_COLORS, URGENCY_COLORS } from '@/lib/types';

interface FilterChipsProps {
  isAI?: boolean;
  className?: string;
}

export function FilterChips({ isAI = false, className }: FilterChipsProps) {
  const { filters, setFilters } = useAppStore();
  
  const activeFilters: { key: string; label: string; value: string }[] = [];
  
  if (filters.proyecto) {
    activeFilters.push({ key: 'proyecto', label: 'Proyecto', value: filters.proyecto });
  }
  if (filters.po) {
    activeFilters.push({ key: 'po', label: 'PO', value: filters.po });
  }
  if (filters.proveedor) {
    activeFilters.push({ key: 'proveedor', label: 'Proveedor', value: filters.proveedor });
  }
  if (filters.estado) {
    activeFilters.push({ key: 'estado', label: 'Estado', value: STATUS_COLORS[filters.estado].label });
  }
  if (filters.urgencia) {
    activeFilters.push({ key: 'urgencia', label: 'Urgencia', value: URGENCY_COLORS[filters.urgencia].label });
  }
  if (filters.aging_dias) {
    activeFilters.push({ key: 'aging_dias', label: 'Antigüedad', value: `+${filters.aging_dias} días` });
  }
  
  if (activeFilters.length === 0) return null;
  
  const handleRemove = (key: string) => {
    const newFilters = { ...filters };
    delete (newFilters as Record<string, unknown>)[key];
    setFilters(newFilters);
  };
  
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {activeFilters.map((filter) => (
        <span
          key={filter.key}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm',
            isAI 
              ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200'
              : 'bg-slate-100 text-slate-700'
          )}
        >
          <span className={isAI ? 'text-purple-500' : 'text-slate-500'}>{filter.label}:</span>
          <span className="font-medium">{filter.value}</span>
          <button
            onClick={() => handleRemove(filter.key)}
            className="p-0.5 hover:bg-white/50 rounded-full transition-colors"
          >
            <XMarkIcon className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
}

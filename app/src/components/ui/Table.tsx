'use client';

import { ReactNode, forwardRef, HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/* ============================================
   TABLE COMPONENT
   ============================================ */

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
);

Table.displayName = 'Table';

/* ============================================
   TABLE HEADER
   ============================================ */

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={cn('bg-slate-50', className)} {...props}>
      {children}
    </thead>
  )
);

TableHeader.displayName = 'TableHeader';

/* ============================================
   TABLE BODY
   ============================================ */

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    >
      {children}
    </tbody>
  )
);

TableBody.displayName = 'TableBody';

/* ============================================
   TABLE ROW
   ============================================ */

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  clickable?: boolean;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, clickable = false, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-slate-100 transition-colors',
        clickable && 'hover:bg-slate-50 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
);

TableRow.displayName = 'TableRow';

/* ============================================
   TABLE HEAD CELL
   ============================================ */

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | null;
}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sortable, sorted, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-11 px-4 text-left align-middle font-semibold text-slate-600 text-xs uppercase tracking-wider',
        sortable && 'cursor-pointer hover:text-slate-900 select-none',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <span className="text-slate-400">
            {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    </th>
  )
);

TableHead.displayName = 'TableHead';

/* ============================================
   TABLE DATA CELL
   ============================================ */

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('px-4 py-3 align-middle text-slate-700', className)}
      {...props}
    >
      {children}
    </td>
  )
);

TableCell.displayName = 'TableCell';

/* ============================================
   TABLE SKELETON (Loading State)
   ============================================ */

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

function TableSkeleton({ rows = 5, cols = 5 }: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: cols }).map((_, i) => (
            <TableHead key={i}>
              <div className="skeleton h-4 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <div className="skeleton h-4 w-full max-w-[120px]" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/* ============================================
   TABLE EMPTY STATE
   ============================================ */

interface TableEmptyProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  colSpan?: number;
}

function TableEmpty({ 
  icon, 
  title = 'No hay datos', 
  description = 'No se encontraron resultados para mostrar.',
  action,
  colSpan = 5 
}: TableEmptyProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-48 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          {icon && (
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              {icon}
            </div>
          )}
          <p className="text-slate-800 font-medium mb-1">{title}</p>
          <p className="text-sm text-slate-500 mb-4 max-w-sm">{description}</p>
          {action}
        </div>
      </TableCell>
    </TableRow>
  );
}

export { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell,
  TableSkeleton,
  TableEmpty
};


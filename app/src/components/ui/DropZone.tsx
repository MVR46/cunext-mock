'use client';

import { useState, useCallback, ReactNode } from 'react';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

/* ============================================
   DROP ZONE COMPONENT
   ============================================ */

interface DropZoneProps {
  onDrop: (files: File[]) => void;
  accept?: string[];
  multiple?: boolean;
  maxSize?: number; // in MB
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function DropZone({ 
  onDrop, 
  accept = ['.pdf', '.jpg', '.jpeg', '.png'],
  multiple = false,
  maxSize = 10,
  disabled = false,
  className,
  children
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    const maxBytes = maxSize * 1024 * 1024;

    for (const file of files) {
      // Check file type
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = accept.some(ext => 
        ext.startsWith('.') 
          ? fileExt === ext.toLowerCase()
          : file.type.startsWith(ext)
      );

      if (!isValidType) {
        setError(`Tipo de archivo no permitido: ${file.name}`);
        continue;
      }

      // Check file size
      if (file.size > maxBytes) {
        setError(`Archivo demasiado grande: ${file.name} (máx ${maxSize}MB)`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    const filesToProcess = multiple ? droppedFiles : [droppedFiles[0]];
    const validFiles = validateFiles(filesToProcess);

    if (validFiles.length > 0) {
      onDrop(validFiles);
    }
  }, [disabled, multiple, onDrop, accept, maxSize]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const validFiles = validateFiles(selectedFiles);

    if (validFiles.length > 0) {
      onDrop(validFiles);
    }

    // Reset input value so the same file can be selected again
    e.target.value = '';
  };

  const acceptString = accept.join(',');

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { 
        e.preventDefault(); 
        if (!disabled) setIsDragging(true); 
      }}
      onDragLeave={() => setIsDragging(false)}
      className={cn(
        'relative border-2 border-dashed rounded-xl transition-all duration-200',
        isDragging 
          ? 'border-[#1E3A5F] bg-slate-50 scale-[1.01]' 
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50',
        disabled && 'opacity-50 cursor-not-allowed',
        error && 'border-red-300 bg-red-50',
        className
      )}
    >
      <input
        type="file"
        accept={acceptString}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        id="file-upload"
      />
      
      {children || (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <CloudArrowUpIcon className={cn(
            'h-12 w-12 mb-4 transition-colors',
            isDragging ? 'text-[#1E3A5F]' : 'text-slate-400'
          )} />
          <p className="text-lg font-medium text-slate-700 mb-1">
            {isDragging ? 'Suelta el archivo aquí' : 'Arrastra tu archivo aquí'}
          </p>
          <p className="text-sm text-slate-500">
            o <span className="text-[#1E3A5F] hover:underline cursor-pointer">haz clic para seleccionar</span>
          </p>
          <p className="text-xs text-slate-400 mt-3">
            {accept.join(', ')} • Máximo {maxSize}MB
          </p>
        </div>
      )}

      {error && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}
    </div>
  );
}

/* ============================================
   FILE PREVIEW CARD
   ============================================ */

interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
  status?: 'uploading' | 'success' | 'error';
  progress?: number;
  className?: string;
}

export function FilePreview({ file, onRemove, status, progress, className }: FilePreviewProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg',
      status === 'error' && 'border-red-300 bg-red-50',
      status === 'success' && 'border-emerald-300 bg-emerald-50',
      className
    )}>
      {/* Icon / Preview */}
      <div className="flex-shrink-0">
        {status === 'success' ? (
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
          </div>
        ) : isPDF ? (
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <DocumentIcon className="h-6 w-6 text-red-600" />
          </div>
        ) : isImage ? (
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden">
            <img 
              src={URL.createObjectURL(file)} 
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <DocumentIcon className="h-6 w-6 text-slate-600" />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
        
        {/* Progress Bar */}
        {status === 'uploading' && progress !== undefined && (
          <div className="mt-1.5 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1E3A5F] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Remove Button */}
      {onRemove && status !== 'uploading' && (
        <button
          onClick={onRemove}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <XMarkIcon className="h-4 w-4 text-slate-400" />
        </button>
      )}
    </div>
  );
}

/* ============================================
   UPLOAD PROGRESS
   ============================================ */

interface UploadProgressProps {
  filename: string;
  progress: number;
  status?: 'uploading' | 'processing' | 'complete' | 'error';
  className?: string;
}

export function UploadProgress({ filename, progress, status = 'uploading', className }: UploadProgressProps) {
  return (
    <div className={cn('p-4 bg-white border border-slate-200 rounded-lg', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700 truncate">{filename}</span>
        <span className="text-xs text-slate-500">
          {status === 'complete' ? '100%' : `${progress}%`}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full transition-all duration-300 rounded-full',
            status === 'complete' ? 'bg-emerald-500' :
            status === 'error' ? 'bg-red-500' :
            'bg-[#1E3A5F]'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-1.5">
        {status === 'uploading' && 'Subiendo...'}
        {status === 'processing' && 'Procesando documento...'}
        {status === 'complete' && 'Completado'}
        {status === 'error' && 'Error al subir'}
      </p>
    </div>
  );
}


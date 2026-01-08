'use client';

import { ReactNode } from 'react';
import { 
  MagnifyingGlassIcon, 
  DocumentPlusIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { Button } from './Button';
import { useAppStore } from '@/lib/store';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showActions?: boolean;
  icon?: ReactNode;
}

export function EmptyState({ 
  title = 'No se encontraron resultados',
  description = 'No hay certificados que coincidan con tu búsqueda.',
  showActions = true,
  icon
}: EmptyStateProps) {
  const { openUploadModal, openIncidenciaModal, openEmailModal } = useAppStore();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
        {icon || <MagnifyingGlassIcon className="h-10 w-10 text-slate-400" />}
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-center max-w-md mb-8">{description}</p>
      
      {showActions && (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button 
            variant="primary" 
            className="w-full"
            onClick={openUploadModal}
          >
            <DocumentPlusIcon className="h-5 w-5" />
            Subir certificado ahora
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={openIncidenciaModal}
          >
            <ExclamationTriangleIcon className="h-5 w-5" />
            Crear incidencia
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={openEmailModal}
          >
            <EnvelopeIcon className="h-5 w-5" />
            Notificar internamente
          </Button>
        </div>
      )}
    </div>
  );
}

export function EmptyProjectState() {
  const openUploadModal = useAppStore(state => state.openUploadModal);
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center mb-6">
        <DocumentPlusIcon className="h-10 w-10 text-cyan-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        Sin certificados todavía
      </h3>
      <p className="text-slate-500 text-center max-w-md mb-8">
        Este proyecto aún no tiene certificados. Sube el primero para empezar a gestionar la documentación.
      </p>
      
      <Button variant="primary" onClick={openUploadModal}>
        <DocumentPlusIcon className="h-5 w-5" />
        Subir primer certificado
      </Button>
    </div>
  );
}


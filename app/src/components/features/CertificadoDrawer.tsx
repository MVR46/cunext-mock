'use client';

import { useState } from 'react';
import { 
  DocumentIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  ClockIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Drawer, DrawerBody, DrawerFooter, DrawerSection } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { StatusBadge, UrgencyBadge, AIBadge, MockBadge } from '@/components/ui/Badge';
import { Certificate, CertificateStatus, STATUS_COLORS } from '@/lib/types';
import { MOCK_PROJECTS, MOCK_POS } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { formatDate, calculateAging, formatAging, cn } from '@/lib/utils';
import { Timeline } from './Timeline';

interface CertificadoDrawerProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificadoDrawer({ certificate, isOpen, onClose }: CertificadoDrawerProps) {
  const { updateCertificateStatus, updateCertificateUrgency, openIncidenciaModal, openEmailModal } = useAppStore();
  const { showToast } = useToast();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  
  if (!certificate) return null;
  
  const project = MOCK_PROJECTS.find(p => p.id === certificate.proyecto_id);
  const po = MOCK_POS.find(p => p.id === certificate.po_id);
  const aging = calculateAging(certificate.fecha_recepcion);
  
  const handleStatusChange = (newStatus: CertificateStatus) => {
    updateCertificateStatus(certificate.id, newStatus);
    showToast(`Estado actualizado a ${STATUS_COLORS[newStatus].label}`, 'success');
    setShowStatusMenu(false);
  };
  
  const toggleUrgency = () => {
    const newUrgency = certificate.urgencia === 'urgente' ? 'normal' : 'urgente';
    updateCertificateUrgency(certificate.id, newUrgency);
    showToast(newUrgency === 'urgente' ? 'Marcado como urgente' : 'Urgencia eliminada', 'success');
  };
  
  const handleMarkRevisado = () => {
    updateCertificateStatus(certificate.id, 'revisado');
    showToast('Certificado marcado como revisado ✓', 'success');
  };
  
  const handleCreateIncidencia = () => {
    // We'd pass the certificate context to the modal
    openIncidenciaModal();
  };
  
  const handleNotify = () => {
    openEmailModal();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={certificate.nombre_archivo}
      description={`${project?.id || ''} • ${po ? `PO-${po.numero}` : ''}`}
    >
      {/* Status Bar */}
      <DrawerSection className="bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              >
                <StatusBadge status={certificate.estado} size="sm" />
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showStatusMenu && (
                <div className="absolute left-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20 animate-fade-in">
                  {certificate.estado !== 'pendiente_revision' && (
                    <button 
                      onClick={() => handleStatusChange('pendiente_revision')}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      Pendiente revisión
                    </button>
                  )}
                  {certificate.estado !== 'revisado' && (
                    <button 
                      onClick={() => handleStatusChange('revisado')}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      Revisado
                    </button>
                  )}
                  {certificate.estado !== 'incidencia' && (
                    <button 
                      onClick={() => handleStatusChange('incidencia')}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      Incidencia
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Urgency Toggle */}
            <button
              onClick={toggleUrgency}
              className={cn(
                'px-3 py-1.5 rounded-lg border transition-all',
                certificate.urgencia === 'urgente'
                  ? 'bg-red-100 border-red-200 text-red-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {certificate.urgencia === 'urgente' ? '🔴 Urgente' : 'Marcar urgente'}
            </button>
          </div>
          
          <span className={cn(
            'text-sm font-medium',
            aging > 7 ? 'text-red-600' : aging > 3 ? 'text-amber-600' : 'text-slate-500'
          )}>
            Pendiente {formatAging(aging)}
          </span>
        </div>
      </DrawerSection>
      
      {/* PDF Preview */}
      <DrawerSection className="bg-slate-100 border-b-0">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center">
            <div className="text-center">
              <DocumentTextIcon className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Vista previa del documento</p>
              <p className="text-sm text-slate-400 mt-1">{certificate.nombre_archivo}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                leftIcon={<EyeIcon className="h-4 w-4" />}
              >
                Abrir documento
              </Button>
            </div>
          </div>
        </div>
      </DrawerSection>
      
      {/* Metadata */}
      <DrawerSection title="Metadatos">
        <div className="grid grid-cols-2 gap-4">
          <MetadataItem 
            icon={<BuildingOfficeIcon className="h-4 w-4" />}
            label="Proveedor" 
            value={certificate.proveedor} 
          />
          <MetadataItem 
            icon={<DocumentIcon className="h-4 w-4" />}
            label="Nº Albarán" 
            value={certificate.nro_albaran || '-'} 
          />
          <MetadataItem 
            icon={<DocumentTextIcon className="h-4 w-4" />}
            label="Tipo" 
            value={certificate.tipo_documento.charAt(0).toUpperCase() + certificate.tipo_documento.slice(1)} 
          />
          <MetadataItem 
            icon={<CalendarIcon className="h-4 w-4" />}
            label="Fecha recepción" 
            value={formatDate(certificate.fecha_recepcion)} 
          />
        </div>
        
        {/* AI Detection Badge */}
        {certificate.proveedor && (
          <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg mt-4">
            <SparklesIcon className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-purple-700">
              Proveedor detectado: <strong>{certificate.proveedor}</strong>
            </span>
            <MockBadge className="ml-auto" />
          </div>
        )}
        
        {/* Observations if has incidencia */}
        {certificate.estado === 'incidencia' && certificate.observaciones && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Incidencia registrada</p>
                <p className="text-sm text-red-700 mt-1">{certificate.observaciones}</p>
              </div>
            </div>
          </div>
        )}
      </DrawerSection>
      
      {/* Activity Timeline */}
      <DrawerSection title="Actividad">
        <Timeline objectId={certificate.id} objectType="certificado" limit={5} />
      </DrawerSection>
      
      {/* Footer Actions */}
      <DrawerFooter>
        <Button
          variant={certificate.estado === 'revisado' ? 'secondary' : 'success'}
          className="flex-1"
          onClick={handleMarkRevisado}
          disabled={certificate.estado === 'revisado'}
          leftIcon={<CheckCircleIcon className="h-4 w-4" />}
        >
          {certificate.estado === 'revisado' ? 'Ya revisado' : 'Marcar revisado'}
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleCreateIncidencia}
          leftIcon={<ExclamationTriangleIcon className="h-4 w-4" />}
        >
          Incidencia
        </Button>
        <Button
          variant="ghost"
          onClick={handleNotify}
          leftIcon={<EnvelopeIcon className="h-4 w-4" />}
        />
      </DrawerFooter>
    </Drawer>
  );
}

/* ============================================
   METADATA ITEM
   ============================================ */

interface MetadataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetadataItem({ icon, label, value }: MetadataItemProps) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-slate-400 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}


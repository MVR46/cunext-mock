'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  DocumentIcon, 
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Certificate, CertificateStatus, STATUS_COLORS } from '@/lib/types';
import { StatusBadge, UrgencyBadge, CountBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/lib/store';
import { formatDate, calculateAging, formatAging, cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface CertificateCardProps {
  certificate: Certificate;
  showProject?: boolean;
  showPO?: boolean;
  compact?: boolean;
}

export function CertificateCard({ 
  certificate, 
  showProject = false, 
  showPO = true,
  compact = false 
}: CertificateCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [incidenciaComment, setIncidenciaComment] = useState('');
  const [showIncidenciaInput, setShowIncidenciaInput] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  
  const { updateCertificateStatus } = useAppStore();
  const { showToast } = useToast();
  
  const aging = calculateAging(certificate.fecha_recepcion);
  const isOld = certificate.estado === 'pendiente_revision' && aging > 5;
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setShowStatusMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleStatusChange = (newStatus: CertificateStatus) => {
    if (newStatus === 'incidencia') {
      setShowIncidenciaInput(true);
      setShowStatusMenu(false);
      return;
    }
    
    updateCertificateStatus(certificate.id, newStatus);
    showToast(`Estado actualizado a ${STATUS_COLORS[newStatus].label}`, 'success');
    setShowStatusMenu(false);
  };
  
  const handleIncidenciaSubmit = () => {
    if (!incidenciaComment.trim()) {
      showToast('Añade un comentario para la incidencia', 'error');
      return;
    }
    
    updateCertificateStatus(certificate.id, 'incidencia', incidenciaComment);
    showToast('Incidencia registrada', 'success');
    setShowIncidenciaInput(false);
    setIncidenciaComment('');
  };

  const getDocTypeStyles = () => {
    switch (certificate.tipo_documento) {
      case 'certificado':
        return 'bg-blue-100 text-blue-600';
      case 'albaran':
        return 'bg-amber-100 text-amber-600';
      case 'factura':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };
  
  return (
    <Card 
      hover
      className={cn(
        'group h-full flex flex-col',
        certificate.urgencia === 'urgente' && 'ring-1 ring-red-200 border-red-200',
        certificate.estado === 'incidencia' && 'border-red-200',
        isOld && 'border-amber-200'
      )}
    >
      {/* Header Section - Fixed height */}
      <div className="flex items-start gap-3">
        {/* Document Icon */}
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          getDocTypeStyles()
        )}>
          <DocumentIcon className="h-5 w-5" />
        </div>
        
        {/* Title & Provider */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-sm text-slate-800 truncate group-hover:text-[#1E3A5F] transition-colors leading-tight">
                {certificate.nombre_archivo}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{certificate.proveedor}</p>
            </div>
            
            {/* Actions Menu */}
            <div className="relative flex-shrink-0" ref={menuRef}>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <EllipsisVerticalIcon className="h-5 w-5 text-slate-400" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-20 animate-fade-in">
                  <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                    <EyeIcon className="h-4 w-4" />
                    Ver detalles
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                    <PencilIcon className="h-4 w-4" />
                    Editar
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                    <TrashIcon className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Badges Row - Fixed height section */}
      <div className="flex items-center gap-2 mt-3 min-h-[26px]">
        <StatusBadge status={certificate.estado} size="sm" />
        <UrgencyBadge urgency={certificate.urgencia} size="sm" />
        {isOld && (
          <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-amber-100 text-amber-700 rounded-full min-h-[22px]">
            <ClockIcon className="h-3.5 w-3.5" />
            {formatAging(aging)}
          </span>
        )}
      </div>
      
      {/* Metadata - Fixed height section */}
      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 min-h-[20px]">
        <span className="truncate">Recibido: {formatDate(certificate.fecha_recepcion)}</span>
        {showProject && (
          <>
            <span className="text-slate-300 flex-shrink-0">•</span>
            <span className="flex-shrink-0">{certificate.proyecto_id}</span>
          </>
        )}
        {showPO && (
          <>
            <span className="text-slate-300 flex-shrink-0">•</span>
            <span className="flex-shrink-0">{certificate.po_id}</span>
          </>
        )}
      </div>
      
      {/* Expandable Content Section - Grows to fill space */}
      <div className="flex-1 mt-2">
        {/* Observaciones if incidencia */}
        {certificate.estado === 'incidencia' && certificate.observaciones && (
          <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 line-clamp-2">{certificate.observaciones}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Actions Footer - Always at bottom */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        <div className="relative" ref={statusMenuRef}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => { e.stopPropagation(); setShowStatusMenu(!showStatusMenu); }}
          >
            Cambiar estado
          </Button>
          
          {showStatusMenu && (
            <div className="absolute left-0 bottom-full mb-2 w-52 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-20 animate-fade-in">
              {certificate.estado !== 'pendiente_revision' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleStatusChange('pendiente_revision'); }}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                  Pendiente revisión
                </button>
              )}
              {certificate.estado !== 'revisado' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleStatusChange('revisado'); }}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  Revisado
                </button>
              )}
              {certificate.estado !== 'incidencia' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleStatusChange('incidencia'); }}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 flex-shrink-0" />
                  Incidencia
                </button>
              )}
            </div>
          )}
        </div>
        
        {certificate.estado === 'pendiente_revision' && (
          <Button 
            variant="success" 
            size="sm" 
            onClick={(e) => { e.stopPropagation(); handleStatusChange('revisado'); }}
            leftIcon={<CheckCircleIcon className="h-4 w-4" />}
          >
            Marcar revisado
          </Button>
        )}
      </div>
      
      {/* Incidencia Comment Input */}
      {showIncidenciaInput && (
        <div className="mt-3 space-y-2.5 p-3 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-sm font-medium text-red-800">Registrar incidencia</p>
          <textarea
            value={incidenciaComment}
            onChange={(e) => setIncidenciaComment(e.target.value)}
            placeholder="Describe el motivo de la incidencia..."
            className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none bg-white"
            rows={2}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); handleIncidenciaSubmit(); }}>
              Confirmar incidencia
            </Button>
            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setShowIncidenciaInput(false); }}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ============================================
   CERTIFICATE LIST
   ============================================ */

export function CertificateList({ certificates }: { certificates: Certificate[] }) {
  if (certificates.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      {certificates.map((cert, index) => (
        <div 
          key={cert.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <CertificateCard certificate={cert} />
        </div>
      ))}
    </div>
  );
}

/* ============================================
   COMPACT CERTIFICATE ROW
   ============================================ */

interface CompactCertificateRowProps {
  certificate: Certificate;
  onClick?: () => void;
}

export function CompactCertificateRow({ certificate, onClick }: CompactCertificateRowProps) {
  const aging = calculateAging(certificate.fecha_recepcion);
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer',
        'hover:shadow-md hover:border-[#1E3A5F]/30',
        certificate.urgencia === 'urgente' && 'border-red-200 bg-red-50/30'
      )}
    >
      <DocumentIcon className="h-5 w-5 text-slate-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{certificate.nombre_archivo}</p>
        <p className="text-xs text-slate-500">{certificate.proveedor}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <StatusBadge status={certificate.estado} size="sm" />
        {certificate.urgencia === 'urgente' && (
          <span className="text-red-500 text-sm">🔴</span>
        )}
        <ChevronRightIcon className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
}

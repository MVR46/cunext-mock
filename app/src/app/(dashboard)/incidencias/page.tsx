'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ExclamationTriangleIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/lib/store';
import { MOCK_PROJECTS, MOCK_POS, MOCK_CERTIFICATES } from '@/lib/mock-data';
import { IncidenciaBadge, UrgencyBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, StatsCard } from '@/components/ui/Card';
import { SelectableChips } from '@/components/ui/FilterChips';
import { useToast } from '@/components/ui/Toast';
import { formatRelativeTime, cn } from '@/lib/utils';
import { IncidenciaStatus } from '@/lib/types';

export default function IncidenciasPage() {
  const { incidencias, updateIncidenciaStatus, openIncidenciaModal } = useAppStore();
  const { showToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<IncidenciaStatus | ''>('');
  
  const filteredIncidencias = filterStatus === '' 
    ? incidencias 
    : incidencias.filter(i => i.estado === filterStatus);
  
  const getProject = (projectId: string) => MOCK_PROJECTS.find(p => p.id === projectId);
  const getPO = (poId: string) => MOCK_POS.find(p => p.id === poId);
  const getCertificate = (certId?: string) => certId ? MOCK_CERTIFICATES.find(c => c.id === certId) : null;
  
  const handleStatusChange = (id: string, newStatus: IncidenciaStatus) => {
    updateIncidenciaStatus(id, newStatus);
    showToast(`Incidencia ${newStatus === 'cerrada' ? 'cerrada' : 'actualizada'}`, 'success');
  };
  
  const openCount = incidencias.filter(i => i.estado === 'abierta').length;
  const inProgressCount = incidencias.filter(i => i.estado === 'en_curso').length;
  const closedCount = incidencias.filter(i => i.estado === 'cerrada').length;

  const statusOptions = [
    { value: '', label: 'Todas', count: incidencias.length },
    { value: 'abierta', label: 'Abiertas', count: openCount },
    { value: 'en_curso', label: 'En curso', count: inProgressCount },
    { value: 'cerrada', label: 'Cerradas', count: closedCount },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Incidencias</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de problemas y seguimiento</p>
        </div>
        <Button onClick={openIncidenciaModal} leftIcon={<PlusIcon className="h-4 w-4" />}>
          Nueva Incidencia
        </Button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          title="Abiertas"
          value={openCount}
          icon={<ExclamationTriangleIcon />}
          variant="danger"
        />
        <StatsCard
          title="En curso"
          value={inProgressCount}
          icon={<ArrowPathIcon />}
          variant="warning"
        />
        <StatsCard
          title="Cerradas"
          value={closedCount}
          icon={<CheckCircleIcon />}
          variant="success"
        />
      </div>
      
      {/* Filter */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <SelectableChips
            options={statusOptions}
            value={filterStatus}
            onChange={(value) => setFilterStatus(value as IncidenciaStatus | '')}
          />
          <span className="text-sm text-slate-500">
            {filteredIncidencias.length} incidencia{filteredIncidencias.length !== 1 ? 's' : ''}
          </span>
        </div>
      </Card>
      
      {/* Incidencias List */}
      <Card padding="none">
        {filteredIncidencias.length === 0 ? (
          <div className="py-16 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              {filterStatus === '' ? 'No hay incidencias' : `No hay incidencias ${filterStatus === 'abierta' ? 'abiertas' : filterStatus === 'en_curso' ? 'en curso' : 'cerradas'}`}
            </h3>
            <p className="text-slate-500">
              {filterStatus === '' ? '¡Excelente! Todo está en orden.' : 'Intenta con otro filtro'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredIncidencias.map((incidencia, index) => {
              const project = getProject(incidencia.proyecto_id);
              const po = getPO(incidencia.po_id);
              const cert = getCertificate(incidencia.certificado_id);
              
              return (
                <div 
                  key={incidencia.id}
                  className={cn(
                    "p-5 hover:bg-slate-50 transition-colors animate-fade-in",
                    incidencia.urgencia === 'urgente' && "bg-red-50/50"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-mono text-slate-400">{incidencia.id}</span>
                        <IncidenciaBadge status={incidencia.estado} size="sm" />
                        <UrgencyBadge urgency={incidencia.urgencia} size="sm" />
                      </div>
                      
                      <p className="text-slate-800 font-medium mb-2">{incidencia.comentario}</p>
                      
                      <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
                        <Link 
                          href={`/proyectos/${incidencia.proyecto_id}`}
                          className="hover:text-[#1E3A5F] transition-colors"
                        >
                          {project?.nombre}
                        </Link>
                        <span className="text-slate-300">•</span>
                        <span>PO-{po?.numero}</span>
                        {cert && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="truncate max-w-[200px]">{cert.nombre_archivo}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                        <ClockIcon className="h-3.5 w-3.5" />
                        Creada {formatRelativeTime(incidencia.created_at)}
                        {incidencia.updated_at !== incidencia.created_at && (
                          <span className="ml-2">
                            • Actualizada {formatRelativeTime(incidencia.updated_at)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {incidencia.estado === 'abierta' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(incidencia.id, 'en_curso')}
                          leftIcon={<ArrowPathIcon className="h-4 w-4" />}
                        >
                          En curso
                        </Button>
                      )}
                      {incidencia.estado === 'en_curso' && (
                        <Button 
                          size="sm" 
                          variant="success"
                          onClick={() => handleStatusChange(incidencia.id, 'cerrada')}
                          leftIcon={<CheckCircleIcon className="h-4 w-4" />}
                        >
                          Cerrar
                        </Button>
                      )}
                      {incidencia.estado === 'cerrada' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleStatusChange(incidencia.id, 'abierta')}
                        >
                          Reabrir
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

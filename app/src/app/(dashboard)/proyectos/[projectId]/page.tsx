'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRightIcon,
  FolderIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { MOCK_PROJECTS, MOCK_POS, MOCK_CERTIFICATES } from '@/lib/mock-data';
import { CountBadge, StatusBadge, UrgencyBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, StatsCard } from '@/components/ui/Card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell,
  TableEmpty
} from '@/components/ui/Table';
import { Timeline } from '@/components/features/Timeline';
import { EmptyProjectState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/lib/store';
import { formatDate, calculateAging, cn } from '@/lib/utils';

type TabType = 'overview' | 'timeline' | 'incidencias';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { projectId } = use(params);
  const { openUploadModal, openDossierModal } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const project = MOCK_PROJECTS.find(p => p.id === projectId);
  const pos = MOCK_POS.filter(po => po.proyecto_id === projectId);
  const certificates = MOCK_CERTIFICATES.filter(c => c.proyecto_id === projectId);
  
  if (!project) {
    return (
      <div className="text-center py-20">
        <FolderIcon className="h-16 w-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800">Proyecto no encontrado</h2>
        <p className="text-slate-500 mt-2">El proyecto {projectId} no existe</p>
        <Link href="/proyectos">
          <Button variant="primary" className="mt-4">Volver a proyectos</Button>
        </Link>
      </div>
    );
  }
  
  const getPOStats = (poId: string) => {
    const certs = certificates.filter(c => c.po_id === poId);
    return {
      total: certs.length,
      pendientes: certs.filter(c => c.estado === 'pendiente_revision').length,
      incidencias: certs.filter(c => c.estado === 'incidencia').length,
      urgentes: certs.filter(c => c.urgencia === 'urgente').length
    };
  };
  
  const totalPendientes = certificates.filter(c => c.estado === 'pendiente_revision').length;
  const totalIncidencias = certificates.filter(c => c.estado === 'incidencia').length;
  const totalUrgentes = certificates.filter(c => c.urgencia === 'urgente').length;

  // Get pending certificates sorted by urgency
  const pendingCertificates = certificates
    .filter(c => c.estado === 'pendiente_revision')
    .sort((a, b) => {
      if (a.urgencia === 'urgente' && b.urgencia !== 'urgente') return -1;
      if (b.urgencia === 'urgente' && a.urgencia !== 'urgente') return 1;
      return new Date(a.fecha_recepcion).getTime() - new Date(b.fecha_recepcion).getTime();
    })
    .slice(0, 5);

  const tabs = [
    { id: 'overview' as const, label: 'Resumen', icon: ChartBarIcon },
    { id: 'timeline' as const, label: 'Actividad', icon: ClockIcon },
    { id: 'incidencias' as const, label: 'Incidencias', icon: ExclamationTriangleIcon, count: totalIncidencias },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1E3A5F] to-[#15293F] rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {project.id.replace('P-', '')}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-800">{project.nombre}</h1>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg">
                  {project.id}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4" />
                  <span>Owner: <span className="font-medium text-slate-700">{project.owner.nombre}</span></span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Creado: {formatDate(project.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={openDossierModal} leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}>
              Descargar dossier
            </Button>
            <Button variant="primary" onClick={openUploadModal} leftIcon={<PlusIcon className="h-5 w-5" />}>
              Subir certificado
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <FolderIcon className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{pos.length}</p>
              <p className="text-xs text-slate-500">POs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{certificates.length}</p>
              <p className="text-xs text-slate-500">Documentos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{totalPendientes}</p>
              <p className="text-xs text-slate-500">Pendientes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{totalIncidencias}</p>
              <p className="text-xs text-slate-500">Incidencias</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-[#1E3A5F] text-[#1E3A5F]'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <CountBadge count={tab.count} variant="danger" size="sm" />
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* POs List */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Pedidos de Compra (POs)</h2>
                <span className="text-sm text-slate-500">{pos.length} POs</span>
              </div>
              
              {pos.length === 0 ? (
                <EmptyProjectState />
              ) : (
                <div className="space-y-3">
                  {pos.map(po => {
                    const stats = getPOStats(po.id);
                    
                    return (
                      <Link
                        key={po.id}
                        href={`/proyectos/${projectId}/po/${po.id}`}
                        className={cn(
                          'flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md group',
                          stats.urgentes > 0 
                            ? 'border-red-200 bg-red-50/50 hover:border-red-300' 
                            : 'border-slate-200 hover:border-[#1E3A5F]/30'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center',
                            stats.urgentes > 0 ? 'bg-red-100' : 'bg-slate-100'
                          )}>
                            <FolderIcon className={cn(
                              'h-5 w-5',
                              stats.urgentes > 0 ? 'text-red-600' : 'text-slate-600'
                            )} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800 group-hover:text-[#1E3A5F] transition-colors">
                                PO-{po.numero}
                              </span>
                              {stats.urgentes > 0 && (
                                <UrgencyBadge urgency="urgente" size="sm" />
                              )}
                            </div>
                            <p className="text-sm text-slate-500">{po.proveedor}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <CountBadge count={stats.total} />
                            <span className="text-xs text-slate-400">docs</span>
                          </div>
                          {stats.pendientes > 0 && (
                            <CountBadge count={stats.pendientes} variant="warning" />
                          )}
                          {stats.incidencias > 0 && (
                            <CountBadge count={stats.incidencias} variant="danger" />
                          )}
                          <ChevronRightIcon className="h-5 w-5 text-slate-400 group-hover:text-[#1E3A5F] group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Critical */}
            {pendingCertificates.length > 0 && (
              <Card>
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Pendientes críticos</h3>
                <div className="space-y-2">
                  {pendingCertificates.map(cert => {
                    const aging = calculateAging(cert.fecha_recepcion);
                    return (
                      <div 
                        key={cert.id}
                        className={cn(
                          'p-3 rounded-lg border',
                          cert.urgencia === 'urgente' 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-slate-50 border-slate-200'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {cert.nombre_archivo}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {cert.proveedor}
                            </p>
                          </div>
                          {cert.urgencia === 'urgente' && (
                            <span className="text-red-500 text-sm">🔴</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span className={cn(
                            'text-xs font-medium',
                            aging > 7 ? 'text-red-600' : aging > 3 ? 'text-amber-600' : 'text-slate-500'
                          )}>
                            {aging} días
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Activity Timeline */}
            <Card>
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Actividad reciente</h3>
              <Timeline objectId={projectId} objectType="proyecto" limit={5} />
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <Card>
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Historial de actividad</h2>
          <Timeline objectId={projectId} objectType="proyecto" limit={20} />
        </Card>
      )}

      {activeTab === 'incidencias' && (
        <Card>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Incidencias del proyecto</h2>
          {totalIncidencias === 0 ? (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 font-medium">No hay incidencias</p>
              <p className="text-sm text-slate-500 mt-1">Este proyecto no tiene incidencias activas</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates
                  .filter(c => c.estado === 'incidencia')
                  .map(cert => (
                    <TableRow key={cert.id} clickable>
                      <TableCell className="font-medium">{cert.nombre_archivo}</TableCell>
                      <TableCell>{cert.proveedor}</TableCell>
                      <TableCell>
                        <StatusBadge status={cert.estado} />
                      </TableCell>
                      <TableCell className="text-slate-500">{formatDate(cert.fecha_recepcion)}</TableCell>
                      <TableCell>
                        <ChevronRightIcon className="h-4 w-4 text-slate-400" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}
    </div>
  );
}

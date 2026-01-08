'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FolderIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  ChevronRightIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { MOCK_PROJECTS, MOCK_POS, MOCK_CERTIFICATES } from '@/lib/mock-data';
import { CountBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, StatsCard } from '@/components/ui/Card';
import { FilterChip, FilterChipGroup } from '@/components/ui/FilterChips';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell,
  TableEmpty
} from '@/components/ui/Table';
import { useAppStore } from '@/lib/store';
import { formatDate, cn } from '@/lib/utils';

type ViewMode = 'grid' | 'table';
type Filter = 'all' | 'with_pending' | 'with_incidencias' | 'with_urgent';

export default function ProyectosPage() {
  const openUploadModal = useAppStore(state => state.openUploadModal);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  
  const getProjectStats = (projectId: string) => {
    const pos = MOCK_POS.filter(po => po.proyecto_id === projectId);
    const certs = MOCK_CERTIFICATES.filter(c => c.proyecto_id === projectId);
    const pendientes = certs.filter(c => c.estado === 'pendiente_revision').length;
    const incidencias = certs.filter(c => c.estado === 'incidencia').length;
    const urgentes = certs.filter(c => c.urgencia === 'urgente').length;
    
    return {
      totalPOs: pos.length,
      totalDocs: certs.length,
      pendientes,
      incidencias,
      urgentes
    };
  };

  // Filter projects based on search and filter
  const filteredProjects = MOCK_PROJECTS.filter(project => {
    const stats = getProjectStats(project.id);
    
    // Search filter
    const matchesSearch = searchQuery === '' || 
      project.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.owner.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Status filter
    switch (activeFilter) {
      case 'with_pending':
        return stats.pendientes > 0;
      case 'with_incidencias':
        return stats.incidencias > 0;
      case 'with_urgent':
        return stats.urgentes > 0;
      default:
        return true;
    }
  });

  // Calculate totals for filter chips
  const filterCounts = {
    all: MOCK_PROJECTS.length,
    with_pending: MOCK_PROJECTS.filter(p => getProjectStats(p.id).pendientes > 0).length,
    with_incidencias: MOCK_PROJECTS.filter(p => getProjectStats(p.id).incidencias > 0).length,
    with_urgent: MOCK_PROJECTS.filter(p => getProjectStats(p.id).urgentes > 0).length
  };

  // Global stats
  const totalDocs = MOCK_CERTIFICATES.length;
  const totalPending = MOCK_CERTIFICATES.filter(c => c.estado === 'pendiente_revision').length;
  const totalIncidencias = MOCK_CERTIFICATES.filter(c => c.estado === 'incidencia').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Proyectos</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona los certificados organizados por proyecto</p>
        </div>
        <Button onClick={openUploadModal} leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}>
          Subir Certificado
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Proyectos activos"
          value={MOCK_PROJECTS.length}
          icon={<FolderIcon />}
          variant="primary"
        />
        <StatsCard
          title="Total documentos"
          value={totalDocs}
          icon={<DocumentTextIcon />}
          variant="default"
        />
        <StatsCard
          title="Pendientes"
          value={totalPending}
          icon={<ClockIcon />}
          variant="warning"
        />
        <StatsCard
          title="Incidencias"
          value={totalIncidencias}
          icon={<ExclamationTriangleIcon />}
          variant="danger"
        />
      </div>
        
      {/* Filters and Search */}
      <Card padding="sm" className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar proyecto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
          />
        </div>
        
        {/* Filter Chips */}
        <FilterChipGroup>
          <FilterChip 
            label="Todos" 
            active={activeFilter === 'all'}
            count={filterCounts.all}
            onClick={() => setActiveFilter('all')}
          />
          <FilterChip 
            label="Con pendientes" 
            active={activeFilter === 'with_pending'}
            count={filterCounts.with_pending}
            onClick={() => setActiveFilter('with_pending')}
          />
          <FilterChip 
            label="Con incidencias" 
            active={activeFilter === 'with_incidencias'}
            count={filterCounts.with_incidencias}
            onClick={() => setActiveFilter('with_incidencias')}
          />
          <FilterChip 
            label="Urgentes" 
            active={activeFilter === 'with_urgent'}
            count={filterCounts.with_urgent}
            onClick={() => setActiveFilter('with_urgent')}
          />
        </FilterChipGroup>
      </Card>
      
      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card>
          <div className="py-10 text-center">
            <FolderIcon className="h-8 w-8 mx-auto text-gray-200 mb-3" />
            <h3 className="text-sm font-medium text-gray-700 mb-1">No se encontraron proyectos</h3>
            <p className="text-gray-400 text-xs mb-4">
              {searchQuery 
                ? 'No hay proyectos que coincidan con tu búsqueda.'
                : 'No hay proyectos que cumplan con los filtros seleccionados.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}>
              Limpiar filtros
            </Button>
          </div>
        </Card>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredProjects.map((project, index) => {
          const stats = getProjectStats(project.id);
          
          return (
            <Link
              key={project.id}
              href={`/proyectos/${project.id}`}
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card 
                  hover 
                  className="h-full"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-[#1E3A5F] rounded flex items-center justify-center text-white font-medium text-xs">
                    {project.id.replace('P-', '')}
                  </div>
                  <div>
                        <h3 className="font-medium text-xs text-gray-700 group-hover:text-gray-900 transition-colors">
                      {project.nombre}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">{project.id}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-400">
                      <UserIcon className="h-3 w-3" />
                      <span>{project.owner.nombre}</span>
                      <span>•</span>
                      <span>Creado {formatDate(project.created_at)}</span>
                    </div>
                  </div>
                </div>
                    <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              
              {/* Stats */}
                  <div className="flex items-center flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-400">POs:</span>
                  <CountBadge count={stats.totalPOs} size="sm" />
                </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-400">Docs:</span>
                  <CountBadge count={stats.totalDocs} size="sm" />
                </div>
                {stats.pendientes > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400">Pend:</span>
                    <CountBadge count={stats.pendientes} variant="warning" size="sm" />
                  </div>
                )}
                {stats.incidencias > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400">Inc:</span>
                    <CountBadge count={stats.incidencias} variant="danger" size="sm" />
                  </div>
                )}
              </div>
              
                  {/* Urgent Banner */}
              {stats.urgentes > 0 && (
                <div className="mt-3 p-2 bg-red-50/50 border border-red-100 rounded flex items-center gap-1.5">
                  <span className="animate-pulse text-[10px]">🔴</span>
                  <span className="text-[10px] font-medium text-red-600">
                        {stats.urgentes} documento{stats.urgentes > 1 ? 's' : ''} urgente{stats.urgentes > 1 ? 's' : ''}
                  </span>
                </div>
              )}
                </Card>
            </Link>
          );
        })}
      </div>
      )}
    </div>
  );
}

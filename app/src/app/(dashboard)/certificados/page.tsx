'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/lib/store';
import { MOCK_PROJECTS, MOCK_POS, getAllProviders } from '@/lib/mock-data';
import { CertificateStatus, Urgency, Certificate } from '@/lib/types';
import { CertificateCard } from '@/components/features/CertificateCard';
import { CertificadoDrawer } from '@/components/features/CertificadoDrawer';
import { FilterChip, FilterChipGroup, SelectableChips } from '@/components/ui/FilterChips';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Card, StatsCard } from '@/components/ui/Card';
import { cn, calculateAging } from '@/lib/utils';

export default function CertificadosPage() {
  const router = useRouter();
  const { certificates, searchQuery, setSearchQuery, filters, setFilters, clearFilters } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const providers = getAllProviders();
  
  const handleCertificateClick = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setIsDrawerOpen(true);
  };
  
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedCertificate(null);
  };
  
  // Apply filters
  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert => {
      // Text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          cert.nombre_archivo.toLowerCase().includes(query) ||
          cert.proveedor.toLowerCase().includes(query) ||
          cert.id.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Project filter
      if (filters.proyecto && cert.proyecto_id !== filters.proyecto) return false;
      
      // PO filter
      if (filters.po && cert.po_id !== filters.po) return false;
      
      // Provider filter
      if (filters.proveedor && !cert.proveedor.toLowerCase().includes(filters.proveedor.toLowerCase())) return false;
      
      // Status filter
      if (filters.estado && cert.estado !== filters.estado) return false;
      
      // Urgency filter
      if (filters.urgencia && cert.urgencia !== filters.urgencia) return false;
      
      // Aging filter
      if (filters.aging_dias) {
        const aging = calculateAging(cert.fecha_recepcion);
        if (aging < filters.aging_dias) return false;
      }
      
      // Date filters
      if (filters.fecha_desde && cert.fecha_recepcion < filters.fecha_desde) return false;
      if (filters.fecha_hasta && cert.fecha_recepcion > filters.fecha_hasta) return false;
      
      return true;
    });
  }, [certificates, searchQuery, filters]);
  
  const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery.length > 0;
  
  // Stats
  const totalCerts = certificates.length;
  const pendingCount = certificates.filter(c => c.estado === 'pendiente_revision').length;
  const reviewedCount = certificates.filter(c => c.estado === 'revisado').length;
  const incidenciasCount = certificates.filter(c => c.estado === 'incidencia').length;

  // Status filter options for quick filter
  const statusOptions = [
    { value: '', label: 'Todos', count: totalCerts },
    { value: 'pendiente_revision', label: 'Pendientes', count: pendingCount },
    { value: 'revisado', label: 'Revisados', count: reviewedCount },
    { value: 'incidencia', label: 'Incidencias', count: incidenciasCount },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Certificados</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredCertificates.length} de {certificates.length} documentos
          </p>
        </div>
        <Button 
          onClick={() => router.push('/certificados/subir')}
          leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
        >
          Subir Certificado
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total documentos"
          value={totalCerts}
          icon={<DocumentTextIcon />}
          variant="default"
        />
        <StatsCard
          title="Pendientes"
          value={pendingCount}
          icon={<ClockIcon />}
          variant="warning"
        />
        <StatsCard
          title="Revisados"
          value={reviewedCount}
          icon={<CheckCircleIcon />}
          variant="success"
        />
        <StatsCard
          title="Incidencias"
          value={incidenciasCount}
          icon={<ExclamationTriangleIcon />}
          variant="danger"
        />
      </div>
      
      {/* Search & Filters Bar */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, proveedor, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded"
              >
                <XMarkIcon className="h-4 w-4 text-slate-400" />
              </button>
            )}
          </div>
          
          {/* Quick Status Filter */}
          <SelectableChips
            options={statusOptions}
            value={filters.estado || ''}
            onChange={(value) => setFilters({ ...filters, estado: (value as CertificateStatus) || undefined })}
          />
          
          {/* Filters Toggle */}
          <div className="flex items-center gap-2">
            <Button 
              variant={showFilters ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<FunnelIcon className="h-4 w-4" />}
            >
              Filtros
              {Object.keys(filters).length > 0 && (
                <span className="ml-1 bg-white/20 text-xs px-1.5 rounded-full">
                  {Object.keys(filters).length}
                </span>
              )}
            </Button>
            
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpiar
              </Button>
            )}
          </div>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100">
            {/* Project */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Proyecto</label>
              <select
                value={filters.proyecto || ''}
                onChange={(e) => setFilters({ ...filters, proyecto: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
              >
                <option value="">Todos los proyectos</option>
                {MOCK_PROJECTS.map(p => (
                  <option key={p.id} value={p.id}>{p.id}: {p.nombre}</option>
                ))}
              </select>
            </div>
            
            {/* Provider */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Proveedor</label>
              <select
                value={filters.proveedor || ''}
                onChange={(e) => setFilters({ ...filters, proveedor: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
              >
                <option value="">Todos los proveedores</option>
                {providers.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            
            {/* Urgency */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Urgencia</label>
              <select
                value={filters.urgencia || ''}
                onChange={(e) => setFilters({ ...filters, urgencia: (e.target.value as Urgency) || undefined })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
              >
                <option value="">Todas</option>
                <option value="urgente">Solo urgentes</option>
                <option value="normal">Solo normales</option>
              </select>
            </div>
            
            {/* Aging */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Antigüedad</label>
              <select
                value={filters.aging_dias || ''}
                onChange={(e) => setFilters({ ...filters, aging_dias: parseInt(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
              >
                <option value="">Sin filtro</option>
                <option value="3">Más de 3 días</option>
                <option value="7">Más de 7 días</option>
                <option value="14">Más de 14 días</option>
                <option value="30">Más de 30 días</option>
              </select>
            </div>
            
            {/* Date Range */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Desde fecha</label>
              <input
                type="date"
                value={filters.fecha_desde || ''}
                onChange={(e) => setFilters({ ...filters, fecha_desde: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Hasta fecha</label>
              <input
                type="date"
                value={filters.fecha_hasta || ''}
                onChange={(e) => setFilters({ ...filters, fecha_hasta: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
              />
            </div>
          </div>
        )}
      </Card>
      
      {/* Results */}
      {filteredCertificates.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCertificates.map((cert, index) => (
            <div 
              key={cert.id}
              className="animate-fade-in cursor-pointer h-full"
              style={{ animationDelay: `${index * 30}ms` }}
              onClick={() => handleCertificateClick(cert)}
            >
              <CertificateCard 
                certificate={cert} 
                showProject 
                showPO 
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Certificate Detail Drawer */}
      <CertificadoDrawer
        certificate={selectedCertificate}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
}

'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRightIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  FolderIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { MOCK_PROJECTS, MOCK_POS, MOCK_CERTIFICATES } from '@/lib/mock-data';
import { CountBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CertificateCard, CompactCertificateRow } from '@/components/features/CertificateCard';
import { CertificadoDrawer } from '@/components/features/CertificadoDrawer';
import { Timeline } from '@/components/features/Timeline';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/lib/store';
import { formatDate, calculateAging } from '@/lib/utils';
import { Certificate } from '@/lib/types';

interface PageProps {
  params: Promise<{ projectId: string; poId: string }>;
}

export default function PODetailPage({ params }: PageProps) {
  const { projectId, poId } = use(params);
  const { openUploadModal, openDossierModal, openIncidenciaModal, openEmailModal, certificates } = useAppStore();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const project = MOCK_PROJECTS.find(p => p.id === projectId);
  const po = MOCK_POS.find(p => p.id === poId);
  // Use certificates from store instead of mock data to get real-time updates
  const poCertificates = certificates.filter(c => c.po_id === poId);
  
  const handleCertificateClick = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setIsDrawerOpen(true);
  };
  
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedCertificate(null);
  };
  
  if (!project || !po) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-slate-800">PO no encontrada</h2>
        <p className="text-slate-500 mt-2">El pedido {poId} no existe</p>
        <Link href="/proyectos">
          <Button variant="primary" className="mt-4">Volver a proyectos</Button>
        </Link>
      </div>
    );
  }
  
  const pendientes = poCertificates.filter(c => c.estado === 'pendiente_revision');
  const revisados = poCertificates.filter(c => c.estado === 'revisado');
  const incidencias = poCertificates.filter(c => c.estado === 'incidencia');
  const urgentes = poCertificates.filter(c => c.urgencia === 'urgente');

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link href="/proyectos" className="text-slate-500 hover:text-cyan-600">
          Proyectos
        </Link>
        <ChevronRightIcon className="h-4 w-4 text-slate-400" />
        <Link href={`/proyectos/${projectId}`} className="text-slate-500 hover:text-cyan-600">
          {project.nombre}
        </Link>
        <ChevronRightIcon className="h-4 w-4 text-slate-400" />
        <span className="text-slate-800 font-medium">PO-{po.numero}</span>
      </nav>
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
              <FolderIcon className="h-8 w-8 text-slate-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-800">PO-{po.numero}</h1>
                {urgentes.length > 0 && (
                  <span className="animate-pulse text-sm font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                    🔴 {urgentes.length} URGENTE(S)
                  </span>
                )}
              </div>
              <p className="text-lg text-slate-600 mt-1">{po.proveedor}</p>
              <p className="text-sm text-slate-500 mt-2">
                Proyecto: {project.nombre} ({project.id})
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={openEmailModal}>
              <EnvelopeIcon className="h-5 w-5" />
              Notificar owner
            </Button>
            <Button variant="outline" onClick={openIncidenciaModal}>
              <ExclamationTriangleIcon className="h-5 w-5" />
              Crear incidencia
            </Button>
            <Button variant="outline" onClick={openDossierModal}>
              <DocumentArrowDownIcon className="h-5 w-5" />
              Descargar dossier
            </Button>
            <Button variant="primary" onClick={openUploadModal}>
              <PlusIcon className="h-5 w-5" />
              Subir certificado
            </Button>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5 text-slate-400" />
            <span className="text-sm text-slate-600">{poCertificates.length} Documentos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-sm text-slate-600">{revisados.length} Revisados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-sm text-slate-600">{pendientes.length} Pendientes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-sm text-slate-600">{incidencias.length} Incidencias</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Certificates List */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Certificados</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Ordenar por:</span>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option>Fecha recepción</option>
                  <option>Estado</option>
                  <option>Urgencia</option>
                </select>
              </div>
            </div>
            
            {poCertificates.length === 0 ? (
              <EmptyState 
                title="Sin certificados"
                description="Esta PO aún no tiene certificados asociados."
              />
            ) : (
              <div className="space-y-3">
                {/* Urgentes First */}
                {urgentes.map(cert => (
                  <div key={cert.id} onClick={() => handleCertificateClick(cert)} className="cursor-pointer">
                    <CertificateCard certificate={cert} />
                  </div>
                ))}
                
                {/* Then Pendientes */}
                {pendientes.filter(c => c.urgencia !== 'urgente').map(cert => (
                  <div key={cert.id} onClick={() => handleCertificateClick(cert)} className="cursor-pointer">
                    <CertificateCard certificate={cert} />
                  </div>
                ))}
                
                {/* Then Incidencias */}
                {incidencias.filter(c => c.urgencia !== 'urgente').map(cert => (
                  <div key={cert.id} onClick={() => handleCertificateClick(cert)} className="cursor-pointer">
                    <CertificateCard certificate={cert} />
                  </div>
                ))}
                
                {/* Finally Revisados */}
                {revisados.map(cert => (
                  <div key={cert.id} onClick={() => handleCertificateClick(cert)} className="cursor-pointer">
                    <CertificateCard certificate={cert} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Timeline Sidebar */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Actividad</h2>
            <Timeline objectId={poId} objectType="po" limit={10} />
          </div>
        </div>
      </div>
      
      {/* Certificate Detail Drawer */}
      <CertificadoDrawer
        certificate={selectedCertificate}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
}


'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ClockIcon, 
  ExclamationTriangleIcon,
  FolderIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  BellIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { MOCK_PROJECTS, MOCK_POS, MOCK_CERTIFICATES, CURRENT_USER } from '@/lib/mock-data';
import { useAppStore, useUnreadNotificationsCount } from '@/lib/store';
import { CountBadge, StatusBadge, UrgencyBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, StatsCard } from '@/components/ui/Card';
import { formatRelativeTime, calculateAging, cn } from '@/lib/utils';

interface ProjectWithPending {
  id: string;
  nombre: string;
  pendientes: number;
  incidencias: number;
  urgentes: number;
}

export default function InicioPage() {
  const router = useRouter();
  const { openUploadModal, notifications } = useAppStore();
  const unreadCount = useUnreadNotificationsCount();
  
  // Calculate stats
  const totalPendientes = MOCK_CERTIFICATES.filter(c => c.estado === 'pendiente_revision').length;
  const totalIncidencias = MOCK_CERTIFICATES.filter(c => c.estado === 'incidencia').length;
  const totalProyectos = MOCK_PROJECTS.length;
  const docsEsteMes = MOCK_CERTIFICATES.filter(c => {
    const date = new Date(c.created_at);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
  
  // Get projects with pending items
  const projectsWithPending: ProjectWithPending[] = MOCK_PROJECTS.map(project => {
    const certs = MOCK_CERTIFICATES.filter(c => c.proyecto_id === project.id);
    return {
      id: project.id,
      nombre: project.nombre,
      pendientes: certs.filter(c => c.estado === 'pendiente_revision').length,
      incidencias: certs.filter(c => c.estado === 'incidencia').length,
      urgentes: certs.filter(c => c.urgencia === 'urgente').length
    };
  }).filter(p => p.pendientes > 0 || p.incidencias > 0)
    .sort((a, b) => (b.urgentes - a.urgentes) || (b.pendientes - a.pendientes));
  
  // Get recent notifications
  const recentNotifications = notifications.slice(0, 5);
  
  // Get urgent certificates
  const urgentCerts = MOCK_CERTIFICATES.filter(c => c.urgencia === 'urgente' && c.estado === 'pendiente_revision')
    .slice(0, 3);

  return (
    <div className="space-y-5">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Buenos días, {CURRENT_USER.nombre.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Aquí tienes un resumen de lo que tienes pendiente
          </p>
        </div>
        <Button onClick={openUploadModal} leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}>
          Subir Certificado
        </Button>
      </div>
      
      {/* KPIs Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Pendientes aprobación"
          value={totalPendientes}
          icon={<ClockIcon />}
          variant="warning"
          onClick={() => router.push('/certificados?estado=pendiente')}
          className="cursor-pointer hover:ring-1 hover:ring-amber-200 transition-all"
        />
        <StatsCard
          title="Incidencias abiertas"
          value={totalIncidencias}
          icon={<ExclamationTriangleIcon />}
          variant="danger"
          onClick={() => router.push('/incidencias?estado=abierta')}
          className="cursor-pointer hover:ring-1 hover:ring-red-200 transition-all"
        />
        <StatsCard
          title="Proyectos activos"
          value={totalProyectos}
          icon={<FolderIcon />}
          variant="primary"
        />
        <StatsCard
          title="Docs este mes"
          value={docsEsteMes}
          icon={<DocumentTextIcon />}
          variant="default"
        />
      </div>
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          {/* Projects with Pending */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">Proyectos con pendientes</h2>
              <Link href="/proyectos" className="text-[11px] text-gray-500 hover:text-gray-700 font-medium">
                Ver todos →
              </Link>
            </div>
            
            {projectsWithPending.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FolderIcon className="h-5 w-5 text-emerald-500" />
                </div>
                <p className="text-gray-600 font-medium text-xs">¡Todo al día!</p>
                <p className="text-[11px] text-gray-400 mt-0.5">No hay proyectos con pendientes</p>
              </div>
            ) : (
              <div className="space-y-2">
                {projectsWithPending.slice(0, 5).map((project, index) => (
                  <Link
                    key={project.id}
                    href={`/proyectos/${project.id}`}
                    className={cn(
                      'flex items-center justify-between p-3 rounded border transition-all hover:shadow-sm group animate-fade-in',
                      project.urgentes > 0 
                        ? 'border-red-100 bg-red-50/30 hover:border-red-200' 
                        : 'border-gray-100 hover:border-gray-200'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        'w-8 h-8 rounded flex items-center justify-center font-medium text-xs text-white',
                        project.urgentes > 0 
                          ? 'bg-red-500' 
                          : 'bg-[#1E3A5F]'
                      )}>
                        {project.id.replace('P-', '')}
                      </div>
                      <div>
                        <p className="font-medium text-xs text-gray-700 group-hover:text-gray-900 transition-colors">
                          {project.nombre}
                        </p>
                        <p className="text-[10px] text-gray-400">{project.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {project.urgentes > 0 && (
                        <span className="animate-pulse text-[10px]">🔴</span>
                      )}
                      <div className="flex items-center gap-1.5">
                        {project.pendientes > 0 && (
                          <CountBadge count={project.pendientes} variant="warning" size="sm" />
                        )}
                        {project.incidencias > 0 && (
                          <CountBadge count={project.incidencias} variant="danger" size="sm" />
                        )}
                      </div>
                      <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
          
          {/* Urgent Documents Alert */}
          {urgentCerts.length > 0 && (
            <Card className="bg-red-50/50 border-red-100">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="animate-pulse text-sm">🔴</span>
                <h2 className="text-xs font-medium text-red-700">
                  Documentos urgentes ({urgentCerts.length})
                </h2>
              </div>
              <div className="space-y-1.5">
                {urgentCerts.map((cert, index) => {
                  const aging = calculateAging(cert.fecha_recepcion);
                  return (
                    <div 
                      key={cert.id}
                      className="flex items-center justify-between p-2.5 bg-white/70 rounded border border-red-100/50 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="h-4 w-4 text-red-400" />
                        <div>
                          <p className="text-[11px] font-medium text-gray-700 line-clamp-1">
                            {cert.nombre_archivo}
                          </p>
                          <p className="text-[10px] text-gray-400">{cert.proveedor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className={cn(
                          "font-medium",
                          aging > 7 ? "text-red-500" : "text-amber-500"
                        )}>
                          {aging} días
                        </span>
                        <Link 
                          href={`/proyectos/${cert.proyecto_id}/po/${cert.po_id}`}
                          className="text-gray-500 hover:text-gray-700 font-medium"
                        >
                          Ver →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <QuickActionCard
              icon={<ArrowUpTrayIcon className="h-4 w-4" />}
              title="Subir certificado"
              description="Añade un nuevo documento"
              onClick={openUploadModal}
              color="cyan"
            />
            <QuickActionCard
              icon={<MagnifyingGlassIcon className="h-4 w-4" />}
              title="Buscar certificados"
              description="Búsqueda inteligente"
              onClick={() => router.push('/busqueda')}
              color="purple"
            />
            <QuickActionCard
              icon={<ExclamationTriangleIcon className="h-4 w-4" />}
              title="Ver incidencias"
              description={`${totalIncidencias} incidencias activas`}
              onClick={() => router.push('/incidencias')}
              color="orange"
            />
          </div>
        </div>
        
        {/* Right Column - 1/3 - Activity */}
        <div className="space-y-4">
          {/* Recent Activity */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">Actividad reciente</h2>
              {unreadCount > 0 && (
                <CountBadge count={unreadCount} variant="primary" size="sm" />
              )}
            </div>
            
            {recentNotifications.length === 0 ? (
              <div className="text-center py-6">
                <BellIcon className="h-8 w-8 mx-auto text-gray-200 mb-2" />
                <p className="text-gray-400 text-xs">No hay actividad reciente</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentNotifications.map((notif, index) => (
                  <div 
                    key={notif.id}
                    className={cn(
                      'p-2.5 rounded border transition-all animate-fade-in cursor-pointer hover:shadow-sm',
                      notif.leido 
                        ? 'border-gray-100 bg-white' 
                        : 'border-blue-100/50 bg-blue-50/30'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex gap-2">
                      <div className={cn(
                        'mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0',
                        notif.leido ? 'bg-gray-200' : 'bg-[#1E3A5F]'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-gray-700 line-clamp-1">
                          {notif.titulo}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">
                          {notif.descripcion}
                        </p>
                        <p className="text-[9px] text-gray-300 mt-1">
                          {formatRelativeTime(notif.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          
          {/* AI Search Promo */}
          <Card className="bg-purple-50/50 border-purple-100">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-xs text-gray-700 mb-0.5">Búsqueda con IA</h3>
                <p className="text-[10px] text-gray-500 mb-2">
                  Busca certificados usando lenguaje natural
                </p>
                <Button 
                  variant="outline" 
                  size="xs"
                  onClick={() => router.push('/busqueda')}
                  className="bg-white/50 hover:bg-white"
                >
                  Probar ahora
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   QUICK ACTION CARD
   ============================================ */

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: 'cyan' | 'purple' | 'orange';
}

function QuickActionCard({ icon, title, description, onClick, color }: QuickActionCardProps) {
  const colorClasses = {
    cyan: {
      bg: 'bg-cyan-50/50 hover:bg-cyan-50',
      icon: 'bg-cyan-500 text-white',
      border: 'border-cyan-100 hover:border-cyan-200'
    },
    purple: {
      bg: 'bg-purple-50/50 hover:bg-purple-50',
      icon: 'bg-purple-500 text-white',
      border: 'border-purple-100 hover:border-purple-200'
    },
    orange: {
      bg: 'bg-orange-50/50 hover:bg-orange-50',
      icon: 'bg-orange-500 text-white',
      border: 'border-orange-100 hover:border-orange-200'
    }
  };
  
  const classes = colorClasses[color];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 p-3 rounded border transition-all text-left w-full group',
        classes.bg,
        classes.border
      )}
    >
      <div className={cn(
        'w-8 h-8 rounded flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105',
        classes.icon
      )}>
        {icon}
      </div>
      <div>
        <p className="font-medium text-xs text-gray-700">{title}</p>
        <p className="text-[10px] text-gray-400">{description}</p>
      </div>
    </button>
  );
}


'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  FolderIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { MOCK_PROJECTS, MOCK_POS, MOCK_CERTIFICATES } from '@/lib/mock-data';

const navigation = [
  { name: 'Inicio', href: '/inicio', icon: HomeIcon },
  { name: 'Proyectos', href: '/proyectos', icon: FolderIcon },
  { name: 'Certificados', href: '/certificados', icon: DocumentTextIcon },
  { name: 'Incidencias', href: '/incidencias', icon: ExclamationTriangleIcon },
  { name: 'Búsqueda', href: '/busqueda', icon: MagnifyingGlassIcon },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const openUploadModal = useAppStore(state => state.openUploadModal);
  
  // Calculate stats
  const pendingCount = MOCK_CERTIFICATES.filter(c => c.estado === 'pendiente_revision').length;
  const incidenciasCount = MOCK_CERTIFICATES.filter(c => c.estado === 'incidencia').length;
  const urgenteCount = MOCK_CERTIFICATES.filter(c => c.urgencia === 'urgente').length;

  return (
    <aside className={cn(
      'flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
      collapsed ? 'w-16' : 'w-56'
    )}>
      {/* Logo Header */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-gray-200">
        <Link href="/proyectos" className="flex items-center gap-2">
          {collapsed ? (
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
              <span className="text-gray-700 text-xs font-medium">C</span>
            </div>
          ) : (
            <Image 
              src="/cunext-logo.webp" 
              alt="Cunext Group" 
              width={120} 
              height={40}
              className="h-8 w-auto"
              priority
            />
          )}
        </Link>
        
        {onCollapse && (
          <button
            onClick={() => onCollapse(!collapsed)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {collapsed ? (
              <ChevronRightIcon className="h-3.5 w-3.5 text-gray-500" />
            ) : (
              <ChevronLeftIcon className="h-3.5 w-3.5 text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Quick Upload Button */}
      <div className="px-2.5 py-3">
        <button
          onClick={openUploadModal}
          className={cn(
            'w-full flex items-center justify-center gap-1.5 py-2 rounded font-medium text-sm transition-all',
            'bg-[#1E3A5F] hover:bg-[#15293F]',
            'text-white',
            'active:scale-[0.98]',
            collapsed && 'px-0'
          )}
        >
          <PlusIcon className="h-4 w-4" />
          {!collapsed && <span>Subir Certificado</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pb-3 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const hasNotification = item.name === 'Incidencias' && incidenciasCount > 0;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-2.5 px-2.5 py-2 rounded text-sm font-normal transition-all',
                isActive 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                collapsed && 'justify-center'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                'h-4 w-4 flex-shrink-0 transition-colors',
                isActive ? 'text-[#1E3A5F]' : 'text-gray-400 group-hover:text-gray-600'
              )} />
              
              {!collapsed && (
                <>
                  <span>{item.name}</span>
                  {hasNotification && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[1rem] text-center">
                      {incidenciasCount}
                    </span>
                  )}
                </>
              )}
              
              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs font-normal rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.name}
                  {hasNotification && (
                    <span className="ml-1.5 bg-red-500 px-1 py-0.5 rounded text-[10px]">
                      {incidenciasCount}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Stats Footer */}
      <div className={cn(
        'px-2.5 py-3 border-t border-gray-200',
        collapsed && 'px-1.5'
      )}>
        {collapsed ? (
          <div className="space-y-1.5">
            <div className="bg-amber-50 rounded p-1.5 flex items-center justify-center" title={`${pendingCount} Pendientes`}>
              <p className="text-xs font-semibold text-amber-600">{pendingCount}</p>
            </div>
            <div className="bg-red-50 rounded p-1.5 flex items-center justify-center" title={`${urgenteCount} Urgentes`}>
              <p className="text-xs font-semibold text-red-600">{urgenteCount}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-amber-50 rounded-md p-2 flex flex-col items-center justify-center text-center">
                <p className="text-lg font-bold text-amber-600 leading-none">{pendingCount}</p>
                <p className="text-[9px] text-amber-700/70 mt-1 font-medium">Pend.</p>
              </div>
              <div className="bg-red-50 rounded-md p-2 flex flex-col items-center justify-center text-center">
                <p className="text-lg font-bold text-red-600 leading-none">{urgenteCount}</p>
                <p className="text-[9px] text-red-700/70 mt-1 font-medium">Urg.</p>
              </div>
            </div>
            
            <div className="mt-2 bg-gray-50 rounded p-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Proyectos</span>
                <span className="font-medium text-gray-700">{MOCK_PROJECTS.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-gray-500">POs</span>
                <span className="font-medium text-gray-700">{MOCK_POS.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-gray-500">Documentos</span>
                <span className="font-medium text-gray-700">{MOCK_CERTIFICATES.length}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

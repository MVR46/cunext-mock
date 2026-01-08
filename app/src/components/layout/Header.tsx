'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  SparklesIcon,
  XMarkIcon,
  ChevronRightIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { useAppStore, useUnreadNotificationsCount } from '@/lib/store';
import { cn, formatRelativeTime } from '@/lib/utils';
import { CURRENT_USER } from '@/lib/mock-data';

/* ============================================
   BREADCRUMB
   ============================================ */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  let path = '';
  for (const segment of segments) {
    path += '/' + segment;
    
    // Map segments to readable labels
    let label = segment;
    if (segment === 'proyectos') label = 'Proyectos';
    else if (segment === 'certificados') label = 'Certificados';
    else if (segment === 'incidencias') label = 'Incidencias';
    else if (segment === 'busqueda') label = 'Búsqueda';
    else if (segment === 'po') label = 'PO';
    else if (segment.startsWith('P-')) label = segment;
    else if (segment.startsWith('PO-')) label = segment;
    
    breadcrumbs.push({
      label,
      href: path
    });
  }
  
  return breadcrumbs;
}

function Breadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  
  if (breadcrumbs.length <= 1) return null;
  
  return (
    <nav className="flex items-center gap-1 text-xs">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRightIcon className="h-3 w-3 text-gray-400" />
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-gray-700">{item.label}</span>
          ) : (
            <Link 
              href={item.href || '#'} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

/* ============================================
   SEARCH BAR
   ============================================ */

function SearchBar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const { searchQuery, setSearchQuery } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn(
      'relative flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 max-w-sm w-full',
      searchFocused 
        ? 'bg-white ring-1 ring-gray-300 shadow-sm' 
        : 'bg-gray-50 hover:bg-gray-100'
    )}>
      <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
      <input
        ref={inputRef}
        type="text"
        placeholder='Buscar proveedor, PO, albarán...'
        className="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-400 min-w-0"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
      />
      {searchQuery ? (
        <button 
          onClick={() => setSearchQuery('')}
          className="p-0.5 hover:bg-gray-200 rounded transition-colors"
        >
          <XMarkIcon className="h-3.5 w-3.5 text-gray-400" />
        </button>
      ) : (
        <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-200 rounded flex-shrink-0">
          <SparklesIcon className="h-3 w-3 text-gray-500" />
          <span className="text-[9px] text-gray-500 font-medium">⌘K</span>
        </div>
      )}
    </div>
  );
}

/* ============================================
   SEARCH BAR WRAPPER (hides on /busqueda)
   ============================================ */

function SearchBarWrapper() {
  const pathname = usePathname();
  const isBusquedaPage = pathname === '/busqueda';
  
  if (isBusquedaPage) return null;
  
  return (
    <div className="hidden md:flex flex-1 justify-center max-w-lg mx-6">
      <SearchBar />
    </div>
  );
}

/* ============================================
   NOTIFICATION BELL
   ============================================ */

function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead
  } = useAppStore();
  
  const unreadCount = useUnreadNotificationsCount();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-1.5 hover:bg-gray-100 rounded transition-colors"
      >
        <BellIcon className="h-4 w-4 text-gray-500" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 h-3.5 min-w-[14px] px-1 bg-red-500 text-white text-[9px] font-medium rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
            <h3 className="font-medium text-xs text-gray-700">Notificaciones</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Marcar todo como leído
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <BellIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No hay notificaciones</p>
              </div>
            ) : (
              notifications.slice(0, 8).map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    'px-3 py-2 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors',
                    !notification.leido && 'bg-blue-50/30'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      'mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0',
                      notification.leido ? 'bg-gray-300' : 'bg-[#1E3A5F]'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 line-clamp-1">
                        {notification.titulo}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                        {notification.descripcion}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-1">
                        {formatRelativeTime(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 8 && (
            <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 text-center">
              <button className="text-[11px] text-gray-500 hover:text-gray-700 font-medium transition-colors">
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================
   USER MENU
   ============================================ */

function UserMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = CURRENT_USER.nombre.split(' ').map(n => n[0]).join('');

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded transition-colors"
      >
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium text-gray-700">{CURRENT_USER.nombre}</p>
          <p className="text-[9px] text-gray-400">Dpto. Calidad</p>
        </div>
        <div className="h-7 w-7 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white text-[10px] font-medium">
          {initials}
        </div>
      </button>

      {showMenu && (
        <div className="absolute right-0 top-11 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden animate-fade-in-up">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="font-medium text-xs text-gray-700">{CURRENT_USER.nombre}</p>
            <p className="text-[10px] text-gray-400">{CURRENT_USER.email}</p>
          </div>
          <div className="py-1">
            <button className="w-full px-3 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-50 transition-colors">
              Mi perfil
            </button>
            <button className="w-full px-3 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-50 transition-colors">
              Configuración
            </button>
          </div>
          <div className="py-1 border-t border-gray-100">
            <button className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================
   HEADER COMPONENT
   ============================================ */

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <Bars3Icon className="h-4 w-4 text-gray-500" />
          </button>
        )}
        
        {/* Breadcrumbs */}
        <Breadcrumbs />
      </div>

      {/* Center Section - Search (hidden on /busqueda page) */}
      <SearchBarWrapper />

      {/* Right Section */}
      <div className="flex items-center gap-1.5">
        {/* Mobile search button */}
        <button className="md:hidden p-1.5 hover:bg-gray-100 rounded transition-colors">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
        </button>
        
        {/* Notifications */}
        <NotificationBell />
        
        {/* Separator */}
        <div className="h-5 w-px bg-gray-200 mx-1.5 hidden sm:block" />
        
        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}

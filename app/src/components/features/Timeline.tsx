'use client';

import { 
  DocumentPlusIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChatBubbleLeftIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/lib/store';
import { TimelineEventType } from '@/lib/types';
import { formatRelativeTime, cn } from '@/lib/utils';

const eventConfig: Record<TimelineEventType, { icon: typeof DocumentPlusIcon; color: string; bg: string }> = {
  documento_subido: { icon: DocumentPlusIcon, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  estado_cambiado: { icon: ArrowPathIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
  incidencia_creada: { icon: ExclamationTriangleIcon, color: 'text-red-600', bg: 'bg-red-100' },
  incidencia_cerrada: { icon: CheckCircleIcon, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  comentario_agregado: { icon: ChatBubbleLeftIcon, color: 'text-slate-600', bg: 'bg-slate-100' },
  dossier_solicitado: { icon: DocumentArrowDownIcon, color: 'text-purple-600', bg: 'bg-purple-100' },
  email_enviado: { icon: EnvelopeIcon, color: 'text-amber-600', bg: 'bg-amber-100' },
};

interface TimelineProps {
  objectId?: string;
  objectType?: string;
  limit?: number;
}

export function Timeline({ objectId, objectType, limit = 10 }: TimelineProps) {
  const timelineEvents = useAppStore(state => state.timelineEvents);
  
  let events = [...timelineEvents];
  
  // Filter by object if specified
  if (objectId && objectType) {
    events = events.filter(e => e.objeto_id === objectId && e.objeto_tipo === objectType);
  }
  
  // Sort by date descending and limit
  events = events
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
  
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <ArrowPathIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No hay actividad reciente</p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
      
      {/* Events */}
      <div className="space-y-4">
        {events.map((event, index) => {
          const config = eventConfig[event.tipo];
          const Icon = config.icon;
          
          return (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon */}
              <div className={cn(
                "relative z-10 flex items-center justify-center w-10 h-10 rounded-full",
                config.bg
              )}>
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-1.5">
                <p className="text-sm text-slate-700">{event.descripcion}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-semibold">
                      {event.usuario.nombre.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs text-slate-500">{event.usuario.nombre}</span>
                  </div>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-400">{formatRelativeTime(event.created_at)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TimelineCompact({ limit = 5 }: { limit?: number }) {
  const timelineEvents = useAppStore(state => state.timelineEvents);
  
  const events = [...timelineEvents]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
  
  return (
    <div className="space-y-3">
      {events.map(event => {
        const config = eventConfig[event.tipo];
        const Icon = config.icon;
        
        return (
          <div key={event.id} className="flex items-center gap-3 group">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg",
              config.bg
            )}>
              <Icon className={cn("h-4 w-4", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-600 truncate group-hover:text-slate-800">
                {event.descripcion}
              </p>
              <p className="text-xs text-slate-400">{formatRelativeTime(event.created_at)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}


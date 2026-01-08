import { create } from 'zustand';
import { 
  Certificate, 
  CertificateStatus, 
  Urgency, 
  Incidencia, 
  IncidenciaStatus,
  Notification,
  TimelineEvent,
  SearchFilters 
} from './types';
import { 
  MOCK_CERTIFICATES, 
  MOCK_INCIDENCIAS, 
  MOCK_NOTIFICATIONS,
  MOCK_TIMELINE_EVENTS,
  CURRENT_USER 
} from './mock-data';

interface AppState {
  // Certificates
  certificates: Certificate[];
  addCertificate: (cert: Certificate) => void;
  updateCertificateStatus: (id: string, status: CertificateStatus, comment?: string) => void;
  updateCertificateUrgency: (id: string, urgency: Urgency) => void;
  
  // Incidencias
  incidencias: Incidencia[];
  addIncidencia: (incidencia: Incidencia) => void;
  updateIncidenciaStatus: (id: string, status: IncidenciaStatus) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  
  // Timeline
  timelineEvents: TimelineEvent[];
  addTimelineEvent: (event: TimelineEvent) => void;
  
  // Search & Filters
  searchQuery: string;
  filters: SearchFilters;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  removeFilter: (key: keyof SearchFilters) => void;
  
  // UI State
  selectedProjectId: string | null;
  selectedPoId: string | null;
  setSelectedProject: (id: string | null) => void;
  setSelectedPo: (id: string | null) => void;
  
  // Modals
  isUploadModalOpen: boolean;
  isIncidenciaModalOpen: boolean;
  isEmailModalOpen: boolean;
  isDossierModalOpen: boolean;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  openIncidenciaModal: () => void;
  closeIncidenciaModal: () => void;
  openEmailModal: () => void;
  closeEmailModal: () => void;
  openDossierModal: () => void;
  closeDossierModal: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Certificates
  certificates: MOCK_CERTIFICATES,
  addCertificate: (cert) => {
    set((state) => ({ 
      certificates: [...state.certificates, cert] 
    }));
    // Add notification
    const notification: Notification = {
      id: `NOT-${Date.now()}`,
      tipo: 'nuevo_documento',
      titulo: 'Nuevo certificado subido',
      descripcion: `Se ha subido ${cert.nombre_archivo}`,
      objeto_id: cert.id,
      objeto_tipo: 'certificado',
      leido: false,
      created_at: new Date().toISOString()
    };
    get().addNotification(notification);
    // Add timeline event
    const event: TimelineEvent = {
      id: `EVT-${Date.now()}`,
      tipo: 'documento_subido',
      descripcion: `Certificado subido: ${cert.nombre_archivo}`,
      objeto_id: cert.id,
      objeto_tipo: 'certificado',
      usuario: CURRENT_USER,
      created_at: new Date().toISOString()
    };
    get().addTimelineEvent(event);
  },
  updateCertificateStatus: (id, status, comment) => {
    set((state) => ({
      certificates: state.certificates.map(cert => 
        cert.id === id 
          ? { 
              ...cert, 
              estado: status, 
              observaciones: comment || cert.observaciones,
              updated_at: new Date().toISOString() 
            } 
          : cert
      )
    }));
    const cert = get().certificates.find(c => c.id === id);
    if (cert) {
      // Add notification
      const notification: Notification = {
        id: `NOT-${Date.now()}`,
        tipo: 'estado_cambiado',
        titulo: 'Estado actualizado',
        descripcion: `${cert.nombre_archivo} ha cambiado a ${status}`,
        objeto_id: id,
        objeto_tipo: 'certificado',
        leido: false,
        created_at: new Date().toISOString()
      };
      get().addNotification(notification);
      // Add timeline event
      const event: TimelineEvent = {
        id: `EVT-${Date.now()}`,
        tipo: 'estado_cambiado',
        descripcion: `Estado cambiado a "${status}" para ${cert.nombre_archivo}`,
        objeto_id: id,
        objeto_tipo: 'certificado',
        usuario: CURRENT_USER,
        created_at: new Date().toISOString()
      };
      get().addTimelineEvent(event);
    }
  },
  updateCertificateUrgency: (id, urgency) => {
    set((state) => ({
      certificates: state.certificates.map(cert => 
        cert.id === id 
          ? { ...cert, urgencia: urgency, updated_at: new Date().toISOString() } 
          : cert
      )
    }));
  },

  // Incidencias
  incidencias: MOCK_INCIDENCIAS,
  addIncidencia: (incidencia) => {
    set((state) => ({ 
      incidencias: [...state.incidencias, incidencia] 
    }));
    // Add notification
    const notification: Notification = {
      id: `NOT-${Date.now()}`,
      tipo: 'incidencia',
      titulo: 'Nueva incidencia creada',
      descripcion: incidencia.comentario.substring(0, 50) + '...',
      objeto_id: incidencia.id,
      objeto_tipo: 'incidencia',
      leido: false,
      created_at: new Date().toISOString()
    };
    get().addNotification(notification);
    // Add timeline event
    const event: TimelineEvent = {
      id: `EVT-${Date.now()}`,
      tipo: 'incidencia_creada',
      descripcion: `Incidencia creada: ${incidencia.comentario.substring(0, 30)}...`,
      objeto_id: incidencia.id,
      objeto_tipo: 'incidencia',
      usuario: CURRENT_USER,
      created_at: new Date().toISOString()
    };
    get().addTimelineEvent(event);
  },
  updateIncidenciaStatus: (id, status) => {
    set((state) => ({
      incidencias: state.incidencias.map(inc => 
        inc.id === id 
          ? { ...inc, estado: status, updated_at: new Date().toISOString() } 
          : inc
      )
    }));
    const inc = get().incidencias.find(i => i.id === id);
    if (inc && status === 'cerrada') {
      const event: TimelineEvent = {
        id: `EVT-${Date.now()}`,
        tipo: 'incidencia_cerrada',
        descripcion: `Incidencia ${id} cerrada`,
        objeto_id: id,
        objeto_tipo: 'incidencia',
        usuario: CURRENT_USER,
        created_at: new Date().toISOString()
      };
      get().addTimelineEvent(event);
    }
  },

  // Notifications
  notifications: MOCK_NOTIFICATIONS,
  addNotification: (notification) => {
    set((state) => ({ 
      notifications: [notification, ...state.notifications] 
    }));
  },
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => 
        n.id === id ? { ...n, leido: true } : n
      )
    }));
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, leido: true }))
    }));
  },

  // Timeline
  timelineEvents: MOCK_TIMELINE_EVENTS,
  addTimelineEvent: (event) => {
    set((state) => ({ 
      timelineEvents: [event, ...state.timelineEvents] 
    }));
  },

  // Search & Filters
  searchQuery: '',
  filters: {},
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {}, searchQuery: '' }),
  removeFilter: (key) => {
    set((state) => {
      const newFilters = { ...state.filters };
      delete newFilters[key];
      return { filters: newFilters };
    });
  },

  // UI State
  selectedProjectId: null,
  selectedPoId: null,
  setSelectedProject: (id) => set({ selectedProjectId: id, selectedPoId: null }),
  setSelectedPo: (id) => set({ selectedPoId: id }),

  // Modals
  isUploadModalOpen: false,
  isIncidenciaModalOpen: false,
  isEmailModalOpen: false,
  isDossierModalOpen: false,
  openUploadModal: () => set({ isUploadModalOpen: true }),
  closeUploadModal: () => set({ isUploadModalOpen: false }),
  openIncidenciaModal: () => set({ isIncidenciaModalOpen: true }),
  closeIncidenciaModal: () => set({ isIncidenciaModalOpen: false }),
  openEmailModal: () => set({ isEmailModalOpen: true }),
  closeEmailModal: () => set({ isEmailModalOpen: false }),
  openDossierModal: () => set({ isDossierModalOpen: true }),
  closeDossierModal: () => set({ isDossierModalOpen: false }),
}));

// Selector hooks for derived data
export function useCertificatesForPo(poId: string) {
  return useAppStore(state => 
    state.certificates.filter(cert => cert.po_id === poId)
  );
}

export function useCertificatesForProject(projectId: string) {
  return useAppStore(state => 
    state.certificates.filter(cert => cert.proyecto_id === projectId)
  );
}

export function useIncidenciasForProject(projectId: string) {
  return useAppStore(state => 
    state.incidencias.filter(inc => inc.proyecto_id === projectId)
  );
}

export function useUnreadNotificationsCount() {
  return useAppStore(state => 
    state.notifications.filter(n => !n.leido).length
  );
}


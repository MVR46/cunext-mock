// Types for the Certificate Repository System

export interface User {
  id: string;
  nombre: string;
  email: string;
  avatar?: string;
}

export interface Project {
  id: string;
  nombre: string;
  owner: User;
  created_at: string;
}

export interface PO {
  id: string;
  numero: string;
  proyecto_id: string;
  proveedor?: string;
  owner?: User;
  created_at: string;
}

export type CertificateStatus = 'pendiente_revision' | 'revisado' | 'incidencia';
export type Urgency = 'normal' | 'urgente';
export type DocumentType = 'certificado' | 'albaran' | 'factura' | 'otro';

export interface Certificate {
  id: string;
  nombre_archivo: string;
  po_id: string;
  proyecto_id: string;
  proveedor: string;
  fecha_recepcion: string;
  estado: CertificateStatus;
  urgencia: Urgency;
  tipo_documento: DocumentType;
  nro_albaran?: string;
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

export type IncidenciaType = 'falta_documento' | 'documento_incorrecto' | 'otro';
export type IncidenciaStatus = 'abierta' | 'en_curso' | 'cerrada';

export interface Incidencia {
  id: string;
  certificado_id?: string;
  po_id: string;
  proyecto_id: string;
  tipo: IncidenciaType;
  comentario: string;
  urgencia: Urgency;
  estado: IncidenciaStatus;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 'nuevo_documento' | 'incidencia' | 'estado_cambiado' | 'dossier_generado';
export type ObjectType = 'certificado' | 'po' | 'proyecto' | 'incidencia';

export interface Notification {
  id: string;
  tipo: NotificationType;
  titulo: string;
  descripcion: string;
  objeto_id: string;
  objeto_tipo: ObjectType;
  leido: boolean;
  created_at: string;
}

export type TimelineEventType = 
  | 'documento_subido' 
  | 'estado_cambiado' 
  | 'incidencia_creada' 
  | 'incidencia_cerrada'
  | 'comentario_agregado'
  | 'dossier_solicitado'
  | 'email_enviado';

export interface TimelineEvent {
  id: string;
  tipo: TimelineEventType;
  descripcion: string;
  objeto_id: string;
  objeto_tipo: ObjectType;
  usuario: User;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Search and Filters
export interface SearchFilters {
  proyecto?: string;
  po?: string;
  proveedor?: string;
  estado?: CertificateStatus;
  urgencia?: Urgency;
  fecha_desde?: string;
  fecha_hasta?: string;
  aging_dias?: number;
}

export interface SearchParams {
  query: string;
  filters: SearchFilters;
}

// Form validation
export const VALIDATION_MESSAGES = {
  proyecto: "Selecciona un proyecto para continuar",
  po: "Selecciona la PO asociada a este certificado",
  proveedor: "Indica el proveedor del certificado",
  fecha: "La fecha de recepción es obligatoria",
  fecha_futuro: "La fecha no puede ser futura",
  observaciones: "Las observaciones no pueden superar 500 caracteres",
  incidencia_comentario: "Añade un comentario para la incidencia"
} as const;

// Status badge colors
export const STATUS_COLORS: Record<CertificateStatus, { bg: string; text: string; label: string }> = {
  pendiente_revision: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pendiente' },
  revisado: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Revisado' },
  incidencia: { bg: 'bg-red-100', text: 'text-red-800', label: 'Incidencia' }
};

export const URGENCY_COLORS: Record<Urgency, { bg: string; text: string; label: string }> = {
  normal: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Normal' },
  urgente: { bg: 'bg-red-500', text: 'text-white', label: 'Urgente' }
};

export const INCIDENCIA_STATUS_COLORS: Record<IncidenciaStatus, { bg: string; text: string; label: string }> = {
  abierta: { bg: 'bg-red-100', text: 'text-red-800', label: 'Abierta' },
  en_curso: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'En curso' },
  cerrada: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Cerrada' }
};

export const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'certificado', label: 'Certificado' },
  { value: 'albaran', label: 'Albarán' },
  { value: 'factura', label: 'Factura' },
  { value: 'otro', label: 'Otro' }
];

export const INCIDENCIA_TYPES: { value: IncidenciaType; label: string }[] = [
  { value: 'falta_documento', label: 'Falta documento' },
  { value: 'documento_incorrecto', label: 'Documento incorrecto' },
  { value: 'otro', label: 'Otro' }
];


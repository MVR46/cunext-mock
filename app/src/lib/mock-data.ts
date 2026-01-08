import { 
  User, 
  Project, 
  PO, 
  Certificate, 
  Incidencia, 
  Notification, 
  TimelineEvent 
} from './types';

// Mock Users
export const MOCK_USERS: User[] = [
  { id: 'u1', nombre: 'Mónica García', email: 'monica.garcia@empresa.com', avatar: '/avatars/monica.png' },
  { id: 'u2', nombre: 'Porfirio López', email: 'porfirio.lopez@empresa.com', avatar: '/avatars/porfirio.png' },
  { id: 'u3', nombre: 'Carmen Ruiz', email: 'carmen.ruiz@empresa.com', avatar: '/avatars/carmen.png' },
  { id: 'u4', nombre: 'Antonio Fernández', email: 'antonio.fernandez@empresa.com', avatar: '/avatars/antonio.png' },
  { id: 'u5', nombre: 'Laura Martínez', email: 'laura.martinez@empresa.com', avatar: '/avatars/laura.png' },
];

// Current logged in user (for demo)
export const CURRENT_USER = MOCK_USERS[0];

// Mock Projects (3-5)
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'P-001',
    nombre: 'Planta Química Tarragona',
    owner: MOCK_USERS[0],
    created_at: '2024-10-01'
  },
  {
    id: 'P-002',
    nombre: 'Refinería Huelva',
    owner: MOCK_USERS[1],
    created_at: '2024-09-15'
  },
  {
    id: 'P-003',
    nombre: 'Terminal Portuaria Bilbao',
    owner: MOCK_USERS[2],
    created_at: '2024-08-20'
  },
  {
    id: 'P-004',
    nombre: 'Planta Petroquímica Cartagena',
    owner: MOCK_USERS[3],
    created_at: '2024-07-10'
  },
  {
    id: 'P-005',
    nombre: 'Centro Logístico Valencia',
    owner: MOCK_USERS[4],
    created_at: '2024-11-01'
  }
];

// Mock POs (3-8 per project)
export const MOCK_POS: PO[] = [
  // Proyecto P-001 - 5 POs
  { id: 'PO-4500001', numero: '4500001', proyecto_id: 'P-001', proveedor: 'Tubacex S.A.', created_at: '2024-10-05' },
  { id: 'PO-4500002', numero: '4500002', proyecto_id: 'P-001', proveedor: 'Acerinox', created_at: '2024-10-08' },
  { id: 'PO-4500003', numero: '4500003', proyecto_id: 'P-001', proveedor: 'Repsol Química', created_at: '2024-10-12' },
  { id: 'PO-4500004', numero: '4500004', proyecto_id: 'P-001', proveedor: 'Sidenor', created_at: '2024-10-15' },
  { id: 'PO-4500005', numero: '4500005', proyecto_id: 'P-001', proveedor: 'ArcelorMittal', created_at: '2024-10-20' },
  
  // Proyecto P-002 - 4 POs
  { id: 'PO-4500010', numero: '4500010', proyecto_id: 'P-002', proveedor: 'Cepsa', created_at: '2024-09-18' },
  { id: 'PO-4500011', numero: '4500011', proyecto_id: 'P-002', proveedor: 'BP Oil España', created_at: '2024-09-22' },
  { id: 'PO-4500012', numero: '4500012', proyecto_id: 'P-002', proveedor: 'Técnicas Reunidas', created_at: '2024-09-28' },
  { id: 'PO-4500013', numero: '4500013', proyecto_id: 'P-002', proveedor: 'Tubacex S.A.', created_at: '2024-10-02' },
  
  // Proyecto P-003 - 6 POs
  { id: 'PO-4500020', numero: '4500020', proyecto_id: 'P-003', proveedor: 'Nervión Industries', created_at: '2024-08-25' },
  { id: 'PO-4500021', numero: '4500021', proyecto_id: 'P-003', proveedor: 'Astilleros Zamakona', created_at: '2024-08-30' },
  { id: 'PO-4500022', numero: '4500022', proyecto_id: 'P-003', proveedor: 'Euskal Forging', created_at: '2024-09-05' },
  { id: 'PO-4500023', numero: '4500023', proyecto_id: 'P-003', proveedor: 'Vicinay Cadenas', created_at: '2024-09-10' },
  { id: 'PO-4500024', numero: '4500024', proyecto_id: 'P-003', proveedor: 'Sidenor', created_at: '2024-09-15' },
  { id: 'PO-4500025', numero: '4500025', proyecto_id: 'P-003', proveedor: 'Acerinox', created_at: '2024-09-20' },
  
  // Proyecto P-004 - 4 POs
  { id: 'PO-4500030', numero: '4500030', proyecto_id: 'P-004', proveedor: 'Sabic', created_at: '2024-07-15' },
  { id: 'PO-4500031', numero: '4500031', proyecto_id: 'P-004', proveedor: 'BASF Española', created_at: '2024-07-22' },
  { id: 'PO-4500032', numero: '4500032', proyecto_id: 'P-004', proveedor: 'Dow Chemical', created_at: '2024-08-01' },
  { id: 'PO-4500033', numero: '4500033', proyecto_id: 'P-004', proveedor: 'Ercros', created_at: '2024-08-10' },
  
  // Proyecto P-005 - 3 POs
  { id: 'PO-4500040', numero: '4500040', proyecto_id: 'P-005', proveedor: 'Logista', created_at: '2024-11-05' },
  { id: 'PO-4500041', numero: '4500041', proyecto_id: 'P-005', proveedor: 'ID Logistics', created_at: '2024-11-10' },
  { id: 'PO-4500042', numero: '4500042', proyecto_id: 'P-005', proveedor: 'XPO Logistics', created_at: '2024-11-15' },
];

// Mock Certificates (20-30 distributed)
export const MOCK_CERTIFICATES: Certificate[] = [
  // P-001 Certificates
  {
    id: 'CERT-001',
    nombre_archivo: 'Cert_Tubacex_Lote_A2024.pdf',
    po_id: 'PO-4500001',
    proyecto_id: 'P-001',
    proveedor: 'Tubacex S.A.',
    fecha_recepcion: '2024-10-10',
    estado: 'revisado',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    nro_albaran: 'ALB-2024-1001',
    created_at: '2024-10-10T09:00:00Z',
    updated_at: '2024-10-11T14:30:00Z'
  },
  {
    id: 'CERT-002',
    nombre_archivo: 'Cert_Tubacex_Calidad_Material.pdf',
    po_id: 'PO-4500001',
    proyecto_id: 'P-001',
    proveedor: 'Tubacex S.A.',
    fecha_recepcion: '2024-10-12',
    estado: 'pendiente_revision',
    urgencia: 'urgente',
    tipo_documento: 'certificado',
    created_at: '2024-10-12T11:00:00Z',
    updated_at: '2024-10-12T11:00:00Z'
  },
  {
    id: 'CERT-003',
    nombre_archivo: 'Albaran_Acerinox_Oct24.pdf',
    po_id: 'PO-4500002',
    proyecto_id: 'P-001',
    proveedor: 'Acerinox',
    fecha_recepcion: '2024-10-15',
    estado: 'incidencia',
    urgencia: 'urgente',
    tipo_documento: 'albaran',
    observaciones: 'Falta sello del proveedor en página 2',
    created_at: '2024-10-15T10:00:00Z',
    updated_at: '2024-10-16T09:00:00Z'
  },
  {
    id: 'CERT-004',
    nombre_archivo: 'Cert_Repsol_Quimica_Batch.pdf',
    po_id: 'PO-4500003',
    proyecto_id: 'P-001',
    proveedor: 'Repsol Química',
    fecha_recepcion: '2024-10-18',
    estado: 'revisado',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    nro_albaran: 'ALB-REP-9922',
    created_at: '2024-10-18T08:30:00Z',
    updated_at: '2024-10-19T16:00:00Z'
  },
  {
    id: 'CERT-005',
    nombre_archivo: 'Factura_Sidenor_001.pdf',
    po_id: 'PO-4500004',
    proyecto_id: 'P-001',
    proveedor: 'Sidenor',
    fecha_recepcion: '2024-10-20',
    estado: 'pendiente_revision',
    urgencia: 'normal',
    tipo_documento: 'factura',
    created_at: '2024-10-20T14:00:00Z',
    updated_at: '2024-10-20T14:00:00Z'
  },
  {
    id: 'CERT-006',
    nombre_archivo: 'Cert_ArcelorMittal_Steel.pdf',
    po_id: 'PO-4500005',
    proyecto_id: 'P-001',
    proveedor: 'ArcelorMittal',
    fecha_recepcion: '2024-10-22',
    estado: 'pendiente_revision',
    urgencia: 'urgente',
    tipo_documento: 'certificado',
    created_at: '2024-10-22T10:00:00Z',
    updated_at: '2024-10-22T10:00:00Z'
  },
  
  // P-002 Certificates
  {
    id: 'CERT-010',
    nombre_archivo: 'Cert_Cepsa_Fuel_Quality.pdf',
    po_id: 'PO-4500010',
    proyecto_id: 'P-002',
    proveedor: 'Cepsa',
    fecha_recepcion: '2024-09-25',
    estado: 'revisado',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    nro_albaran: 'CEP-2024-5566',
    created_at: '2024-09-25T09:00:00Z',
    updated_at: '2024-09-26T11:00:00Z'
  },
  {
    id: 'CERT-011',
    nombre_archivo: 'Cert_BP_Lubricants.pdf',
    po_id: 'PO-4500011',
    proyecto_id: 'P-002',
    proveedor: 'BP Oil España',
    fecha_recepcion: '2024-09-28',
    estado: 'pendiente_revision',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    created_at: '2024-09-28T13:00:00Z',
    updated_at: '2024-09-28T13:00:00Z'
  },
  {
    id: 'CERT-012',
    nombre_archivo: 'Informe_Tecnicas_Reunidas.pdf',
    po_id: 'PO-4500012',
    proyecto_id: 'P-002',
    proveedor: 'Técnicas Reunidas',
    fecha_recepcion: '2024-10-01',
    estado: 'incidencia',
    urgencia: 'urgente',
    tipo_documento: 'otro',
    observaciones: 'Datos de calibración incompletos',
    created_at: '2024-10-01T11:00:00Z',
    updated_at: '2024-10-03T09:00:00Z'
  },
  {
    id: 'CERT-013',
    nombre_archivo: 'Cert_Tubacex_P002.pdf',
    po_id: 'PO-4500013',
    proyecto_id: 'P-002',
    proveedor: 'Tubacex S.A.',
    fecha_recepcion: '2024-10-05',
    estado: 'revisado',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    created_at: '2024-10-05T08:00:00Z',
    updated_at: '2024-10-06T10:00:00Z'
  },
  
  // P-003 Certificates
  {
    id: 'CERT-020',
    nombre_archivo: 'Cert_Nervion_Estructuras.pdf',
    po_id: 'PO-4500020',
    proyecto_id: 'P-003',
    proveedor: 'Nervión Industries',
    fecha_recepcion: '2024-09-01',
    estado: 'revisado',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    nro_albaran: 'NER-2024-001',
    created_at: '2024-09-01T10:00:00Z',
    updated_at: '2024-09-02T14:00:00Z'
  },
  {
    id: 'CERT-021',
    nombre_archivo: 'Albaran_Zamakona_Sept.pdf',
    po_id: 'PO-4500021',
    proyecto_id: 'P-003',
    proveedor: 'Astilleros Zamakona',
    fecha_recepcion: '2024-09-05',
    estado: 'pendiente_revision',
    urgencia: 'normal',
    tipo_documento: 'albaran',
    created_at: '2024-09-05T09:00:00Z',
    updated_at: '2024-09-05T09:00:00Z'
  },
  {
    id: 'CERT-022',
    nombre_archivo: 'Cert_Euskal_Forging_Heat.pdf',
    po_id: 'PO-4500022',
    proyecto_id: 'P-003',
    proveedor: 'Euskal Forging',
    fecha_recepcion: '2024-09-10',
    estado: 'revisado',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    created_at: '2024-09-10T11:00:00Z',
    updated_at: '2024-09-11T16:00:00Z'
  },
  {
    id: 'CERT-023',
    nombre_archivo: 'Cert_Vicinay_Cadenas.pdf',
    po_id: 'PO-4500023',
    proyecto_id: 'P-003',
    proveedor: 'Vicinay Cadenas',
    fecha_recepcion: '2024-09-15',
    estado: 'incidencia',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    observaciones: 'Certificado de colada no coincide con pedido',
    created_at: '2024-09-15T14:00:00Z',
    updated_at: '2024-09-17T10:00:00Z'
  },
  {
    id: 'CERT-024',
    nombre_archivo: 'Cert_Sidenor_Bilbao.pdf',
    po_id: 'PO-4500024',
    proyecto_id: 'P-003',
    proveedor: 'Sidenor',
    fecha_recepcion: '2024-09-20',
    estado: 'pendiente_revision',
    urgencia: 'urgente',
    tipo_documento: 'certificado',
    created_at: '2024-09-20T08:00:00Z',
    updated_at: '2024-09-20T08:00:00Z'
  },
  {
    id: 'CERT-025',
    nombre_archivo: 'Cert_Acerinox_Inox.pdf',
    po_id: 'PO-4500025',
    proyecto_id: 'P-003',
    proveedor: 'Acerinox',
    fecha_recepcion: '2024-09-25',
    estado: 'revisado',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    nro_albaran: 'ACX-2024-8877',
    created_at: '2024-09-25T10:00:00Z',
    updated_at: '2024-09-26T15:00:00Z'
  },
  
  // P-004 Certificates
  {
    id: 'CERT-030',
    nombre_archivo: 'Cert_Sabic_Polimeros.pdf',
    po_id: 'PO-4500030',
    proyecto_id: 'P-004',
    proveedor: 'Sabic',
    fecha_recepcion: '2024-07-20',
    estado: 'revisado',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    nro_albaran: 'SAB-2024-1122',
    created_at: '2024-07-20T09:00:00Z',
    updated_at: '2024-07-21T11:00:00Z'
  },
  {
    id: 'CERT-031',
    nombre_archivo: 'Cert_BASF_Quimicos.pdf',
    po_id: 'PO-4500031',
    proyecto_id: 'P-004',
    proveedor: 'BASF Española',
    fecha_recepcion: '2024-07-28',
    estado: 'pendiente_revision',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    created_at: '2024-07-28T14:00:00Z',
    updated_at: '2024-07-28T14:00:00Z'
  },
  {
    id: 'CERT-032',
    nombre_archivo: 'Factura_Dow_Chemical.pdf',
    po_id: 'PO-4500032',
    proyecto_id: 'P-004',
    proveedor: 'Dow Chemical',
    fecha_recepcion: '2024-08-05',
    estado: 'revisado',
    urgencia: 'normal',
    tipo_documento: 'factura',
    created_at: '2024-08-05T10:00:00Z',
    updated_at: '2024-08-06T09:00:00Z'
  },
  {
    id: 'CERT-033',
    nombre_archivo: 'Cert_Ercros_Cloro.pdf',
    po_id: 'PO-4500033',
    proyecto_id: 'P-004',
    proveedor: 'Ercros',
    fecha_recepcion: '2024-08-15',
    estado: 'incidencia',
    urgencia: 'urgente',
    tipo_documento: 'certificado',
    observaciones: 'Certificado caducado, solicitar renovación',
    created_at: '2024-08-15T11:00:00Z',
    updated_at: '2024-08-17T14:00:00Z'
  },
  
  // P-005 Certificates
  {
    id: 'CERT-040',
    nombre_archivo: 'Cert_Logista_Almacen.pdf',
    po_id: 'PO-4500040',
    proyecto_id: 'P-005',
    proveedor: 'Logista',
    fecha_recepcion: '2024-11-08',
    estado: 'pendiente_revision',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    created_at: '2024-11-08T09:00:00Z',
    updated_at: '2024-11-08T09:00:00Z'
  },
  {
    id: 'CERT-041',
    nombre_archivo: 'Albaran_ID_Logistics.pdf',
    po_id: 'PO-4500041',
    proyecto_id: 'P-005',
    proveedor: 'ID Logistics',
    fecha_recepcion: '2024-11-12',
    estado: 'pendiente_revision',
    urgencia: 'urgente',
    tipo_documento: 'albaran',
    created_at: '2024-11-12T10:00:00Z',
    updated_at: '2024-11-12T10:00:00Z'
  },
  {
    id: 'CERT-042',
    nombre_archivo: 'Cert_XPO_Transporte.pdf',
    po_id: 'PO-4500042',
    proyecto_id: 'P-005',
    proveedor: 'XPO Logistics',
    fecha_recepcion: '2024-11-18',
    estado: 'pendiente_revision',
    urgencia: 'normal',
    tipo_documento: 'certificado',
    created_at: '2024-11-18T14:00:00Z',
    updated_at: '2024-11-18T14:00:00Z'
  },
];

// Mock Incidencias
export const MOCK_INCIDENCIAS: Incidencia[] = [
  {
    id: 'INC-001',
    certificado_id: 'CERT-003',
    po_id: 'PO-4500002',
    proyecto_id: 'P-001',
    tipo: 'documento_incorrecto',
    comentario: 'Falta sello del proveedor en página 2. Se ha solicitado reenvío.',
    urgencia: 'urgente',
    estado: 'abierta',
    created_at: '2024-10-16T09:00:00Z',
    updated_at: '2024-10-16T09:00:00Z'
  },
  {
    id: 'INC-002',
    certificado_id: 'CERT-012',
    po_id: 'PO-4500012',
    proyecto_id: 'P-002',
    tipo: 'documento_incorrecto',
    comentario: 'Datos de calibración incompletos en el informe técnico.',
    urgencia: 'urgente',
    estado: 'en_curso',
    created_at: '2024-10-03T09:00:00Z',
    updated_at: '2024-10-05T11:00:00Z'
  },
  {
    id: 'INC-003',
    certificado_id: 'CERT-023',
    po_id: 'PO-4500023',
    proyecto_id: 'P-003',
    tipo: 'documento_incorrecto',
    comentario: 'Certificado de colada no coincide con el número de pedido.',
    urgencia: 'normal',
    estado: 'abierta',
    created_at: '2024-09-17T10:00:00Z',
    updated_at: '2024-09-17T10:00:00Z'
  },
  {
    id: 'INC-004',
    certificado_id: 'CERT-033',
    po_id: 'PO-4500033',
    proyecto_id: 'P-004',
    tipo: 'documento_incorrecto',
    comentario: 'Certificado caducado desde hace 3 meses. Urgente solicitar renovación.',
    urgencia: 'urgente',
    estado: 'abierta',
    created_at: '2024-08-17T14:00:00Z',
    updated_at: '2024-08-17T14:00:00Z'
  },
  {
    id: 'INC-005',
    po_id: 'PO-4500041',
    proyecto_id: 'P-005',
    tipo: 'falta_documento',
    comentario: 'Falta certificado de calidad para el lote recibido el 10/11.',
    urgencia: 'normal',
    estado: 'abierta',
    created_at: '2024-11-13T10:00:00Z',
    updated_at: '2024-11-13T10:00:00Z'
  },
];

// Mock Notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOT-001',
    tipo: 'nuevo_documento',
    titulo: 'Nuevo certificado subido',
    descripcion: 'Se ha subido Cert_XPO_Transporte.pdf al proyecto Centro Logístico Valencia',
    objeto_id: 'CERT-042',
    objeto_tipo: 'certificado',
    leido: false,
    created_at: '2024-11-18T14:00:00Z'
  },
  {
    id: 'NOT-002',
    tipo: 'incidencia',
    titulo: 'Nueva incidencia creada',
    descripcion: 'Falta certificado de calidad para el lote recibido',
    objeto_id: 'INC-005',
    objeto_tipo: 'incidencia',
    leido: false,
    created_at: '2024-11-13T10:00:00Z'
  },
  {
    id: 'NOT-003',
    tipo: 'estado_cambiado',
    titulo: 'Estado actualizado',
    descripcion: 'El certificado Cert_Ercros_Cloro.pdf ha pasado a estado Incidencia',
    objeto_id: 'CERT-033',
    objeto_tipo: 'certificado',
    leido: true,
    created_at: '2024-08-17T14:00:00Z'
  },
  {
    id: 'NOT-004',
    tipo: 'nuevo_documento',
    titulo: 'Nuevo albarán subido',
    descripcion: 'Se ha subido Albaran_ID_Logistics.pdf - Marcado como URGENTE',
    objeto_id: 'CERT-041',
    objeto_tipo: 'certificado',
    leido: false,
    created_at: '2024-11-12T10:00:00Z'
  },
  {
    id: 'NOT-005',
    tipo: 'incidencia',
    titulo: 'Incidencia en curso',
    descripcion: 'La incidencia del informe Técnicas Reunidas está siendo revisada',
    objeto_id: 'INC-002',
    objeto_tipo: 'incidencia',
    leido: true,
    created_at: '2024-10-05T11:00:00Z'
  },
];

// Mock Timeline Events
export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'EVT-001',
    tipo: 'documento_subido',
    descripcion: 'Certificado subido: Cert_XPO_Transporte.pdf',
    objeto_id: 'CERT-042',
    objeto_tipo: 'certificado',
    usuario: MOCK_USERS[4],
    created_at: '2024-11-18T14:00:00Z'
  },
  {
    id: 'EVT-002',
    tipo: 'incidencia_creada',
    descripcion: 'Incidencia creada: Falta certificado de calidad',
    objeto_id: 'INC-005',
    objeto_tipo: 'incidencia',
    usuario: MOCK_USERS[4],
    created_at: '2024-11-13T10:00:00Z'
  },
  {
    id: 'EVT-003',
    tipo: 'documento_subido',
    descripcion: 'Albarán subido: Albaran_ID_Logistics.pdf (URGENTE)',
    objeto_id: 'CERT-041',
    objeto_tipo: 'certificado',
    usuario: MOCK_USERS[4],
    created_at: '2024-11-12T10:00:00Z'
  },
  {
    id: 'EVT-004',
    tipo: 'estado_cambiado',
    descripcion: 'Estado cambiado a "En curso" para incidencia INC-002',
    objeto_id: 'INC-002',
    objeto_tipo: 'incidencia',
    usuario: MOCK_USERS[1],
    created_at: '2024-10-05T11:00:00Z'
  },
  {
    id: 'EVT-005',
    tipo: 'estado_cambiado',
    descripcion: 'Certificado Cert_Ercros_Cloro.pdf marcado con Incidencia',
    objeto_id: 'CERT-033',
    objeto_tipo: 'certificado',
    usuario: MOCK_USERS[3],
    created_at: '2024-08-17T14:00:00Z'
  },
  {
    id: 'EVT-006',
    tipo: 'dossier_solicitado',
    descripcion: 'Dossier solicitado para proyecto P-003',
    objeto_id: 'P-003',
    objeto_tipo: 'proyecto',
    usuario: MOCK_USERS[2],
    created_at: '2024-09-28T09:00:00Z'
  },
  {
    id: 'EVT-007',
    tipo: 'email_enviado',
    descripcion: 'Email enviado a Acerinox solicitando documentación',
    objeto_id: 'CERT-003',
    objeto_tipo: 'certificado',
    usuario: MOCK_USERS[0],
    created_at: '2024-10-16T10:30:00Z'
  },
];

// Helper function to get unique providers
export function getAllProviders(): string[] {
  const providers = new Set<string>();
  MOCK_POS.forEach(po => {
    if (po.proveedor) providers.add(po.proveedor);
  });
  MOCK_CERTIFICATES.forEach(cert => {
    providers.add(cert.proveedor);
  });
  return Array.from(providers).sort();
}


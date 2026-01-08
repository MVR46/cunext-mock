# Plan de Desarrollo - Parte 1: Funcional

## 🎯 Visión General

Este documento detalla el plan de implementación funcional para el **Repositorio Inteligente de Certificados** del Departamento de Calidad. El objetivo es crear una demo navegable que impresione, con atención al detalle y comprensión del problema del usuario.

---

## 📋 Resumen Ejecutivo

| Aspecto | Descripción |
|---------|-------------|
| **Usuario Principal** | Departamento de Calidad |
| **Objetivo** | Repositorio central para subir, clasificar, buscar y gestionar certificados de calidad |
| **Modelo de Datos** | Proyecto → PO (Pedido de compra) → Certificado |
| **Tech Stack Recomendado** | Next.js 14+ / React 18+ con TypeScript, Tailwind CSS, Zustand/Context para estado |

---

## 🏗️ Arquitectura de Datos

### Modelo Relacional

```
┌─────────────┐       ┌─────────────┐       ┌──────────────────┐
│  PROYECTO   │ 1───N │     PO      │ 1───N │   CERTIFICADO    │
├─────────────┤       ├─────────────┤       ├──────────────────┤
│ id          │       │ id          │       │ id               │
│ nombre      │       │ numero      │       │ nombre_archivo   │
│ owner       │       │ proyecto_id │       │ po_id            │
│ created_at  │       │ proveedor?  │       │ proveedor        │
│             │       │ owner?      │       │ fecha_recepcion  │
└─────────────┘       │ created_at  │       │ estado           │
                      └─────────────┘       │ urgencia         │
                                            │ tipo_documento   │
                                            │ nro_albaran?     │
                                            │ observaciones?   │
                                            │ created_at       │
                                            └──────────────────┘
```

### Estados de Certificado (Enum)

| Estado | Color Badge | Descripción |
|--------|-------------|-------------|
| `pendiente_revision` | 🟡 Amarillo | Recién subido, pendiente de revisar |
| `revisado` | 🟢 Verde | Validado por Calidad |
| `incidencia` | 🔴 Rojo | Requiere acción/resolución |

### Urgencia (Enum)

| Valor | Badge |
|-------|-------|
| `normal` | Gris/Default |
| `urgente` | 🔴 Rojo con animación pulse |

---

## 📦 Módulos Funcionales

### 1. Datos Mock (Obligatorio)

**Requisitos:**
- [ ] 3-5 Proyectos pre-creados
- [ ] Cada proyecto con 3-8 POs
- [ ] 10-30 certificados distribuidos para demo
- [ ] Owners asignados a cada proyecto

**Implementación:**
```typescript
// /lib/mock-data.ts
export const MOCK_PROJECTS: Project[] = [
  {
    id: "P-001",
    nombre: "Planta Química Tarragona",
    owner: { id: "u1", nombre: "Mónica García", avatar: "/avatars/monica.png" },
    created_at: "2024-10-01"
  },
  {
    id: "P-002",
    nombre: "Refinería Huelva",
    owner: { id: "u2", nombre: "Porfirio López", avatar: "/avatars/porfirio.png" },
    created_at: "2024-09-15"
  },
  // ... 3 más
];

export const MOCK_POS: PO[] = [
  { id: "PO-4500001", proyecto_id: "P-001", proveedor: "Tubacex S.A.", ... },
  // ...
];

export const MOCK_CERTIFICATES: Certificate[] = [
  // 10-30 certificados con variedad de estados
];
```

---

### 2. Ingesta Manual de Certificados (Obligatorio)

**Flujo de Subida:**

```
┌──────────────────┐
│ 1. Drag & Drop   │
│    PDF/Foto      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 2. "Leyendo      │  ← Mock: 1.5s loader
│    documento..." │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. Autocompletar │  ← Mock: detectar proveedor
│    Proveedor     │     con "confianza"
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 4. Formulario    │
│    Obligatorios  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 5. Guardar       │  ← Validación inline
└──────────────────┘
```

**Campos del Formulario:**

| Campo | Tipo | Obligatorio | Validación |
|-------|------|-------------|------------|
| Proyecto | Dropdown | ✅ | No vacío |
| PO | Dropdown (dependiente) | ✅ | No vacío, filtrado por proyecto |
| Proveedor | Text (autofill mock) | ✅ | No vacío |
| Fecha recepción | Date picker | ✅ | No futuro |
| Nº Albarán | Text | ❌ | - |
| Tipo documento | Dropdown | ❌ | Enum: Certificado/Albarán/Factura/Otro |
| Observaciones | Textarea | ❌ | Max 500 chars |

**Validación UX:**
```typescript
// Mensajes de error claros y accionables
const VALIDATION_MESSAGES = {
  proyecto: "Selecciona un proyecto para continuar",
  po: "Selecciona la PO asociada a este certificado",
  proveedor: "Indica el proveedor del certificado",
  fecha: "La fecha de recepción es obligatoria"
};
```

---

### 3. Clasificación y Archivado

**Estructura de Navegación:**

```
📁 Proyectos
├── 📁 P-001: Planta Química Tarragona
│   ├── 📋 PO-4500001 (Tubacex) - 5 docs
│   ├── 📋 PO-4500002 (Acerinox) - 3 docs
│   └── 📋 PO-4500003 (Repsol) - 8 docs
├── 📁 P-002: Refinería Huelva
│   └── ...
```

**Contadores por Nivel:**
- Proyecto: Total POs, Total docs, Pendientes, Incidencias
- PO: Total docs, Pendientes, Incidencias, Urgentes

---

### 4. Búsqueda y Filtros (Clásico)

**Búsqueda Global:**
```typescript
interface SearchParams {
  query: string;  // Texto libre
  filters: {
    proyecto?: string;
    po?: string;
    proveedor?: string;
    estado?: 'pendiente_revision' | 'revisado' | 'incidencia';
    urgencia?: 'normal' | 'urgente';
    fecha_desde?: Date;
    fecha_hasta?: Date;
    aging_dias?: number;  // Pendiente desde X días
  };
}
```

**Chips de Filtro Removibles:**
- Click en ❌ para eliminar filtro individual
- Botón "Limpiar filtros" para reset completo

---

### 5. Búsqueda AI-Assisted (Mock Recomendado)

**Implementación Mock:**
```typescript
// Parser simple con keywords
function parseNaturalQuery(query: string): SearchFilters {
  const filters: SearchFilters = {};
  
  // Detectar proyecto
  const projectMatch = query.match(/proyecto\s+(P-\d+|[\w\s]+)/i);
  if (projectMatch) filters.proyecto = projectMatch[1];
  
  // Detectar proveedor
  const providerMatch = query.match(/proveedor\s+([\w\s]+)/i);
  if (providerMatch) filters.proveedor = providerMatch[1];
  
  // Detectar estado
  if (/pendiente/i.test(query)) filters.estado = 'pendiente_revision';
  if (/urgente/i.test(query)) filters.urgencia = 'urgente';
  
  return filters;
}
```

**UX de Chips Generados:**
```
Input: "certificados pendientes del proyecto P-102, proveedor Tubacex, urgentes"

Chips generados:
[Proyecto: P-102 ❌] [Proveedor: Tubacex ❌] [Estado: Pendiente ❌] [Urgente ❌]

Badge: 🤖 IA (para indicar que fue generado automáticamente)
```

---

### 6. Estados + Urgencia + Aging (Obligatorio)

**Cambio de Estado:**
- Desde lista: Dropdown inline o botones de acción
- Desde detalle: Botones prominentes en header

**Regla de Negocio:**
```typescript
// Si estado = 'incidencia', OBLIGATORIO comentario
if (newState === 'incidencia' && !comment?.trim()) {
  throw new ValidationError("Añade un comentario para la incidencia");
}
```

**Aging Calculation:**
```typescript
function calculateAging(fechaRecepcion: Date): number {
  const today = new Date();
  const diff = today.getTime() - fechaRecepcion.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Display: "Pendiente desde 6 días"
```

---

### 7. Notificaciones (In-App + Email Mock)

**Triggers de Notificación:**
| Evento | Destinatario | Canal |
|--------|--------------|-------|
| Nuevo certificado subido | Owner del proyecto | In-app + Email mock |
| Incidencia creada | Owner del proyecto | In-app + Email mock |
| Estado cambiado a "Incidencia" | Owner del proyecto | In-app + Email mock |

**Bandeja In-App:**
```typescript
interface Notification {
  id: string;
  tipo: 'nuevo_documento' | 'incidencia' | 'estado_cambiado';
  titulo: string;
  descripcion: string;
  objeto_id: string;
  objeto_tipo: 'certificado' | 'po' | 'proyecto';
  leido: boolean;
  created_at: Date;
}
```

**Email Mock:**
- Modal con preview del email
- Dropdown multi-select de destinatarios
- Owner preseleccionado por defecto
- Plantilla auto-generada con subject y body
- Botón "Enviar" → Toast + evento en timeline

---

### 8. Incidencias

**Creación de Incidencia:**
```typescript
interface Incidencia {
  id: string;
  certificado_id?: string;  // Si aplica
  po_id: string;
  proyecto_id: string;
  tipo: 'falta_documento' | 'documento_incorrecto' | 'otro';
  comentario: string;
  urgencia: 'normal' | 'urgente';
  estado: 'abierta' | 'en_curso' | 'cerrada';
  created_at: Date;
  updated_at: Date;
}
```

**Estados de Incidencia:**
```
Abierta → En curso → Cerrada
   │         │          │
   └─────────┴──────────┘
      (Notifica al owner)
```

---

### 9. Dossier / Descarga (Mock)

**Ubicación del Botón:**
- Header de Proyecto
- Header de PO

**Flujo Mock:**
```
1. Click "Descargar dossier"
2. Modal: Selector de alcance
   - [ ] Todo
   - [ ] Solo revisados
   - [ ] Solo pendientes
3. Click "Generar"
4. Toast: "Dossier generado correctamente ✓"
5. Evento en timeline: "Dossier solicitado"
```

---

### 10. Pantalla 0 Resultados (Obligatorio)

**Diseño de Empty State con 3 CTAs:**

```
┌────────────────────────────────────────┐
│                                        │
│     🔍 No se encontraron resultados    │
│                                        │
│  No hay certificados que coincidan     │
│  con tu búsqueda.                      │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 📤 Subir certificado ahora     │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ ⚠️ Crear incidencia            │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ ✉️ Notificar internamente      │    │
│  └────────────────────────────────┘    │
│                                        │
└────────────────────────────────────────┘
```

---

## 🎭 Mock vs Real

### Real (Debe Funcionar)
- ✅ Navegación Proyecto → PO → Certificados
- ✅ Subida manual + validación campos obligatorios
- ✅ Estados / Urgencia / Aging
- ✅ Búsqueda clásica + filtros
- ✅ Pantalla 0 resultados con 3 acciones
- ✅ Bandeja in-app (aunque sea mock data)
- ✅ Event timeline visual

### Mock Permitido
- 🎭 Extracción de proveedor al subir (parser fake)
- 🎭 Búsqueda IA que propone filtros
- 🎭 Envío de email (preview + log)
- 🎭 Descarga dossier (botón + confirmación)
- 🎭 OCR/IDP (solo heurísticas simples)

### Fuera de Alcance v1
- ❌ Ingesta por email real
- ❌ Integración con Navision/Dynamics
- ❌ Generación automática de colada corta
- ❌ OCR/IDP con precisión real
- ❌ Automatización de seguimiento con sistemas externos

---

## 📊 Checklist de Implementación

### Fase 1: Setup y Datos (Día 1)
- [ ] Configurar proyecto Next.js + TypeScript + Tailwind
- [ ] Crear estructura de carpetas
- [ ] Implementar mock data (proyectos, POs, certificados)
- [ ] Crear tipos TypeScript para todos los modelos
- [ ] Configurar estado global (Zustand/Context)

### Fase 2: Navegación Core (Día 2)
- [ ] Layout base (sidebar + header + content)
- [ ] Lista de Proyectos
- [ ] Ficha de Proyecto con tabs
- [ ] Lista de POs dentro de proyecto
- [ ] Ficha de PO con tabs

### Fase 3: Certificados (Día 3)
- [ ] Pantalla de subida con drag & drop
- [ ] Mock de extracción de proveedor
- [ ] Formulario con validación
- [ ] Lista de certificados con filtros
- [ ] Detalle de certificado (drawer)

### Fase 4: Features Avanzados (Día 4)
- [ ] Búsqueda global con filtros
- [ ] Búsqueda AI mock
- [ ] Sistema de incidencias
- [ ] Notificaciones in-app
- [ ] Email mock

### Fase 5: Polish (Día 5)
- [ ] Empty states cuidados
- [ ] Timelines visuales
- [ ] Dossier mock
- [ ] Testing de flujos completos
- [ ] Ajustes finales de UX

---

## 🔑 Criterios de Éxito

1. **Entendimiento del problema**: El usuario de Calidad puede gestionar certificados sin Excel
2. **UX/UI**: Demo que impresiona, limpia, "industrial" pero con gusto
3. **Robustez**: Sin errores de navegación, estados consistentes
4. **Priorización**: Mejor 6 features excelentes que 12 a medias
5. **Mock convincente**: Las partes mockeadas enseñan valor real

---

*Siguiente: [PLAN-02-DISEÑO.md](./PLAN-02-DISEÑO.md) - Diseño y Layouts*


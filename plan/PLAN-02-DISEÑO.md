# Plan de Desarrollo - Parte 2: Diseño y Layouts

## 🎨 Visión de Diseño

El diseño debe transmitir **profesionalismo industrial** con un toque moderno y accesible. Referencia principal: [Portal de Proveedores Cunext](https://portal-proveedores-nu.vercel.app/#/).

---

## 🎯 Principios de Diseño

| Principio | Descripción |
|-----------|-------------|
| **Claridad** | Información jerárquica, sin ruido visual |
| **Industrial-Moderno** | Estética seria pero no anticuada |
| **Accionable** | Todo elemento importante tiene un CTA visible |
| **Consistente** | Mismos patrones en toda la app |
| **Demo-Friendly** | Animaciones sutiles que impresionen |

---

## 🌈 Sistema de Diseño

### Paleta de Colores

```css
:root {
  /* Primarios - Inspirado en el portal de referencia */
  --primary-500: #1E3A5F;      /* Azul oscuro principal */
  --primary-600: #15293F;      /* Azul más oscuro (hover) */
  --primary-400: #2D5A8A;      /* Azul medio */
  
  /* Acentos - Copper/Naranja para CTAs */
  --accent-500: #D97706;       /* Naranja/Cobre */
  --accent-600: #B45309;       /* Naranja oscuro (hover) */
  --accent-100: #FEF3C7;       /* Naranja claro (bg) */
  
  /* Neutros */
  --gray-50: #F8FAFC;          /* Fondo principal */
  --gray-100: #F1F5F9;         /* Fondo cards */
  --gray-200: #E2E8F0;         /* Borders */
  --gray-300: #CBD5E1;         /* Borders hover */
  --gray-400: #94A3B8;         /* Texto secundario */
  --gray-500: #64748B;         /* Texto label */
  --gray-600: #475569;         /* Texto body */
  --gray-700: #334155;         /* Texto heading */
  --gray-900: #0F172A;         /* Texto principal */
  
  /* Estados */
  --success-500: #22C55E;      /* Verde éxito */
  --success-100: #DCFCE7;      /* Verde bg */
  --warning-500: #F59E0B;      /* Amarillo warning */
  --warning-100: #FEF3C7;      /* Amarillo bg */
  --error-500: #EF4444;        /* Rojo error */
  --error-100: #FEE2E2;        /* Rojo bg */
  --info-500: #3B82F6;         /* Azul info */
  --info-100: #DBEAFE;         /* Azul bg */
}
```

### Tipografía

```css
/* Font Stack - Inter como en el portal de referencia */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Sizes */
--text-xs: 0.75rem;     /* 12px - Labels pequeños */
--text-sm: 0.875rem;    /* 14px - Body small */
--text-base: 1rem;      /* 16px - Body */
--text-lg: 1.125rem;    /* 18px - Body large */
--text-xl: 1.25rem;     /* 20px - Heading small */
--text-2xl: 1.5rem;     /* 24px - Heading */
--text-3xl: 1.875rem;   /* 30px - Page title */
--text-4xl: 2.25rem;    /* 36px - Hero */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Espaciado

```css
/* Espaciado consistente - 4px base */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

### Sombras

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius: 0.5rem;       /* 8px */
--radius-md: 0.625rem;  /* 10px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Pills */
```

---

## 📐 Layout Base

### Estructura Global

```
┌─────────────────────────────────────────────────────────┐
│                    TOPBAR (56px)                        │
│  [Logo]        [Selector Proyecto ▼]  [🔍 Buscar...]  [🔔5] [Avatar] │
├────────────┬────────────────────────────────────────────┤
│            │                                            │
│  SIDEBAR   │              CONTENT AREA                  │
│  (240px)   │                                            │
│            │  ┌──────────────────────────────────────┐  │
│  • Inicio  │  │         Page Header                  │  │
│  • Proyectos│  │  Título + Breadcrumb + Actions      │  │
│  • Certific.│  └──────────────────────────────────────┘  │
│  • Incidenc.│                                            │
│  • Config   │  ┌──────────────────────────────────────┐  │
│            │  │                                      │  │
│            │  │         Main Content                 │  │
│            │  │                                      │  │
│            │  │                                      │  │
│            │  └──────────────────────────────────────┘  │
│            │                                            │
│  ┌────────┐│                                            │
│  │ Usuario ││                                            │
│  │ Perfil  ││                                            │
│  └────────┘│                                            │
└────────────┴────────────────────────────────────────────┘
```

### Topbar

```tsx
// Componentes del Topbar
<header className="h-14 border-b bg-white flex items-center px-4 gap-4">
  {/* Logo + Collapse toggle */}
  <div className="flex items-center gap-3">
    <button onClick={toggleSidebar}>
      <ChevronIcon />
    </button>
    <Logo />
  </div>
  
  {/* Breadcrumb */}
  <Breadcrumb items={breadcrumbItems} />
  
  {/* Spacer */}
  <div className="flex-1" />
  
  {/* Search */}
  <SearchInput placeholder="Buscar proveedor, PO, albarán..." shortcut="⌘K" />
  
  {/* Notifications */}
  <NotificationBell count={6} />
  
  {/* User Menu */}
  <UserMenu />
</header>
```

### Sidebar

```tsx
<aside className="w-60 border-r bg-white flex flex-col">
  {/* Logo */}
  <div className="p-4 border-b">
    <Logo size="lg" />
  </div>
  
  {/* Navigation */}
  <nav className="flex-1 p-3">
    <NavItem href="/inicio" icon={HomeIcon} label="Inicio" />
    <NavItem href="/proyectos" icon={FolderIcon} label="Proyectos" />
    <NavItem href="/certificados" icon={FileIcon} label="Certificados" />
    <NavItem href="/incidencias" icon={AlertIcon} label="Incidencias" badge={3} />
    <NavItem href="/configuracion" icon={SettingsIcon} label="Configuración" />
  </nav>
  
  {/* User Profile */}
  <div className="p-3 border-t">
    <UserCard user={currentUser} />
  </div>
</aside>
```

---

## 🧱 Componentes UI

### 1. Badges / Pills

```tsx
// Estado de Certificado
<Badge variant="warning">Pendiente</Badge>    // Amarillo
<Badge variant="success">Revisado</Badge>     // Verde
<Badge variant="error">Incidencia</Badge>     // Rojo

// Urgencia
<Badge variant="default">Normal</Badge>       // Gris
<Badge variant="error" pulse>Urgente</Badge>  // Rojo con pulso

// Tags especiales
<Badge variant="info" icon={<AIIcon />}>IA</Badge>    // Azul con icono
<Badge variant="purple" icon={<MockIcon />}>Mock</Badge>  // Púrpura
```

**Implementación:**
```tsx
const badgeVariants = {
  default: "bg-gray-100 text-gray-700 border-gray-200",
  success: "bg-success-100 text-success-700 border-success-200",
  warning: "bg-warning-100 text-warning-700 border-warning-200",
  error: "bg-error-100 text-error-700 border-error-200",
  info: "bg-info-100 text-info-700 border-info-200",
};

function Badge({ variant, pulse, icon, children }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
      badgeVariants[variant],
      pulse && "animate-pulse"
    )}>
      {icon}
      {children}
    </span>
  );
}
```

### 2. Cards

```tsx
// Card Base
<Card className="p-6">
  <Card.Header>
    <Card.Title>Título</Card.Title>
    <Card.Description>Descripción opcional</Card.Description>
  </Card.Header>
  <Card.Content>
    {/* Contenido */}
  </Card.Content>
  <Card.Footer>
    {/* Acciones */}
  </Card.Footer>
</Card>

// Stats Card (KPI)
<StatsCard
  title="Pendientes"
  value={15}
  icon={<ClockIcon />}
  trend="+3 esta semana"
  variant="warning"
/>
```

### 3. Tablas

```tsx
<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head>Nº PO</Table.Head>
      <Table.Head>Proveedor</Table.Head>
      <Table.Head>Docs</Table.Head>
      <Table.Head>Estado</Table.Head>
      <Table.Head>Fecha</Table.Head>
      <Table.Head></Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {pos.map((po) => (
      <Table.Row key={po.id} onClick={() => navigate(`/po/${po.id}`)}>
        <Table.Cell className="font-medium">{po.numero}</Table.Cell>
        <Table.Cell>{po.proveedor}</Table.Cell>
        <Table.Cell>
          <Badge>{po.totalDocs}</Badge>
        </Table.Cell>
        <Table.Cell>
          <StatusBadge status={po.estado} />
        </Table.Cell>
        <Table.Cell className="text-gray-500">{formatDate(po.fecha)}</Table.Cell>
        <Table.Cell>
          <ChevronRightIcon className="text-gray-400" />
        </Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

**Estilos de Tabla:**
```css
/* Filas hover */
.table-row:hover {
  background-color: var(--gray-50);
  cursor: pointer;
}

/* Bordes sutiles */
.table-cell {
  border-bottom: 1px solid var(--gray-100);
  padding: var(--space-4);
}
```

### 4. Modales y Drawers

```tsx
// Modal estándar
<Modal open={open} onClose={onClose}>
  <Modal.Header>
    <Modal.Title>Enviar notificación</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>
    {/* Contenido */}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="outline" onClick={onClose}>Cancelar</Button>
    <Button variant="primary" onClick={onSubmit}>Enviar</Button>
  </Modal.Footer>
</Modal>

// Drawer lateral (para detalle de certificado)
<Drawer open={open} onClose={onClose} side="right" size="lg">
  <Drawer.Header>
    <Drawer.Title>Certificado #12345</Drawer.Title>
    <Drawer.CloseButton />
  </Drawer.Header>
  <Drawer.Body>
    {/* Preview + Metadatos */}
  </Drawer.Body>
</Drawer>
```

### 5. Formularios

```tsx
// Input con label
<FormField>
  <FormLabel required>Proyecto</FormLabel>
  <Select value={proyecto} onChange={setProyecto}>
    <SelectTrigger>
      <SelectValue placeholder="Selecciona proyecto" />
    </SelectTrigger>
    <SelectContent>
      {proyectos.map((p) => (
        <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
      ))}
    </SelectContent>
  </Select>
  {errors.proyecto && (
    <FormError>{errors.proyecto}</FormError>
  )}
</FormField>

// Drag & Drop zone
<DropZone
  accept={[".pdf", ".jpg", ".jpeg", ".png"]}
  onDrop={handleFileDrop}
  className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center"
>
  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
  <p className="mt-4 text-lg font-medium">Suelta aquí el PDF o foto</p>
  <p className="mt-2 text-sm text-gray-500">o haz click para seleccionar</p>
</DropZone>
```

### 6. Timeline de Eventos

```tsx
<Timeline>
  {events.map((event, idx) => (
    <Timeline.Item key={event.id}>
      <Timeline.Icon variant={event.type}>
        {getEventIcon(event.type)}
      </Timeline.Icon>
      <Timeline.Content>
        <Timeline.Time>{formatDateTime(event.timestamp)}</Timeline.Time>
        <Timeline.Title>{event.title}</Timeline.Title>
        <Timeline.Description>
          {event.description}
          {event.link && (
            <Timeline.Link href={event.link}>Ver detalle →</Timeline.Link>
          )}
        </Timeline.Description>
        <Timeline.Actor>
          <Avatar size="xs" src={event.actor.avatar} />
          <span>{event.actor.nombre}</span>
        </Timeline.Actor>
      </Timeline.Content>
    </Timeline.Item>
  ))}
</Timeline>
```

---

## 📄 Layouts de Página

### 8.2.1 Lista de Proyectos

```
┌────────────────────────────────────────────────────────────┐
│  Proyectos                           [Subir certificado ↑] │
│  Gestiona tus proyectos activos                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────┐                                       │
│  │ 🔍 Buscar...    │  [Con pendientes ▼] [Con incidencias]│
│  └─────────────────┘                                       │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ NOMBRE          │ OWNER    │ POs │ DOCS │ PEND │ INC │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Planta Química  │ 👤 Mónica│  8  │  45  │  5   │  2  │→ │
│  │ Tarragona       │          │     │      │ ⚠️   │ 🔴  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Refinería       │ 👤 Porfi │  5  │  23  │  0   │  0  │→ │
│  │ Huelva          │          │     │      │ ✓    │ ✓   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 8.2.2 Ficha de Proyecto

```
┌────────────────────────────────────────────────────────────┐
│  ← Proyectos / Planta Química Tarragona                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Planta Química Tarragona                                  │
│  👤 Owner: Mónica García  [Cambiar]                        │
│                                                            │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                   │
│  │  8   │  │  45  │  │  5   │  │  2   │                   │
│  │ POs  │  │ Docs │  │ Pend.│  │ Inc. │                   │
│  └──────┘  └──────┘  └──────┘  └──────┘                   │
│                                                            │
│  [📤 Subir certificado]  [📥 Descargar dossier]           │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Overview  │  Timeline  │  Incidencias              │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │  POs del proyecto                                   │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │ PO-4500001 │ Tubacex  │ 5 docs │ 2 pend │ → │  │   │
│  │  │ PO-4500002 │ Acerinox │ 3 docs │ 0 pend │ → │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │                                                     │   │
│  │  ──── Pendientes críticos ────                      │   │
│  │  • Cert. #123 - Urgente - 8 días                   │   │
│  │  • Cert. #124 - Normal - 12 días                   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 8.4.2 Detalle Certificado (Drawer)

```
┌──────────────────────────────────────────┐
│  ← Certificado-2024-001.pdf          ✕   │
├──────────────────────────────────────────┤
│                                          │
│  [P-001] [PO-4500001]                    │
│                                          │
│  Estado: [Pendiente ▼]  [🔴 Urgente]     │
│                                          │
│  ┌───────────────────────────────────┐   │
│  │                                   │   │
│  │       📄 PREVIEW PDF              │   │
│  │                                   │   │
│  │                                   │   │
│  └───────────────────────────────────┘   │
│                                          │
│  ── Metadatos ──                         │
│  Proveedor: Tubacex S.A.                 │
│  Nº Albarán: ALB-2024-001               │
│  Tipo: Certificado                       │
│  Fecha recepción: 15/01/2024             │
│  Aging: Pendiente desde 6 días          │
│                                          │
│  ┌─────────────────────────────────┐     │
│  │ 🤖 Proveedor detectado: Tubacex │     │
│  │ [Mock]                          │     │
│  └─────────────────────────────────┘     │
│                                          │
│  ── Timeline ──                          │
│  • 15/01 - Documento subido por Juan     │
│  • 15/01 - Proveedor detectado (IA)      │
│                                          │
├──────────────────────────────────────────┤
│  [✓ Marcar revisado] [⚠️ Incidencia] [✉️]│
└──────────────────────────────────────────┘
```

### 8.5 Subir Certificado

```
┌────────────────────────────────────────────────────────────┐
│  ← Certificados / Subir certificado                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Subir nuevo certificado                                   │
│  Sube un PDF o imagen del certificado de calidad          │
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │                                                    │    │
│  │      ┌────────────────────────────────┐           │    │
│  │      │                                │           │    │
│  │      │    📤 Suelta aquí el PDF       │           │    │
│  │      │       o foto                   │           │    │
│  │      │                                │           │    │
│  │      │   o haz click para seleccionar │           │    │
│  │      │                                │           │    │
│  │      └────────────────────────────────┘           │    │
│  │                                                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  ┌─────────────────────┐  ┌─────────────────────┐         │
│  │ Proyecto *          │  │ PO *                │         │
│  │ [Selecciona... ▼]   │  │ [Selecciona... ▼]  │         │
│  └─────────────────────┘  └─────────────────────┘         │
│                                                            │
│  ┌─────────────────────────────────────────────────┐      │
│  │ Proveedor *                                     │      │
│  │ [Tubacex S.A.]  🤖 Detectado automáticamente   │      │
│  └─────────────────────────────────────────────────┘      │
│                                                            │
│  ┌─────────────────────┐  ┌─────────────────────┐         │
│  │ Fecha recepción *   │  │ Nº Albarán          │         │
│  │ [📅 15/01/2024]     │  │ [ALB-...]           │         │
│  └─────────────────────┘  └─────────────────────┘         │
│                                                            │
│  ┌─────────────────────────────────────────────────┐      │
│  │ Observaciones                                   │      │
│  │ [                                           ]   │      │
│  └─────────────────────────────────────────────────┘      │
│                                                            │
│                          [Cancelar]  [Guardar certificado] │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Empty State (0 Resultados)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                          🔍                                │
│                                                            │
│              No se encontraron resultados                  │
│                                                            │
│     No hay certificados que coincidan con tu búsqueda.    │
│                                                            │
│     ┌────────────────────────────────────────┐            │
│     │  📤  Subir certificado ahora           │  →         │
│     └────────────────────────────────────────┘            │
│                                                            │
│     ┌────────────────────────────────────────┐            │
│     │  ⚠️  Crear incidencia por falta       │  →         │
│     └────────────────────────────────────────┘            │
│                                                            │
│     ┌────────────────────────────────────────┐            │
│     │  ✉️  Notificar internamente           │  →         │
│     └────────────────────────────────────────┘            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🎬 Animaciones y Micro-interacciones

### Transiciones Globales

```css
/* Transiciones suaves para todos los elementos interactivos */
.interactive {
  transition: all 0.15s ease-out;
}

/* Hover en filas de tabla */
.table-row {
  transition: background-color 0.1s ease;
}

/* Fade in para contenido */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
```

### Micro-interacciones Clave

| Elemento | Interacción | Efecto |
|----------|-------------|--------|
| Botón primario | Hover | Scale 1.02 + sombra |
| Badge urgente | Siempre | Pulse suave |
| Notificación | Aparece | Slide in desde arriba |
| Toast | Aparece | Slide in + auto-dismiss |
| Drawer | Abre | Slide desde derecha + overlay |
| Modal | Abre | Scale + fade overlay |
| Drop zone | Drag over | Border color + scale |

### Loading States

```tsx
// Skeleton para tablas
<TableSkeleton rows={5} cols={6} />

// Spinner inline
<Button loading>Guardando...</Button>

// Progress para upload
<UploadProgress progress={65} filename="certificado.pdf" />

// Mock extraction loader
<div className="flex items-center gap-3">
  <Spinner size="sm" />
  <span className="text-sm text-gray-600">Leyendo documento...</span>
</div>
```

---

## 📱 Responsive (Desktop-First)

| Breakpoint | Comportamiento |
|------------|----------------|
| `xl` (1280px+) | Layout completo |
| `lg` (1024px) | Sidebar colapsable |
| `md` (768px) | Sidebar hidden, hamburger menu |
| `sm` (640px) | Cards stack, tablas scroll horizontal |

---

## 🌙 Tema Claro (v1)

Para v1, solo tema claro. Variables preparadas para dark mode futuro:

```css
[data-theme="light"] {
  --bg-primary: var(--gray-50);
  --bg-secondary: white;
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-600);
}

/* Preparado para futuro */
[data-theme="dark"] {
  --bg-primary: var(--gray-900);
  --bg-secondary: var(--gray-800);
  --text-primary: var(--gray-100);
  --text-secondary: var(--gray-400);
}
```

---

## ✅ Checklist de Componentes

### Core
- [ ] Button (primary, secondary, outline, ghost, destructive)
- [ ] Badge / Pill (estados, urgencia, tags)
- [ ] Card (base, stats, action)
- [ ] Input / Textarea
- [ ] Select / Combobox
- [ ] Checkbox / Radio
- [ ] DatePicker

### Layout
- [ ] AppShell (sidebar + header + content)
- [ ] Sidebar con navegación
- [ ] Header con búsqueda y notificaciones
- [ ] Breadcrumbs
- [ ] Page header

### Data Display
- [ ] Table con sorting y acciones
- [ ] List / ListView
- [ ] Timeline
- [ ] Avatar / AvatarGroup
- [ ] Empty state

### Feedback
- [ ] Modal / Dialog
- [ ] Drawer / Sheet
- [ ] Toast / Notification
- [ ] Tooltip
- [ ] Progress / Spinner

### Específicos
- [ ] DropZone para upload
- [ ] PDFPreview
- [ ] FilterChips
- [ ] NotificationBell
- [ ] UserMenu
- [ ] SearchCommand (⌘K)

---

*Siguiente: [PLAN-03-USER-FLOWS.md](./PLAN-03-USER-FLOWS.md) - User Flows e Implementación*


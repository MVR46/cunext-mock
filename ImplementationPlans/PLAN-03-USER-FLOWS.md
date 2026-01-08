# Plan de Desarrollo - Parte 3: User Flows e Implementación

## 🗺️ Mapa de Navegación

```
                                    ┌─────────────────┐
                                    │      HOME       │
                                    │   Dashboard     │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
                    ▼                        ▼                        ▼
          ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
          │   PROYECTOS     │      │  CERTIFICADOS   │      │  INCIDENCIAS    │
          │     Lista       │      │     Lista       │      │     Lista       │
          └────────┬────────┘      └────────┬────────┘      └────────┬────────┘
                   │                        │                        │
                   ▼                        │                        │
          ┌─────────────────┐               │                        │
          │    PROYECTO     │               │                        │
          │    Detalle      │◄──────────────┤                        │
          └────────┬────────┘               │                        │
                   │                        │                        │
                   ▼                        │                        │
          ┌─────────────────┐               │                        │
          │       PO        │               │                        │
          │    Detalle      │◄──────────────┘                        │
          └────────┬────────┘                                        │
                   │                                                 │
                   ▼                                                 │
          ┌─────────────────┐                                        │
          │  CERTIFICADO    │────────────────────────────────────────┘
          │    Detalle      │
          └─────────────────┘
```

---

## 🏠 Flow 1: Home / Dashboard

### Objetivo
Vista accionable de "qué tengo pendiente" con acceso en 1 click al trabajo.

### Implementación

```tsx
// /app/page.tsx (o /app/inicio/page.tsx)
export default function HomePage() {
  const { pendingProjects, recentNotifications, stats } = useDashboardData();
  
  return (
    <PageLayout title="Inicio" subtitle="Buenos días, Juan">
      <div className="grid grid-cols-12 gap-6">
        {/* KPIs Row */}
        <div className="col-span-12 grid grid-cols-4 gap-4">
          <StatsCard
            title="Pendientes aprobación"
            value={stats.pendientes}
            icon={<ClockIcon />}
            onClick={() => navigate('/certificados?estado=pendiente')}
          />
          <StatsCard
            title="Incidencias abiertas"
            value={stats.incidencias}
            icon={<AlertIcon />}
            variant="error"
            onClick={() => navigate('/incidencias?estado=abierta')}
          />
          <StatsCard
            title="Proyectos activos"
            value={stats.proyectos}
            icon={<FolderIcon />}
          />
          <StatsCard
            title="Docs este mes"
            value={stats.docsEsteMes}
            icon={<FileIcon />}
          />
        </div>
        
        {/* Main Content */}
        <div className="col-span-8 space-y-6">
          {/* Proyectos con pendientes */}
          <Card>
            <Card.Header>
              <Card.Title>Proyectos con pendientes</Card.Title>
            </Card.Header>
            <Card.Content>
              <ProjectPendingList projects={pendingProjects} />
            </Card.Content>
          </Card>
          
          {/* Accesos rápidos */}
          <div className="grid grid-cols-3 gap-4">
            <QuickActionCard
              icon={<UploadIcon />}
              title="Subir certificado"
              href="/certificados/subir"
            />
            <QuickActionCard
              icon={<SearchIcon />}
              title="Buscar certificados"
              href="/certificados"
            />
            <QuickActionCard
              icon={<AlertIcon />}
              title="Ver incidencias"
              href="/incidencias"
            />
          </div>
        </div>
        
        {/* Sidebar - Notificaciones */}
        <div className="col-span-4">
          <Card>
            <Card.Header>
              <Card.Title>Actividad reciente</Card.Title>
            </Card.Header>
            <Card.Content>
              <NotificationsList
                notifications={recentNotifications}
                maxItems={5}
              />
            </Card.Content>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
```

### Interacciones Clave

| Acción | Resultado |
|--------|-----------|
| Click en "Pendientes" de proyecto | → Proyecto > POs filtrado a POs con pendientes |
| Click en "Urgentes" | → Certificados > Lista con filtro Urgente=Sí |
| Click en notificación | → Deep link a Certificado o PO |
| Click "Subir certificado" | → Modal/Página de subida |

---

## 📁 Flow 2: Proyectos

### 2.1 Lista de Proyectos

```tsx
// /app/proyectos/page.tsx
export default function ProyectosPage() {
  const { projects, filters, setFilters } = useProjects();
  
  return (
    <PageLayout
      title="Proyectos"
      subtitle="Gestiona tus proyectos activos"
      actions={
        <Button onClick={() => openUploadModal()}>
          <UploadIcon /> Subir certificado
        </Button>
      }
    >
      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <SearchInput
          placeholder="Buscar proyecto..."
          value={filters.search}
          onChange={(v) => setFilters({ ...filters, search: v })}
        />
        <FilterDropdown
          label="Owner"
          options={owners}
          value={filters.owner}
          onChange={(v) => setFilters({ ...filters, owner: v })}
        />
        <FilterChip
          active={filters.conPendientes}
          onClick={() => setFilters({ ...filters, conPendientes: !filters.conPendientes })}
        >
          Con pendientes
        </FilterChip>
        <FilterChip
          active={filters.conIncidencias}
          onClick={() => setFilters({ ...filters, conIncidencias: !filters.conIncidencias })}
        >
          Con incidencias
        </FilterChip>
      </div>
      
      {/* Tabla */}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Proyecto</Table.Head>
            <Table.Head>Owner</Table.Head>
            <Table.Head>POs</Table.Head>
            <Table.Head>Certificados</Table.Head>
            <Table.Head>Pendientes</Table.Head>
            <Table.Head>Incidencias</Table.Head>
            <Table.Head></Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {projects.map((project) => (
            <Table.Row
              key={project.id}
              onClick={() => navigate(`/proyectos/${project.id}`)}
            >
              <Table.Cell className="font-medium">{project.nombre}</Table.Cell>
              <Table.Cell>
                <UserBadge user={project.owner} />
              </Table.Cell>
              <Table.Cell>{project.totalPOs}</Table.Cell>
              <Table.Cell>{project.totalCerts}</Table.Cell>
              <Table.Cell>
                <Badge variant={project.pendientes > 0 ? 'warning' : 'success'}>
                  {project.pendientes}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge variant={project.incidencias > 0 ? 'error' : 'success'}>
                  {project.incidencias}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <ChevronRight className="text-gray-400" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </PageLayout>
  );
}
```

### 2.2 Detalle de Proyecto

```tsx
// /app/proyectos/[id]/page.tsx
export default function ProyectoDetallePage({ params }) {
  const { project, pos, timeline, incidencias } = useProyecto(params.id);
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Proyectos', href: '/proyectos' },
        { label: project.nombre }
      ]}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.nombre}</h1>
          <div className="flex items-center gap-2 mt-2">
            <UserBadge user={project.owner} />
            <Button variant="ghost" size="sm">Cambiar owner</Button>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => openUploadModal(project.id)}>
            <UploadIcon /> Subir certificado
          </Button>
          <Button variant="outline" onClick={() => downloadDossier(project.id)}>
            <DownloadIcon /> Descargar dossier
          </Button>
        </div>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MiniStatCard label="POs activas" value={project.totalPOs} />
        <MiniStatCard label="Docs totales" value={project.totalCerts} />
        <MiniStatCard label="Pendientes" value={project.pendientes} variant="warning" />
        <MiniStatCard label="Incidencias" value={project.incidencias} variant="error" />
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="timeline">Timeline</Tabs.Trigger>
          <Tabs.Trigger value="incidencias">
            Incidencias
            {project.incidencias > 0 && (
              <Badge variant="error" className="ml-2">{project.incidencias}</Badge>
            )}
          </Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="overview">
          <div className="grid grid-cols-3 gap-6">
            {/* POs del proyecto */}
            <div className="col-span-2">
              <POsTable pos={pos} projectId={project.id} />
            </div>
            
            {/* Pendientes críticos */}
            <div>
              <Card>
                <Card.Header>
                  <Card.Title>Pendientes críticos</Card.Title>
                </Card.Header>
                <Card.Content>
                  <CriticalPendingList projectId={project.id} />
                </Card.Content>
              </Card>
            </div>
          </div>
        </Tabs.Content>
        
        <Tabs.Content value="timeline">
          <Timeline events={timeline} />
        </Tabs.Content>
        
        <Tabs.Content value="incidencias">
          <IncidenciasTable incidencias={incidencias} />
        </Tabs.Content>
      </Tabs>
    </PageLayout>
  );
}
```

---

## 📋 Flow 3: POs (Pedidos de Compra)

### 3.1 Lista de POs (dentro de Proyecto)

Ya incluida en el tab Overview del proyecto.

### 3.2 Detalle de PO

```tsx
// /app/pos/[id]/page.tsx
export default function PODetallePage({ params }) {
  const { po, certificados, timeline, incidencias } = usePO(params.id);
  const [activeTab, setActiveTab] = useState('certificados');
  const [selectedCert, setSelectedCert] = useState(null);
  
  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Proyectos', href: '/proyectos' },
        { label: po.proyecto.nombre, href: `/proyectos/${po.proyecto.id}` },
        { label: `PO ${po.numero}` }
      ]}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">PO {po.numero}</h1>
          <p className="text-gray-500">{po.proveedor}</p>
        </div>
        
        {/* Status Pills */}
        <div className="flex gap-2">
          <StatusPill label="Pendientes" value={po.pendientes} variant="warning" />
          <StatusPill label="Incidencias" value={po.incidencias} variant="error" />
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => openUploadModal(null, po.id)}>
            <UploadIcon /> Subir certificado
          </Button>
          <Button variant="outline" onClick={() => downloadDossier(null, po.id)}>
            <DownloadIcon /> Descargar dossier
          </Button>
          <Button variant="ghost" onClick={() => openNotifyModal(po)}>
            <MailIcon /> Notificar owner
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="certificados">Certificados</Tabs.Trigger>
          <Tabs.Trigger value="timeline">Timeline</Tabs.Trigger>
          <Tabs.Trigger value="incidencias">Incidencias</Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="certificados">
          <CertificadosTable
            certificados={certificados}
            onSelect={setSelectedCert}
            onStatusChange={handleStatusChange}
            onCreateIncidencia={handleCreateIncidencia}
          />
        </Tabs.Content>
        
        <Tabs.Content value="timeline">
          <Timeline events={timeline} />
        </Tabs.Content>
        
        <Tabs.Content value="incidencias">
          <IncidenciasTable incidencias={incidencias} />
        </Tabs.Content>
      </Tabs>
      
      {/* Drawer de detalle de certificado */}
      <CertificadoDrawer
        certificado={selectedCert}
        open={!!selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </PageLayout>
  );
}
```

---

## 📄 Flow 4: Certificados

### 4.1 Lista Global de Certificados

```tsx
// /app/certificados/page.tsx
export default function CertificadosPage() {
  const { certificados, filters, setFilters, isLoading } = useCertificados();
  const [selectedCert, setSelectedCert] = useState(null);
  const [aiQuery, setAiQuery] = useState('');
  
  return (
    <PageLayout
      title="Certificados"
      subtitle="Busca y gestiona todos los certificados"
      actions={
        <Button onClick={() => navigate('/certificados/subir')}>
          <UploadIcon /> Subir certificado
        </Button>
      }
    >
      {/* Búsqueda AI */}
      <Card className="mb-6 p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder='Ej: "certificados pendientes del proyecto P-102, proveedor Tubacex, urgentes"'
              value={aiQuery}
              onChange={setAiQuery}
              icon={<SparklesIcon className="text-purple-500" />}
            />
          </div>
          <Button onClick={() => applyAIFilters(aiQuery)}>
            <SparklesIcon /> Aplicar IA
          </Button>
        </div>
        
        {/* Chips de filtros generados */}
        {filters.aiGenerated && (
          <div className="mt-3 flex gap-2 items-center">
            <Badge variant="info" icon={<AIIcon />}>IA</Badge>
            {Object.entries(filters.active).map(([key, value]) => (
              <FilterChip
                key={key}
                onRemove={() => removeFilter(key)}
              >
                {key}: {value}
              </FilterChip>
            ))}
          </div>
        )}
      </Card>
      
      {/* Filtros clásicos */}
      <div className="flex flex-wrap gap-4 mb-6">
        <SearchInput
          placeholder="Buscar por proveedor, PO, albarán..."
          value={filters.search}
          onChange={(v) => setFilters({ ...filters, search: v })}
        />
        <FilterDropdown
          label="Proyecto"
          options={proyectos}
          value={filters.proyecto}
          onChange={(v) => setFilters({ ...filters, proyecto: v })}
        />
        <FilterDropdown
          label="Estado"
          options={estados}
          value={filters.estado}
          onChange={(v) => setFilters({ ...filters, estado: v })}
        />
        <FilterDropdown
          label="Urgencia"
          options={urgencias}
          value={filters.urgencia}
          onChange={(v) => setFilters({ ...filters, urgencia: v })}
        />
        <FilterDropdown
          label="Aging"
          options={[
            { value: '7', label: '> 7 días' },
            { value: '14', label: '> 14 días' },
            { value: '30', label: '> 30 días' },
          ]}
          value={filters.aging}
          onChange={(v) => setFilters({ ...filters, aging: v })}
        />
        <DateRangePicker
          value={filters.dateRange}
          onChange={(v) => setFilters({ ...filters, dateRange: v })}
        />
      </div>
      
      {/* Chips activos */}
      <ActiveFiltersBar filters={filters} onClear={clearFilters} onRemove={removeFilter} />
      
      {/* Resultados */}
      {certificados.length === 0 ? (
        <EmptyState
          icon={<SearchIcon />}
          title="No se encontraron resultados"
          description="No hay certificados que coincidan con tu búsqueda."
          actions={[
            {
              label: 'Subir certificado ahora',
              icon: <UploadIcon />,
              onClick: () => navigate('/certificados/subir'),
            },
            {
              label: 'Crear incidencia',
              icon: <AlertIcon />,
              onClick: () => openCreateIncidenciaModal(),
            },
            {
              label: 'Notificar internamente',
              icon: <MailIcon />,
              onClick: () => openNotifyModal(),
            },
          ]}
        />
      ) : (
        <CertificadosTable
          certificados={certificados}
          onSelect={setSelectedCert}
        />
      )}
      
      {/* Drawer */}
      <CertificadoDrawer
        certificado={selectedCert}
        open={!!selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </PageLayout>
  );
}
```

### 4.2 Subir Certificado

```tsx
// /app/certificados/subir/page.tsx
export default function SubirCertificadoPage() {
  const [step, setStep] = useState<'upload' | 'extracting' | 'form'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState(null);
  const [formData, setFormData] = useState({
    proyecto: '',
    po: '',
    proveedor: '',
    fechaRecepcion: new Date(),
    nroAlbaran: '',
    tipoDocumento: 'certificado',
    observaciones: '',
  });
  const [errors, setErrors] = useState({});
  
  const handleFileDrop = async (files: File[]) => {
    const file = files[0];
    setFile(file);
    setStep('extracting');
    
    // Mock extraction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockExtracted = {
      proveedor: 'Tubacex S.A.',
      confidence: 0.85,
    };
    
    setExtractedData(mockExtracted);
    setFormData(prev => ({
      ...prev,
      proveedor: mockExtracted.proveedor,
    }));
    setStep('form');
  };
  
  const handleSubmit = async () => {
    // Validación
    const newErrors = {};
    if (!formData.proyecto) newErrors.proyecto = 'Selecciona un proyecto';
    if (!formData.po) newErrors.po = 'Selecciona la PO';
    if (!formData.proveedor) newErrors.proveedor = 'Indica el proveedor';
    if (!formData.fechaRecepcion) newErrors.fechaRecepcion = 'Fecha obligatoria';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Guardar
    await saveCertificado({ ...formData, file });
    
    // Toast + redirect
    toast.success('Certificado guardado correctamente');
    navigate(`/pos/${formData.po}`);
  };
  
  return (
    <PageLayout
      title="Subir certificado"
      subtitle="Sube un PDF o imagen del certificado de calidad"
      breadcrumbs={[
        { label: 'Certificados', href: '/certificados' },
        { label: 'Subir' }
      ]}
    >
      <Card className="max-w-3xl mx-auto">
        <Card.Content className="p-8">
          {step === 'upload' && (
            <DropZone
              accept={['.pdf', '.jpg', '.jpeg', '.png']}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center hover:border-primary-400 transition-colors"
            >
              <UploadIcon className="mx-auto h-16 w-16 text-gray-400" />
              <p className="mt-4 text-xl font-medium">Suelta aquí el PDF o foto</p>
              <p className="mt-2 text-gray-500">o haz click para seleccionar</p>
              <p className="mt-4 text-sm text-gray-400">PDF, JPG, PNG hasta 10MB</p>
            </DropZone>
          )}
          
          {step === 'extracting' && (
            <div className="text-center py-16">
              <Spinner size="lg" />
              <p className="mt-4 text-lg text-gray-600">Leyendo documento...</p>
              <p className="mt-2 text-sm text-gray-400">Extrayendo información</p>
            </div>
          )}
          
          {step === 'form' && (
            <div className="space-y-6">
              {/* File preview */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <FileIcon className="h-10 w-10 text-primary-500" />
                <div className="flex-1">
                  <p className="font-medium">{file?.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(file?.size)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep('upload')}>
                  Cambiar
                </Button>
              </div>
              
              {/* Extracted data badge */}
              {extractedData && (
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <SparklesIcon className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">
                    Proveedor detectado: <strong>{extractedData.proveedor}</strong>
                  </span>
                  <Badge variant="info">Mock</Badge>
                </div>
              )}
              
              {/* Form fields */}
              <div className="grid grid-cols-2 gap-6">
                <FormField error={errors.proyecto}>
                  <FormLabel required>Proyecto</FormLabel>
                  <Select
                    value={formData.proyecto}
                    onChange={(v) => {
                      setFormData({ ...formData, proyecto: v, po: '' });
                      setErrors({ ...errors, proyecto: null });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {proyectos.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                
                <FormField error={errors.po}>
                  <FormLabel required>PO</FormLabel>
                  <Select
                    value={formData.po}
                    onChange={(v) => {
                      setFormData({ ...formData, po: v });
                      setErrors({ ...errors, po: null });
                    }}
                    disabled={!formData.proyecto}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona PO" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredPOs.map(po => (
                        <SelectItem key={po.id} value={po.id}>{po.numero}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                
                <FormField error={errors.proveedor} className="col-span-2">
                  <FormLabel required>Proveedor</FormLabel>
                  <Input
                    value={formData.proveedor}
                    onChange={(e) => {
                      setFormData({ ...formData, proveedor: e.target.value });
                      setErrors({ ...errors, proveedor: null });
                    }}
                    placeholder="Nombre del proveedor"
                  />
                </FormField>
                
                <FormField error={errors.fechaRecepcion}>
                  <FormLabel required>Fecha de recepción</FormLabel>
                  <DatePicker
                    value={formData.fechaRecepcion}
                    onChange={(v) => setFormData({ ...formData, fechaRecepcion: v })}
                    maxDate={new Date()}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Nº Albarán</FormLabel>
                  <Input
                    value={formData.nroAlbaran}
                    onChange={(e) => setFormData({ ...formData, nroAlbaran: e.target.value })}
                    placeholder="ALB-2024-..."
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Tipo de documento</FormLabel>
                  <Select
                    value={formData.tipoDocumento}
                    onChange={(v) => setFormData({ ...formData, tipoDocumento: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="certificado">Certificado</SelectItem>
                      <SelectItem value="albaran">Albarán</SelectItem>
                      <SelectItem value="factura">Factura</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                
                <FormField className="col-span-2">
                  <FormLabel>Observaciones</FormLabel>
                  <Textarea
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    placeholder="Notas adicionales..."
                    rows={3}
                  />
                </FormField>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  Guardar certificado
                </Button>
              </div>
            </div>
          )}
        </Card.Content>
      </Card>
    </PageLayout>
  );
}
```

### 4.3 Detalle de Certificado (Drawer)

```tsx
// /components/CertificadoDrawer.tsx
export function CertificadoDrawer({ certificado, open, onClose }) {
  if (!certificado) return null;
  
  return (
    <Drawer open={open} onClose={onClose} side="right" size="lg">
      <Drawer.Header>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{certificado.nombre}</span>
          <Badge variant="outline">{certificado.proyecto.codigo}</Badge>
          <Badge variant="outline">{certificado.po.numero}</Badge>
        </div>
        <Drawer.CloseButton />
      </Drawer.Header>
      
      <Drawer.Body className="p-0">
        <div className="flex flex-col h-full">
          {/* Status bar */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <StatusSelect
                value={certificado.estado}
                onChange={(estado) => updateCertificado(certificado.id, { estado })}
              />
              <UrgenciaToggle
                value={certificado.urgencia}
                onChange={(urgencia) => updateCertificado(certificado.id, { urgencia })}
              />
            </div>
            <span className="text-sm text-gray-500">
              Pendiente desde {certificado.aging} días
            </span>
          </div>
          
          {/* PDF Preview */}
          <div className="flex-1 bg-gray-100 p-4">
            <PDFPreview url={certificado.fileUrl} />
          </div>
          
          {/* Metadata panel */}
          <div className="p-4 border-t space-y-4">
            <h3 className="font-semibold">Metadatos</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Proveedor</span>
                <p className="font-medium">{certificado.proveedor}</p>
              </div>
              <div>
                <span className="text-gray-500">Nº Albarán</span>
                <p className="font-medium">{certificado.nroAlbaran || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">Tipo</span>
                <p className="font-medium">{certificado.tipoDocumento}</p>
              </div>
              <div>
                <span className="text-gray-500">Fecha recepción</span>
                <p className="font-medium">{formatDate(certificado.fechaRecepcion)}</p>
              </div>
            </div>
            
            {/* AI Detection badge */}
            {certificado.aiDetected && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <SparklesIcon className="h-4 w-4 text-purple-500" />
                <span className="text-sm">
                  Proveedor detectado: {certificado.proveedor}
                </span>
                <Badge size="sm" variant="purple">Mock</Badge>
              </div>
            )}
            
            {/* Mini Timeline */}
            <div>
              <h3 className="font-semibold mb-2">Actividad</h3>
              <MiniTimeline events={certificado.timeline.slice(0, 3)} />
            </div>
          </div>
        </div>
      </Drawer.Body>
      
      <Drawer.Footer>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => markAsRevisado(certificado.id)}
            disabled={certificado.estado === 'revisado'}
          >
            <CheckIcon /> Marcar revisado
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => openCreateIncidenciaModal(certificado)}
          >
            <AlertIcon /> Incidencia
          </Button>
          <Button
            variant="ghost"
            onClick={() => openNotifyModal(certificado)}
          >
            <MailIcon />
          </Button>
        </div>
      </Drawer.Footer>
    </Drawer>
  );
}
```

---

## 🔍 Flow 5: Búsqueda AI (Mock)

```tsx
// /lib/ai-search.ts
export function parseNaturalQuery(query: string): SearchFilters {
  const filters: SearchFilters = {};
  const normalizedQuery = query.toLowerCase();
  
  // Detectar proyecto (P-XXX o nombre)
  const projectCodeMatch = normalizedQuery.match(/proyecto\s+(p-\d+)/i);
  const projectNameMatch = normalizedQuery.match(/proyecto\s+([a-záéíóú\s]+?)(?:\s*,|\s+proveedor|\s+urgente|$)/i);
  if (projectCodeMatch) {
    filters.proyecto = projectCodeMatch[1].toUpperCase();
  } else if (projectNameMatch) {
    filters.proyectoNombre = projectNameMatch[1].trim();
  }
  
  // Detectar proveedor
  const providerMatch = normalizedQuery.match(/proveedor\s+([a-záéíóú\s]+?)(?:\s*,|\s+urgente|\s+pendiente|$)/i);
  if (providerMatch) {
    filters.proveedor = providerMatch[1].trim();
  }
  
  // Detectar estado
  if (/pendiente/i.test(normalizedQuery)) {
    filters.estado = 'pendiente_revision';
  }
  if (/revisado/i.test(normalizedQuery)) {
    filters.estado = 'revisado';
  }
  if (/incidencia/i.test(normalizedQuery)) {
    filters.estado = 'incidencia';
  }
  
  // Detectar urgencia
  if (/urgente/i.test(normalizedQuery)) {
    filters.urgencia = 'urgente';
  }
  
  // Detectar aging
  const agingMatch = normalizedQuery.match(/(\d+)\s*días/);
  if (agingMatch) {
    filters.agingDias = parseInt(agingMatch[1]);
  }
  
  return filters;
}

// Uso en componente
const handleAISearch = (query: string) => {
  const extractedFilters = parseNaturalQuery(query);
  
  setFilters({
    ...extractedFilters,
    aiGenerated: true,
    aiQuery: query,
  });
  
  // Feedback visual
  toast.info(
    `He aplicado: ${Object.entries(extractedFilters)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ')}`
  );
};
```

---

## ⚠️ Flow 6: Incidencias

### 6.1 Lista de Incidencias

```tsx
// /app/incidencias/page.tsx
export default function IncidenciasPage() {
  const { incidencias, filters, setFilters } = useIncidencias();
  
  return (
    <PageLayout title="Incidencias" subtitle="Gestión de incidencias abiertas">
      {/* Tabs de vista */}
      <div className="flex gap-2 mb-6">
        <FilterChip active={filters.estado === 'abierta'} onClick={() => setFilters({ estado: 'abierta' })}>
          Abiertas ({counts.abiertas})
        </FilterChip>
        <FilterChip active={filters.urgencia === 'urgente'} onClick={() => setFilters({ urgencia: 'urgente' })}>
          Urgentes ({counts.urgentes})
        </FilterChip>
        <FilterChip active={filters.aging > 7} onClick={() => setFilters({ aging: 7 })}>
          {'>'}7 días ({counts.masde7dias})
        </FilterChip>
      </div>
      
      {/* Tabla */}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>ID</Table.Head>
            <Table.Head>Tipo</Table.Head>
            <Table.Head>Proyecto</Table.Head>
            <Table.Head>PO</Table.Head>
            <Table.Head>Estado</Table.Head>
            <Table.Head>Urgencia</Table.Head>
            <Table.Head>Fecha</Table.Head>
            <Table.Head>Aging</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {incidencias.map(inc => (
            <Table.Row key={inc.id} onClick={() => openIncidenciaDrawer(inc)}>
              <Table.Cell className="font-mono">#{inc.id}</Table.Cell>
              <Table.Cell>{getTipoLabel(inc.tipo)}</Table.Cell>
              <Table.Cell>{inc.proyecto.nombre}</Table.Cell>
              <Table.Cell>{inc.po.numero}</Table.Cell>
              <Table.Cell>
                <StatusBadge status={inc.estado} />
              </Table.Cell>
              <Table.Cell>
                <UrgenciaBadge urgencia={inc.urgencia} />
              </Table.Cell>
              <Table.Cell>{formatDate(inc.createdAt)}</Table.Cell>
              <Table.Cell>
                <AgingBadge days={inc.aging} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </PageLayout>
  );
}
```

### 6.2 Crear Incidencia (Modal)

```tsx
// /components/CreateIncidenciaModal.tsx
export function CreateIncidenciaModal({ open, onClose, certificado, po }) {
  const [formData, setFormData] = useState({
    tipo: '',
    comentario: '',
    urgencia: 'normal',
  });
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async () => {
    // Validación
    const newErrors = {};
    if (!formData.tipo) newErrors.tipo = 'Selecciona el tipo de incidencia';
    if (!formData.comentario.trim()) newErrors.comentario = 'Añade un comentario';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Crear incidencia
    await createIncidencia({
      ...formData,
      certificadoId: certificado?.id,
      poId: po?.id || certificado?.poId,
      proyectoId: po?.proyectoId || certificado?.proyectoId,
    });
    
    // Notificar al owner
    await notifyOwner({
      tipo: 'incidencia_creada',
      incidenciaId: newIncidencia.id,
    });
    
    toast.success('Incidencia creada y owner notificado');
    onClose();
  };
  
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Crear incidencia</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="space-y-4">
        {/* Contexto */}
        {certificado && (
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            Certificado: {certificado.nombre} ({certificado.po.numero})
          </div>
        )}
        
        <FormField error={errors.tipo}>
          <FormLabel required>Tipo de incidencia</FormLabel>
          <Select value={formData.tipo} onChange={(v) => setFormData({ ...formData, tipo: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="falta_documento">Falta certificado</SelectItem>
              <SelectItem value="documento_incorrecto">Documento incorrecto</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        
        <FormField error={errors.comentario}>
          <FormLabel required>Comentario</FormLabel>
          <Textarea
            value={formData.comentario}
            onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
            placeholder="Describe el problema..."
            rows={4}
          />
        </FormField>
        
        <FormField>
          <FormLabel>Urgencia</FormLabel>
          <RadioGroup
            value={formData.urgencia}
            onChange={(v) => setFormData({ ...formData, urgencia: v })}
          >
            <RadioItem value="normal">Normal</RadioItem>
            <RadioItem value="urgente">Urgente</RadioItem>
          </RadioGroup>
        </FormField>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Crear incidencia</Button>
      </Modal.Footer>
    </Modal>
  );
}
```

---

## 🔔 Flow 7: Notificaciones

### 7.1 Bandeja In-App

```tsx
// /components/NotificationBell.tsx
export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-error-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </Popover.Trigger>
      
      <Popover.Content className="w-80 p-0">
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="font-semibold">Notificaciones</h3>
          <Button variant="link" size="sm" onClick={markAllAsRead}>
            Marcar como leídas
          </Button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay notificaciones
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                className={cn(
                  "p-3 border-b hover:bg-gray-50 cursor-pointer",
                  !notif.leido && "bg-blue-50"
                )}
                onClick={() => {
                  markAsRead(notif.id);
                  navigate(notif.link);
                  setOpen(false);
                }}
              >
                <div className="flex gap-3">
                  <NotificationIcon tipo={notif.tipo} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{notif.titulo}</p>
                    <p className="text-xs text-gray-500 truncate">{notif.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatRelativeTime(notif.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-2 border-t">
          <Button variant="ghost" className="w-full" onClick={() => navigate('/notificaciones')}>
            Ver todas
          </Button>
        </div>
      </Popover.Content>
    </Popover>
  );
}
```

### 7.2 Modal Email (Mock)

```tsx
// /components/EmailModal.tsx
export function EmailModal({ open, onClose, context }) {
  const [recipients, setRecipients] = useState([context?.owner?.id]);
  const [subject, setSubject] = useState(generateSubject(context));
  const [body, setBody] = useState(generateBody(context));
  
  const handleSend = async () => {
    // Mock send
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Log event
    await logEvent({
      tipo: 'email_enviado',
      destinatarios: recipients,
      contexto: context,
    });
    
    toast.success(
      <div>
        <p className="font-medium">Email enviado (mock)</p>
        <p className="text-sm text-gray-500">
          A: {recipients.map(r => getUserName(r)).join(', ')}
        </p>
      </div>
    );
    
    onClose();
  };
  
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header>
        <Modal.Title>Enviar notificación</Modal.Title>
        <Badge variant="purple">Mock</Badge>
      </Modal.Header>
      
      <Modal.Body className="space-y-4">
        {/* Recipients */}
        <FormField>
          <FormLabel>Destinatarios</FormLabel>
          <MultiSelect
            value={recipients}
            onChange={setRecipients}
            options={availableUsers}
            placeholder="Selecciona destinatarios"
          />
          <p className="text-xs text-gray-500 mt-1">
            Owner preseleccionado: {context?.owner?.nombre}
          </p>
        </FormField>
        
        {/* Subject */}
        <FormField>
          <FormLabel>Asunto</FormLabel>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </FormField>
        
        {/* Body Preview */}
        <FormField>
          <FormLabel>Vista previa</FormLabel>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="prose prose-sm">
              <p className="font-medium">{subject}</p>
              <hr className="my-2" />
              <div dangerouslySetInnerHTML={{ __html: body }} />
            </div>
          </div>
        </FormField>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSend}>
          <SendIcon /> Enviar (mock)
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// Generadores de plantilla
function generateSubject(context) {
  if (context.tipo === 'incidencia') {
    return `[INCIDENCIA] Nueva incidencia en ${context.po?.numero}`;
  }
  if (context.tipo === 'nuevo_documento') {
    return `[CERTIFICADO] Nuevo documento en ${context.po?.numero}`;
  }
  return `[Calidad] Notificación del sistema`;
}

function generateBody(context) {
  return `
    <p>Hola,</p>
    <p>Se ha ${context.tipo === 'incidencia' ? 'creado una incidencia' : 'subido un nuevo documento'} 
    en el proyecto <strong>${context.proyecto?.nombre}</strong>.</p>
    <p><strong>PO:</strong> ${context.po?.numero}</p>
    <p>Por favor, revisa el detalle en el sistema.</p>
    <p>Saludos,<br>Sistema de Calidad</p>
  `;
}
```

---

## 📥 Flow 8: Dossier (Mock)

```tsx
// /components/DossierModal.tsx
export function DossierModal({ open, onClose, proyecto, po }) {
  const [scope, setScope] = useState('todo');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Mock generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log event
    await logEvent({
      tipo: 'dossier_solicitado',
      proyectoId: proyecto?.id,
      poId: po?.id,
      scope,
    });
    
    setIsGenerating(false);
    
    toast.success(
      <div>
        <p className="font-medium">Dossier generado correctamente</p>
        <p className="text-sm text-gray-500">
          {scope === 'todo' ? 'Todos los documentos' : 
           scope === 'revisados' ? 'Solo revisados' : 'Solo pendientes'}
        </p>
      </div>
    );
    
    onClose();
  };
  
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Descargar dossier</Modal.Title>
        <Badge variant="purple">Mock</Badge>
      </Modal.Header>
      
      <Modal.Body>
        <p className="text-sm text-gray-600 mb-4">
          Genera un dossier con los certificados de{' '}
          <strong>{po ? `PO ${po.numero}` : proyecto?.nombre}</strong>
        </p>
        
        <FormField>
          <FormLabel>Alcance del dossier</FormLabel>
          <RadioGroup value={scope} onChange={setScope}>
            <RadioItem value="todo">
              <span className="font-medium">Todos los documentos</span>
              <span className="text-sm text-gray-500 block">
                Incluye todos los certificados
              </span>
            </RadioItem>
            <RadioItem value="revisados">
              <span className="font-medium">Solo revisados</span>
              <span className="text-sm text-gray-500 block">
                Certificados con estado "Revisado"
              </span>
            </RadioItem>
            <RadioItem value="pendientes">
              <span className="font-medium">Solo pendientes</span>
              <span className="text-sm text-gray-500 block">
                Certificados pendientes de revisión
              </span>
            </RadioItem>
          </RadioGroup>
        </FormField>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleGenerate} loading={isGenerating}>
          <DownloadIcon /> Generar dossier
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
```

---

## 🏃 Plan de Implementación por Días

### Día 1: Setup + Datos
- [ ] Setup Next.js 14 + TypeScript + Tailwind
- [ ] Instalar shadcn/ui o Radix primitives
- [ ] Crear estructura de carpetas
- [ ] Implementar mock data (JSON estático)
- [ ] Crear tipos TypeScript
- [ ] Setup Zustand para estado global

### Día 2: Layout + Navegación
- [ ] AppShell (sidebar + header)
- [ ] Sistema de routing
- [ ] Breadcrumbs
- [ ] NotificationBell (UI, sin lógica)
- [ ] UserMenu
- [ ] Home/Dashboard básico

### Día 3: Proyectos + POs
- [ ] Lista de proyectos
- [ ] Ficha de proyecto con tabs
- [ ] Lista de POs
- [ ] Ficha de PO con tabs
- [ ] Tabla de certificados dentro de PO

### Día 4: Certificados
- [ ] Pantalla de subida completa
- [ ] Mock de extracción
- [ ] Drawer de detalle
- [ ] Cambio de estado inline
- [ ] Lista global con filtros

### Día 5: Features Avanzados
- [ ] Búsqueda AI mock
- [ ] Sistema de incidencias (crear + lista)
- [ ] Notificaciones in-app
- [ ] Email modal mock
- [ ] Dossier modal mock
- [ ] Empty states

### Día 6: Polish
- [ ] Timeline en todos los objetos
- [ ] Animaciones y transiciones
- [ ] Loading states y skeletons
- [ ] Testing de flujos E2E
- [ ] Ajustes finales de UX
- [ ] Deploy a Vercel

---

## ✅ Definition of Done

Cada feature está DONE cuando:

1. ✅ Funciona sin errores en navegación
2. ✅ Tiene estados de loading apropiados
3. ✅ Empty states implementados
4. ✅ Validaciones con mensajes claros
5. ✅ Eventos se registran en timeline
6. ✅ Responsive (al menos desktop)
7. ✅ Consistente con el sistema de diseño

---

*Documentos relacionados:*
- *[PLAN-01-FUNCIONAL.md](./PLAN-01-FUNCIONAL.md) - Requisitos funcionales*
- *[PLAN-02-DISEÑO.md](./PLAN-02-DISEÑO.md) - Sistema de diseño y layouts*


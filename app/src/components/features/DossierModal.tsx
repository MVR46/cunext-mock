'use client';

import { useState } from 'react';
import { DocumentArrowDownIcon, FolderIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { CURRENT_USER } from '@/lib/mock-data';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface DossierScope {
  todo: boolean;
  revisados: boolean;
  pendientes: boolean;
}

interface DossierModalProps {
  projectName?: string;
  poNumber?: string;
}

export function DossierModal({ projectName, poNumber }: DossierModalProps) {
  const { isDossierModalOpen, closeDossierModal, addTimelineEvent } = useAppStore();
  const { showToast } = useToast();
  
  const [scope, setScope] = useState<DossierScope>({
    todo: true,
    revisados: false,
    pendientes: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleScopeChange = (key: keyof DossierScope) => {
    if (key === 'todo') {
      setScope({ todo: true, revisados: false, pendientes: false });
    } else {
      setScope(prev => ({
        ...prev,
        todo: false,
        [key]: !prev[key]
      }));
    }
  };
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add timeline event
    addTimelineEvent({
      id: `EVT-${Date.now()}`,
      tipo: 'dossier_solicitado',
      descripcion: `Dossier generado para ${projectName || poNumber || 'selección'}`,
      objeto_id: projectName || poNumber || 'dossier',
      objeto_tipo: 'proyecto',
      usuario: CURRENT_USER,
      metadata: { scope },
      created_at: new Date().toISOString()
    });
    
    setIsGenerating(false);
    showToast('Dossier generado correctamente ✓', 'success');
    handleClose();
  };
  
  const handleClose = () => {
    setScope({ todo: true, revisados: false, pendientes: false });
    setIsGenerating(false);
    closeDossierModal();
  };
  
  const scopeLabel = projectName 
    ? `Proyecto: ${projectName}` 
    : poNumber 
    ? `PO: ${poNumber}` 
    : 'Documentos seleccionados';
  
  return (
    <Modal
      isOpen={isDossierModalOpen}
      onClose={handleClose}
      title="Descargar Dossier"
      description="Genera un paquete con los certificados seleccionados"
      size="md"
    >
      <div className="space-y-5">
        {/* Scope Info */}
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
          <FolderIcon className="h-8 w-8 text-slate-400" />
          <div>
            <p className="font-medium text-slate-700">{scopeLabel}</p>
            <p className="text-sm text-slate-500">Selecciona qué documentos incluir</p>
          </div>
        </div>
        
        {/* Scope Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Incluir documentos:
          </label>
          
          <div className="space-y-2">
            <label className={cn(
              "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
              scope.todo 
                ? "border-cyan-300 bg-cyan-50" 
                : "border-slate-200 hover:border-slate-300"
            )}>
              <input
                type="checkbox"
                checked={scope.todo}
                onChange={() => handleScopeChange('todo')}
                className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
              />
              <div>
                <p className="font-medium text-slate-700">Todos los documentos</p>
                <p className="text-xs text-slate-500">Incluye todos los certificados sin importar su estado</p>
              </div>
            </label>
            
            <label className={cn(
              "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
              scope.revisados && !scope.todo
                ? "border-emerald-300 bg-emerald-50" 
                : "border-slate-200 hover:border-slate-300",
              scope.todo && "opacity-50 cursor-not-allowed"
            )}>
              <input
                type="checkbox"
                checked={scope.revisados && !scope.todo}
                onChange={() => handleScopeChange('revisados')}
                disabled={scope.todo}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <div>
                <p className="font-medium text-slate-700">Solo revisados</p>
                <p className="text-xs text-slate-500">Documentos validados por el equipo de Calidad</p>
              </div>
            </label>
            
            <label className={cn(
              "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
              scope.pendientes && !scope.todo
                ? "border-amber-300 bg-amber-50" 
                : "border-slate-200 hover:border-slate-300",
              scope.todo && "opacity-50 cursor-not-allowed"
            )}>
              <input
                type="checkbox"
                checked={scope.pendientes && !scope.todo}
                onChange={() => handleScopeChange('pendientes')}
                disabled={scope.todo}
                className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
              />
              <div>
                <p className="font-medium text-slate-700">Solo pendientes</p>
                <p className="text-xs text-slate-500">Documentos que aún no han sido revisados</p>
              </div>
            </label>
          </div>
        </div>
        
        {/* Mock Notice */}
        <div className="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm">
          <span className="text-lg">🤖</span>
          <p className="text-purple-700">
            <strong>Modo Demo:</strong> No se generará un archivo real. Se registrará el evento en el timeline.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleGenerate}
            isLoading={isGenerating}
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            {isGenerating ? 'Generando...' : 'Generar dossier'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}


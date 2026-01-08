'use client';

import { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { MOCK_PROJECTS, MOCK_POS, MOCK_CERTIFICATES } from '@/lib/mock-data';
import { INCIDENCIA_TYPES, VALIDATION_MESSAGES } from '@/lib/types';
import { generateId, cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface FormData {
  proyecto: string;
  po: string;
  certificado: string;
  tipo: string;
  comentario: string;
  urgencia: boolean;
}

export function IncidenciaModal() {
  const { isIncidenciaModalOpen, closeIncidenciaModal, addIncidencia } = useAppStore();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    proyecto: '',
    po: '',
    certificado: '',
    tipo: 'falta_documento',
    comentario: '',
    urgencia: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const filteredPOs = MOCK_POS.filter(po => po.proyecto_id === formData.proyecto);
  const filteredCerts = MOCK_CERTIFICATES.filter(cert => cert.po_id === formData.po);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.proyecto) newErrors.proyecto = VALIDATION_MESSAGES.proyecto;
    if (!formData.po) newErrors.po = VALIDATION_MESSAGES.po;
    if (!formData.comentario.trim()) newErrors.comentario = VALIDATION_MESSAGES.incidencia_comentario;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const newIncidencia = {
      id: generateId('INC'),
      certificado_id: formData.certificado || undefined,
      po_id: formData.po,
      proyecto_id: formData.proyecto,
      tipo: formData.tipo as 'falta_documento' | 'documento_incorrecto' | 'otro',
      comentario: formData.comentario,
      urgencia: formData.urgencia ? 'urgente' as const : 'normal' as const,
      estado: 'abierta' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    addIncidencia(newIncidencia);
    showToast('Incidencia creada correctamente', 'success');
    handleClose();
  };
  
  const handleClose = () => {
    setFormData({
      proyecto: '',
      po: '',
      certificado: '',
      tipo: 'falta_documento',
      comentario: '',
      urgencia: false
    });
    setErrors({});
    closeIncidenciaModal();
  };
  
  return (
    <Modal
      isOpen={isIncidenciaModalOpen}
      onClose={handleClose}
      title="Crear Incidencia"
      description="Reporta un problema con un documento o falta de documentación"
      size="lg"
    >
      <div className="space-y-5">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <ExclamationTriangleIcon className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Las incidencias notifican automáticamente al owner del proyecto
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Se creará un registro en el timeline y se enviará una notificación
            </p>
          </div>
        </div>
        
        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Proyecto */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Proyecto <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.proyecto}
              onChange={(e) => setFormData(prev => ({ ...prev, proyecto: e.target.value, po: '', certificado: '' }))}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500",
                errors.proyecto ? "border-red-300 bg-red-50" : "border-slate-200"
              )}
            >
              <option value="">Seleccionar proyecto</option>
              {MOCK_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.id}: {p.nombre}</option>
              ))}
            </select>
            {errors.proyecto && (
              <p className="text-xs text-red-500 mt-1">{errors.proyecto}</p>
            )}
          </div>
          
          {/* PO */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pedido (PO) <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.po}
              onChange={(e) => setFormData(prev => ({ ...prev, po: e.target.value, certificado: '' }))}
              disabled={!formData.proyecto}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-slate-100",
                errors.po ? "border-red-300 bg-red-50" : "border-slate-200"
              )}
            >
              <option value="">Seleccionar PO</option>
              {filteredPOs.map(po => (
                <option key={po.id} value={po.id}>{po.numero} - {po.proveedor}</option>
              ))}
            </select>
            {errors.po && (
              <p className="text-xs text-red-500 mt-1">{errors.po}</p>
            )}
          </div>
          
          {/* Certificado (opcional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Certificado relacionado
            </label>
            <select
              value={formData.certificado}
              onChange={(e) => setFormData(prev => ({ ...prev, certificado: e.target.value }))}
              disabled={!formData.po}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-slate-100"
            >
              <option value="">Sin certificado específico</option>
              {filteredCerts.map(cert => (
                <option key={cert.id} value={cert.id}>{cert.nombre_archivo}</option>
              ))}
            </select>
          </div>
          
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo de incidencia
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {INCIDENCIA_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Comentario */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Descripción de la incidencia <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.comentario}
            onChange={(e) => setFormData(prev => ({ ...prev, comentario: e.target.value }))}
            rows={4}
            className={cn(
              "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none",
              errors.comentario ? "border-red-300 bg-red-50" : "border-slate-200"
            )}
            placeholder="Describe el problema en detalle..."
          />
          {errors.comentario && (
            <p className="text-xs text-red-500 mt-1">{errors.comentario}</p>
          )}
        </div>
        
        {/* Urgencia Toggle */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.urgencia}
              onChange={(e) => setFormData(prev => ({ ...prev, urgencia: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
          </label>
          <span className="text-sm font-medium text-slate-700">Marcar como urgente 🔴</span>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            <ExclamationTriangleIcon className="h-4 w-4" />
            Crear incidencia
          </Button>
        </div>
      </div>
    </Modal>
  );
}


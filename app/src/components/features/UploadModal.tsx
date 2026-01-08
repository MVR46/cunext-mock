'use client';

import { useState, useCallback } from 'react';
import { 
  CloudArrowUpIcon, 
  DocumentIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DropZone, FilePreview } from '@/components/ui/DropZone';
import { AIBadge } from '@/components/ui/Badge';
import { useAppStore } from '@/lib/store';
import { MOCK_PROJECTS, MOCK_POS } from '@/lib/mock-data';
import { DOCUMENT_TYPES, VALIDATION_MESSAGES } from '@/lib/types';
import { mockExtractProvider, generateId, cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface FormData {
  proyecto: string;
  po: string;
  proveedor: string;
  fecha_recepcion: string;
  nro_albaran: string;
  tipo_documento: string;
  observaciones: string;
  urgencia: boolean;
}

interface FormErrors {
  proyecto?: string;
  po?: string;
  proveedor?: string;
  fecha_recepcion?: string;
}

export function UploadModal() {
  const { isUploadModalOpen, closeUploadModal, addCertificate } = useAppStore();
  const { showToast } = useToast();
  
  const [step, setStep] = useState<'upload' | 'processing' | 'form'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [extractedProvider, setExtractedProvider] = useState<{ provider: string; confidence: number } | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    proyecto: '',
    po: '',
    proveedor: '',
    fecha_recepcion: new Date().toISOString().split('T')[0],
    nro_albaran: '',
    tipo_documento: 'certificado',
    observaciones: '',
    urgencia: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  const filteredPOs = MOCK_POS.filter(po => po.proyecto_id === formData.proyecto);
  
  const handleFileDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);
  
  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStep('processing');
    
    // Simulate OCR/extraction process
    setTimeout(() => {
      const extracted = mockExtractProvider(selectedFile.name);
      setExtractedProvider(extracted);
      setFormData(prev => ({ ...prev, proveedor: extracted.provider }));
      setStep('form');
    }, 1500);
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.proyecto) {
      newErrors.proyecto = VALIDATION_MESSAGES.proyecto;
    }
    if (!formData.po) {
      newErrors.po = VALIDATION_MESSAGES.po;
    }
    if (!formData.proveedor) {
      newErrors.proveedor = VALIDATION_MESSAGES.proveedor;
    }
    if (!formData.fecha_recepcion) {
      newErrors.fecha_recepcion = VALIDATION_MESSAGES.fecha;
    } else if (new Date(formData.fecha_recepcion) > new Date()) {
      newErrors.fecha_recepcion = VALIDATION_MESSAGES.fecha_futuro;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const newCertificate = {
      id: generateId('CERT'),
      nombre_archivo: file!.name,
      po_id: formData.po,
      proyecto_id: formData.proyecto,
      proveedor: formData.proveedor,
      fecha_recepcion: formData.fecha_recepcion,
      estado: 'pendiente_revision' as const,
      urgencia: formData.urgencia ? 'urgente' as const : 'normal' as const,
      tipo_documento: formData.tipo_documento as 'certificado' | 'albaran' | 'factura' | 'otro',
      nro_albaran: formData.nro_albaran || undefined,
      observaciones: formData.observaciones || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    addCertificate(newCertificate);
    showToast('Certificado subido correctamente', 'success');
    handleClose();
  };
  
  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setExtractedProvider(null);
    setFormData({
      proyecto: '',
      po: '',
      proveedor: '',
      fecha_recepcion: new Date().toISOString().split('T')[0],
      nro_albaran: '',
      tipo_documento: 'certificado',
      observaciones: '',
      urgencia: false
    });
    setErrors({});
    closeUploadModal();
  };
  
  return (
    <Modal
      isOpen={isUploadModalOpen}
      onClose={handleClose}
      title="Subir Certificado"
      description="Arrastra un archivo PDF o imagen para comenzar"
      size="lg"
    >
      {step === 'upload' && (
        <DropZone
          onDrop={handleFileDrop}
          accept={['.pdf', '.jpg', '.jpeg', '.png']}
          maxSize={10}
        />
      )}
      
      {step === 'processing' && (
        <div className="py-12 text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#1E3A5F]/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-[#1E3A5F] rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-3 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-[#1E3A5F]" />
            </div>
          </div>
          <p className="text-lg font-medium text-slate-700 mb-1">Leyendo documento...</p>
          <p className="text-sm text-slate-500">Extrayendo información del proveedor</p>
          
          {file && (
          <div className="flex items-center gap-3 mt-6 p-3 bg-slate-50 rounded-lg max-w-xs mx-auto">
            <DocumentIcon className="h-8 w-8 text-slate-400" />
            <div className="text-left">
                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {step === 'form' && (
        <div className="space-y-5">
          {/* File Preview */}
          {file && (
            <FilePreview
              file={file}
              status="success"
              onRemove={() => { setStep('upload'); setFile(null); }}
            />
          )}
          
          {/* Extracted Provider with AI badge */}
          {extractedProvider && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl">
              <SparklesIcon className="h-5 w-5 text-purple-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-slate-700">
                  Proveedor detectado: <strong className="text-slate-900">{extractedProvider.provider}</strong>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confianza: {(extractedProvider.confidence * 100).toFixed(0)}%
                </p>
              </div>
              <AIBadge showConfidence confidence={extractedProvider.confidence} />
            </div>
          )}
          
          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* Proyecto */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Proyecto <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.proyecto}
                onChange={(e) => setFormData(prev => ({ ...prev, proyecto: e.target.value, po: '' }))}
                className={cn(
                  "w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]",
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Pedido (PO) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.po}
                onChange={(e) => setFormData(prev => ({ ...prev, po: e.target.value }))}
                disabled={!formData.proyecto}
                className={cn(
                  "w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] disabled:bg-slate-100 disabled:cursor-not-allowed",
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
            
            {/* Proveedor */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Proveedor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.proveedor}
                onChange={(e) => setFormData(prev => ({ ...prev, proveedor: e.target.value }))}
                className={cn(
                  "w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]",
                  errors.proveedor ? "border-red-300 bg-red-50" : "border-slate-200"
                )}
                placeholder="Nombre del proveedor"
              />
              {errors.proveedor && (
                <p className="text-xs text-red-500 mt-1">{errors.proveedor}</p>
              )}
            </div>
            
            {/* Fecha Recepción */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Fecha recepción <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.fecha_recepcion}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_recepcion: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
                className={cn(
                  "w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]",
                  errors.fecha_recepcion ? "border-red-300 bg-red-50" : "border-slate-200"
                )}
              />
              {errors.fecha_recepcion && (
                <p className="text-xs text-red-500 mt-1">{errors.fecha_recepcion}</p>
              )}
            </div>
            
            {/* Nº Albarán */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nº Albarán
              </label>
              <input
                type="text"
                value={formData.nro_albaran}
                onChange={(e) => setFormData(prev => ({ ...prev, nro_albaran: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                placeholder="Opcional"
              />
            </div>
            
            {/* Tipo Documento */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tipo documento
              </label>
              <select
                value={formData.tipo_documento}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo_documento: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
              >
                {DOCUMENT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Observaciones
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value.slice(0, 500) }))}
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] resize-none"
              placeholder="Notas adicionales (opcional)"
            />
            <p className="text-xs text-slate-400 mt-1">
              {formData.observaciones.length}/500 caracteres
            </p>
          </div>
          
          {/* Urgencia Toggle */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.urgencia}
                onChange={(e) => setFormData(prev => ({ ...prev, urgencia: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
            <div>
              <span className="text-sm font-medium text-slate-700">Marcar como urgente</span>
              <p className="text-xs text-slate-500">El documento se priorizará en la cola de revisión</p>
            </div>
          </div>
          
          {/* Actions */}
          <ModalFooter>
            <Button variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Guardar certificado
            </Button>
          </ModalFooter>
        </div>
      )}
    </Modal>
  );
}

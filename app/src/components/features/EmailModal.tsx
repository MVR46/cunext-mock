'use client';

import { useState } from 'react';
import { EnvelopeIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { MOCK_USERS, CURRENT_USER } from '@/lib/mock-data';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export function EmailModal() {
  const { isEmailModalOpen, closeEmailModal, addTimelineEvent } = useAppStore();
  const { showToast } = useToast();
  
  const [selectedUsers, setSelectedUsers] = useState<string[]>([MOCK_USERS[0].id]);
  const [subject, setSubject] = useState('Solicitud de documentación - Departamento de Calidad');
  const [body, setBody] = useState(
    `Estimado/a,\n\nDesde el Departamento de Calidad, nos ponemos en contacto para solicitar la siguiente documentación:\n\n- [Describir documentación requerida]\n\nQuedamos a la espera de su respuesta.\n\nSaludos cordiales,\n${CURRENT_USER.nombre}\nDepartamento de Calidad`
  );
  
  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const handleSend = () => {
    if (selectedUsers.length === 0) {
      showToast('Selecciona al menos un destinatario', 'error');
      return;
    }
    
    // Add timeline event for mock email
    addTimelineEvent({
      id: `EVT-${Date.now()}`,
      tipo: 'email_enviado',
      descripcion: `Email enviado a ${selectedUsers.length} destinatario(s): ${subject}`,
      objeto_id: 'email',
      objeto_tipo: 'proyecto',
      usuario: CURRENT_USER,
      metadata: { recipients: selectedUsers, subject },
      created_at: new Date().toISOString()
    });
    
    showToast('Email enviado correctamente ✓', 'success');
    handleClose();
  };
  
  const handleClose = () => {
    setSelectedUsers([MOCK_USERS[0].id]);
    setSubject('Solicitud de documentación - Departamento de Calidad');
    closeEmailModal();
  };
  
  return (
    <Modal
      isOpen={isEmailModalOpen}
      onClose={handleClose}
      title="Enviar Notificación por Email"
      description="Vista previa del email a enviar"
      size="xl"
    >
      <div className="space-y-5">
        {/* Recipients */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Destinatarios
          </label>
          <div className="flex flex-wrap gap-2">
            {MOCK_USERS.map(user => (
              <button
                key={user.id}
                onClick={() => toggleUser(user.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all",
                  selectedUsers.includes(user.id)
                    ? "bg-cyan-100 text-cyan-700 border-2 border-cyan-300"
                    : "bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200"
                )}
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                  {user.nombre.split(' ').map(n => n[0]).join('')}
                </div>
                {user.nombre}
                {selectedUsers.includes(user.id) && (
                  <XMarkIcon className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Email Preview */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {/* Email Header */}
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">De:</span>
              <span className="font-medium text-slate-700">{CURRENT_USER.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className="text-slate-500">Para:</span>
              <span className="font-medium text-slate-700">
                {selectedUsers.length > 0 
                  ? selectedUsers.map(id => MOCK_USERS.find(u => u.id === id)?.email).join(', ')
                  : '(ningún destinatario seleccionado)'
                }
              </span>
            </div>
          </div>
          
          {/* Subject */}
          <div className="px-4 py-3 border-b border-slate-200">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-sm font-medium text-slate-800 focus:outline-none"
              placeholder="Asunto"
            />
          </div>
          
          {/* Body */}
          <div className="px-4 py-3">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full text-sm text-slate-600 focus:outline-none resize-none"
              placeholder="Escribe tu mensaje..."
            />
          </div>
        </div>
        
        {/* Mock Notice */}
        <div className="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm">
          <span className="text-lg">🤖</span>
          <p className="text-purple-700">
            <strong>Modo Demo:</strong> El email no se enviará realmente. Se registrará un evento en el timeline.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSend}
            disabled={selectedUsers.length === 0}
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            Enviar email
          </Button>
        </div>
      </div>
    </Modal>
  );
}


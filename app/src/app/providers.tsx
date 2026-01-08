'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import { UploadModal } from '@/components/features/UploadModal';
import { IncidenciaModal } from '@/components/features/IncidenciaModal';
import { EmailModal } from '@/components/features/EmailModal';
import { DossierModal } from '@/components/features/DossierModal';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <UploadModal />
      <IncidenciaModal />
      <EmailModal />
      <DossierModal />
    </ToastProvider>
  );
}


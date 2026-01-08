import { clsx, type ClassValue } from 'clsx';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { SearchFilters } from './types';

// Merge class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format date to Spanish locale
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: es });
}

// Format date with time
export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy 'a las' HH:mm", { locale: es });
}

// Relative time (e.g., "hace 2 días")
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
}

// Calculate aging in days
export function calculateAging(fechaRecepcion: string | Date): number {
  return differenceInDays(new Date(), new Date(fechaRecepcion));
}

// Format aging display
export function formatAging(days: number): string {
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Hace 1 día';
  return `Hace ${days} días`;
}

// Generate unique ID
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Mock AI parser for natural language search
export function parseNaturalQuery(query: string): SearchFilters {
  const filters: SearchFilters = {};
  const lowerQuery = query.toLowerCase();
  
  // Detect project (P-XXX pattern)
  const projectMatch = query.match(/proyecto\s*(P-\d+)/i) || query.match(/(P-\d+)/i);
  if (projectMatch) {
    filters.proyecto = projectMatch[1].toUpperCase();
  }
  
  // Detect PO (PO-XXXXXXX or 4500XXX pattern)
  const poMatch = query.match(/PO[- ]?(\d+)/i) || query.match(/po\s*(\d+)/i);
  if (poMatch) {
    filters.po = `PO-${poMatch[1]}`;
  }
  
  // Detect provider keywords
  const providers = [
    'tubacex', 'acerinox', 'repsol', 'sidenor', 'arcelormittal',
    'cepsa', 'bp', 'técnicas reunidas', 'nervión', 'sabic', 'basf',
    'dow', 'ercros', 'logista', 'xpo'
  ];
  for (const provider of providers) {
    if (lowerQuery.includes(provider)) {
      filters.proveedor = provider.charAt(0).toUpperCase() + provider.slice(1);
      break;
    }
  }
  
  // Detect state
  if (/pendiente|sin\s*revisar|por\s*revisar/i.test(query)) {
    filters.estado = 'pendiente_revision';
  } else if (/revisado|aprobado|validado/i.test(query)) {
    filters.estado = 'revisado';
  } else if (/incidencia|problema|error/i.test(query)) {
    filters.estado = 'incidencia';
  }
  
  // Detect urgency
  if (/urgente|urgencia|prioritario|crítico/i.test(query)) {
    filters.urgencia = 'urgente';
  }
  
  // Detect aging (días pattern)
  const agingMatch = query.match(/(\d+)\s*días?/i);
  if (agingMatch && /antiguo|desde|más\s*de|pendiente/i.test(query)) {
    filters.aging_dias = parseInt(agingMatch[1]);
  }
  
  return filters;
}

// Mock provider extraction from document
export function mockExtractProvider(fileName: string): { provider: string; confidence: number } {
  const fileNameLower = fileName.toLowerCase();
  
  const providerPatterns: { pattern: RegExp; provider: string }[] = [
    { pattern: /tubacex/i, provider: 'Tubacex S.A.' },
    { pattern: /acerinox/i, provider: 'Acerinox' },
    { pattern: /repsol/i, provider: 'Repsol Química' },
    { pattern: /sidenor/i, provider: 'Sidenor' },
    { pattern: /arcelor/i, provider: 'ArcelorMittal' },
    { pattern: /cepsa/i, provider: 'Cepsa' },
    { pattern: /bp/i, provider: 'BP Oil España' },
    { pattern: /tecnicas/i, provider: 'Técnicas Reunidas' },
    { pattern: /nervion/i, provider: 'Nervión Industries' },
    { pattern: /zamakona/i, provider: 'Astilleros Zamakona' },
    { pattern: /euskal/i, provider: 'Euskal Forging' },
    { pattern: /vicinay/i, provider: 'Vicinay Cadenas' },
    { pattern: /sabic/i, provider: 'Sabic' },
    { pattern: /basf/i, provider: 'BASF Española' },
    { pattern: /dow/i, provider: 'Dow Chemical' },
    { pattern: /ercros/i, provider: 'Ercros' },
    { pattern: /logista/i, provider: 'Logista' },
    { pattern: /xpo/i, provider: 'XPO Logistics' },
  ];
  
  for (const { pattern, provider } of providerPatterns) {
    if (pattern.test(fileNameLower)) {
      return { provider, confidence: 0.85 + Math.random() * 0.1 };
    }
  }
  
  // Random fallback for demo
  const randomProviders = ['Tubacex S.A.', 'Acerinox', 'Sidenor'];
  return { 
    provider: randomProviders[Math.floor(Math.random() * randomProviders.length)], 
    confidence: 0.45 + Math.random() * 0.2 
  };
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}


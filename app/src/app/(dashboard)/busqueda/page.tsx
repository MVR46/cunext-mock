'use client';

import { useState, useMemo, useCallback } from 'react';
import { 
  MagnifyingGlassIcon,
  SparklesIcon,
  LightBulbIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/lib/store';
import { CertificateCard } from '@/components/features/CertificateCard';
import { FilterChips } from '@/components/ui/FilterChips';
import { EmptyState } from '@/components/ui/EmptyState';
import { AIBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { parseNaturalQuery, calculateAging, cn } from '@/lib/utils';
import { SearchFilters } from '@/lib/types';

const EXAMPLE_QUERIES = [
  "Certificados pendientes del proyecto P-001",
  "Documentos urgentes de Tubacex",
  "Incidencias del proveedor Acerinox",
  "Pendientes desde hace más de 7 días",
  "Certificados revisados del proyecto P-003"
];

export default function BusquedaPage() {
  const { certificates, filters, setFilters, clearFilters } = useAppStore();
  const [query, setQuery] = useState('');
  const [isAIMode, setIsAIMode] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  
  const handleAISearch = useCallback(() => {
    if (!query.trim()) return;
    
    const parsedFilters = parseNaturalQuery(query);
    setFilters(parsedFilters);
    setIsAIMode(true);
    setShowExamples(false);
  }, [query, setFilters]);
  
  const handleExampleClick = (example: string) => {
    setQuery(example);
    const parsedFilters = parseNaturalQuery(example);
    setFilters(parsedFilters);
    setIsAIMode(true);
    setShowExamples(false);
  };
  
  const handleClear = () => {
    setQuery('');
    clearFilters();
    setIsAIMode(false);
    setShowExamples(true);
  };
  
  // Apply filters
  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert => {
      if (filters.proyecto && cert.proyecto_id !== filters.proyecto) return false;
      if (filters.po && cert.po_id !== filters.po) return false;
      if (filters.proveedor && !cert.proveedor.toLowerCase().includes(filters.proveedor.toLowerCase())) return false;
      if (filters.estado && cert.estado !== filters.estado) return false;
      if (filters.urgencia && cert.urgencia !== filters.urgencia) return false;
      if (filters.aging_dias) {
        const aging = calculateAging(cert.fecha_recepcion);
        if (aging < filters.aging_dias) return false;
      }
      return true;
    });
  }, [certificates, filters]);
  
  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-cyan-100 rounded-full mb-4">
          <SparklesIcon className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">Búsqueda Inteligente con IA</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          ¿Qué certificados buscas?
        </h1>
        <p className="text-slate-500">
          Escribe en lenguaje natural y la IA te ayudará a encontrar lo que necesitas
        </p>
      </div>
      
      {/* AI Search Box */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl p-2 mb-6 focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100 transition-all">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3">
            <SparklesIcon className="h-6 w-6 text-purple-500" />
          </div>
          <input
            type="text"
            placeholder="Ej: certificados pendientes del proyecto P-001 que sean urgentes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
            className="flex-1 py-4 text-lg outline-none placeholder:text-slate-400"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <XMarkIcon className="h-5 w-5 text-slate-400" />
            </button>
          )}
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleAISearch}
            disabled={!query.trim()}
            className="rounded-xl"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            Buscar
          </Button>
        </div>
      </div>
      
      {/* AI Filter Chips */}
      {hasActiveFilters && isAIMode && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AIBadge />
            <span className="text-sm text-slate-500">Filtros generados automáticamente:</span>
          </div>
          <FilterChips isAI />
          <button 
            onClick={handleClear}
            className="mt-2 text-sm text-slate-500 hover:text-slate-700"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}
      
      {/* Example Queries */}
      {showExamples && !hasActiveFilters && (
        <div className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <LightBulbIcon className="h-5 w-5 text-amber-500" />
            <span className="font-medium text-slate-700">Prueba estos ejemplos:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="px-4 py-2 bg-white text-sm text-slate-600 rounded-lg border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 transition-all"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Results */}
      {hasActiveFilters && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              {filteredCertificates.length} resultado(s) encontrado(s)
            </h2>
          </div>
          
          {filteredCertificates.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCertificates.map(cert => (
                <CertificateCard 
                  key={cert.id} 
                  certificate={cert} 
                  showProject 
                  showPO 
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* How it works */}
      {!hasActiveFilters && (
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">¿Cómo funciona?</h3>
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h4 className="font-medium text-slate-700 mb-1">Escribe tu consulta</h4>
              <p className="text-sm text-slate-500">Usa lenguaje natural como si hablaras con un colega</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h4 className="font-medium text-slate-700 mb-1">La IA interpreta</h4>
              <p className="text-sm text-slate-500">Detecta proyectos, proveedores, estados y fechas</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h4 className="font-medium text-slate-700 mb-1">Ve los resultados</h4>
              <p className="text-sm text-slate-500">Ajusta los filtros generados si lo necesitas</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


import React from 'react';
import { Benchmark } from '../types';
import { Loader2 } from 'lucide-react';
import { formatNumber } from '../utils';

interface Props {
  benchmarks: Benchmark[];
  loading: boolean;
  onRegenerate: () => void;
}

const BenchmarkTable: React.FC<Props> = ({ benchmarks, loading, onRegenerate }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-slate-200 shadow-sm">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Analizando datos de mercado con IA...</p>
        <p className="text-slate-400 text-sm mt-2">Buscando startups comparables en tu sector</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
            <h3 className="text-lg font-semibold text-slate-800">Startups Comparables</h3>
            <p className="text-slate-500 text-sm">Benchmarks seleccionados por IA según industria y etapa</p>
        </div>
        <button 
            onClick={onRegenerate}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition"
        >
            Actualizar Datos
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium uppercase">
            <tr>
              <th className="px-6 py-4">Empresa</th>
              <th className="px-6 py-4">Región</th>
              <th className="px-6 py-4">EV/MRR</th>
              <th className="px-6 py-4">EV/Rev</th>
              <th className="px-6 py-4">EV/User</th>
              <th className="px-6 py-4 w-1/3">Racional</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {benchmarks.map((b, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-900">{b.name}</td>
                <td className="px-6 py-4 text-slate-500">{b.country}</td>
                <td className="px-6 py-4 text-blue-600 font-semibold">{formatNumber(b.evMrrMultiple)}x</td>
                <td className="px-6 py-4 text-slate-700">{formatNumber(b.evRevenueMultiple)}x</td>
                <td className="px-6 py-4 text-slate-700">${formatNumber(b.evUserMultiple, 0)}</td>
                <td className="px-6 py-4 text-slate-500 text-xs italic">{b.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BenchmarkTable;
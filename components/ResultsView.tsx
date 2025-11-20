import React, { useEffect, useState } from 'react';
import { ValuationResult, StartupData, Benchmark } from '../types';
import { formatCurrency, businessModelLabel, formatNumber } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, Sparkles } from 'lucide-react';
import { generateExecutiveSummary } from '../services/geminiService';
import { exportPDF } from '../utils/pdfExporter';
import RoadLogo from './RoadLogo';

interface Props {
  result: ValuationResult;
  data: StartupData;
  benchmarks?: Benchmark[];
}

const ResultsView: React.FC<Props> = ({ result, data, benchmarks }) => {
  const [summary, setSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true);
      const text = await generateExecutiveSummary(data, result);
      setSummary(text);
      setLoadingSummary(false);
    };
    fetchSummary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.base]);

  // Updated colors to match Road Branding (Indigo/Violet)
  const chartData = [
    { name: 'Conservador', value: result.conservative, color: '#94a3b8' }, // Slate 400
    { name: 'Caso Base', value: result.base, color: '#4F46E5' }, // Road Accent (Indigo 600)
    { name: 'Optimista', value: result.optimistic, color: '#10b981' }, // Emerald 500
  ];

  const handleDownloadPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    
    try {
        const safeIndustry = (data.industry || "Startup").toString();
        const cleanIndustry = safeIndustry.replace(/[^a-zA-Z0-9]/g, "");
        const dateStr = new Date().toISOString().split("T")[0];
        const fileName = `Val_${cleanIndustry}_${dateStr}`;

        setTimeout(async () => {
            await exportPDF("pdf-content", fileName);
            setIsExporting(false);
        }, 100);

    } catch (e) {
        console.error("Error en handler:", e);
        setIsExporting(false);
    }
  };

  const ChartAxes = () => (
    <>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
      <XAxis 
          dataKey="name" 
          tick={{fontSize: 12, fill: '#64748b'}} 
          axisLine={false}
          tickLine={false}
      />
      <YAxis 
          tickFormatter={(val) => `$${formatNumber(val/1000000, 1)}M`} 
          tick={{fontSize: 12, fill: '#64748b'}}
          axisLine={false}
          tickLine={false}
      />
      <Tooltip 
          cursor={{fill: '#f1f5f9'}}
          formatter={(value: number) => [formatCurrency(value), 'Valor']}
          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
      />
    </>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Contenedor Principal para PDF */}
      <div id="pdf-content" className="space-y-8 bg-slate-50 p-8 rounded-xl">
          
          {/* HEADER DEL REPORTE CON LOGO */}
          <div className="mb-6 border-b border-slate-300 pb-6 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
                {/* Logo Oficial en el Reporte */}
                <RoadLogo variant="horizontal" theme="light" width={180} className="mb-4" />
                <h2 className="text-xl font-bold text-slate-900 mb-1">Reporte de Valoración</h2>
                <p className="text-slate-500 text-sm">Análisis Automático de Múltiplos Comparables</p>
            </div>
            <div className="text-left md:text-right">
                 <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm inline-block text-left">
                    <p className="text-xs text-slate-400 uppercase mb-1">Fecha de Emisión</p>
                    <p className="text-sm font-semibold text-slate-800">{new Date().toLocaleDateString()}</p>
                    <p className="text-xs text-slate-400 uppercase mt-2 mb-1">ID de Referencia</p>
                    <p className="text-xs font-mono text-slate-600">{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                 </div>
            </div>
          </div>
            
          {/* Resumen de la Empresa */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <p className="mb-1"><span className="font-bold text-slate-700">Industria:</span> {data.industry}</p>
                    <p className="mb-1"><span className="font-bold text-slate-700">Modelo:</span> {businessModelLabel(data.businessModel)}</p>
                    <p className="mb-0"><span className="font-bold text-slate-700">Etapa:</span> {data.stage}</p>
                </div>
                <div>
                    <p className="mb-1"><span className="font-bold text-slate-700">MRR Actual:</span> {formatCurrency(data.mrr)}</p>
                    <p className="mb-1"><span className="font-bold text-slate-700">Crecimiento:</span> {formatNumber(data.mrrGrowth)}% Mensual</p>
                    <p className="mb-0"><span className="font-bold text-slate-700">Runway:</span> {data.runwayMonths} meses</p>
                </div>
          </div>

          {/* KPIs PRINCIPALES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-400"></div>
              <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Conservador</h3>
              <p className="text-2xl font-bold text-slate-700">{formatCurrency(result.conservative)}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md border border-indigo-100 text-center relative overflow-hidden transform md:scale-105 z-10">
               <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
              <h3 className="text-indigo-600 text-sm font-bold uppercase tracking-wider mb-2">Valoración Objetivo</h3>
              <p className="text-4xl font-extrabold text-slate-900">{formatCurrency(result.base)}</p>
               <p className="text-xs text-slate-400 mt-2">Múltiplos ponderados + Ajustes</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Optimista</h3>
              <p className="text-2xl font-bold text-slate-700">{formatCurrency(result.optimistic)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Escenarios de Valoración</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <ChartAxes />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Salud de Fundraising</h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Dilución Estimada</span>
                            <span className={`text-sm font-bold ${result.equityDilution > 20 ? 'text-red-500' : 'text-green-600'}`}>
                                {formatNumber(result.equityDilution)}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 border border-slate-200">
                            <div 
                                className={`h-2.5 rounded-full ${result.equityDilution > 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                                style={{ width: `${Math.min(result.equityDilution, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Objetivo: 10-20% para {data.stage}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-medium">Estado de Caja</p>
                            <p className={`text-lg font-semibold ${result.runwayStatus === 'Crítico' ? 'text-red-600' : 'text-slate-800'}`}>
                                {result.runwayStatus}
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-medium">Post-Money</p>
                            <p className="text-lg font-semibold text-slate-800">
                                {formatCurrency(result.base + data.seekingCapital)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-800">Resumen Ejecutivo</h3>
            </div>
            {loadingSummary ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                </div>
            ) : (
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm text-justify">
                    {summary || "Generando resumen..."}
                </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-700 text-sm">Metodología</h4>
              </div>
              <table className="w-full text-sm">
                  <thead className="text-slate-500 bg-slate-50">
                      <tr>
                          <th className="px-4 py-2 text-left">Método</th>
                          <th className="px-4 py-2 text-right">Peso</th>
                          <th className="px-4 py-2 text-right">Valor</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {result.methodologyBreakdown.map((m, i) => (
                          <tr key={i}>
                              <td className="px-4 py-2 font-medium text-slate-800">{m.method}</td>
                              <td className="px-4 py-2 text-right text-slate-600">{formatNumber(m.weight * 100, 0)}%</td>
                              <td className="px-4 py-2 text-right text-slate-600">{formatCurrency(m.value)}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-700 text-sm">Ajustes de Riesgo</h4>
              </div>
              <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                      {result.adjustments.map((adj, i) => (
                          <tr key={i}>
                              <td className="px-4 py-2 text-slate-700">{adj.name}</td>
                              <td className={`px-4 py-2 text-right font-medium ${adj.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {adj.impact > 0 ? '+' : ''}{formatNumber(adj.impact * 100, 0)}%
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {benchmarks && benchmarks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-300">
                <h4 className="font-bold text-slate-800 mb-3 text-sm">Comparables de Mercado (Benchmarks)</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead>
                            <tr className="border-b border-slate-300">
                                <th className="py-2 pr-2">Empresa</th>
                                <th className="py-2 pr-2">EV/MRR</th>
                                <th className="py-2 pr-2">EV/Rev</th>
                                <th className="py-2 w-1/3">Racional</th>
                            </tr>
                        </thead>
                        <tbody>
                            {benchmarks.map((b, i) => (
                                <tr key={i} className="border-b border-slate-200">
                                    <td className="py-2 pr-2 font-medium">{b.name} ({b.country})</td>
                                    <td className="py-2 pr-2">{formatNumber(b.evMrrMultiple)}x</td>
                                    <td className="py-2 pr-2">{formatNumber(b.evRevenueMultiple)}x</td>
                                    <td className="py-2 italic text-slate-500">{b.rationale}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}
      </div>

      <div className="flex flex-col items-end gap-2 pt-4 pb-12">
        <button 
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className={`flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium shadow-lg active:scale-95 ${isExporting ? 'opacity-70 cursor-wait' : ''}`}
        >
            <Download className="w-4 h-4" /> {isExporting ? 'Generando PDF...' : 'Exportar PDF'}
        </button>
      </div>
    </div>
  );
};

export default ResultsView;

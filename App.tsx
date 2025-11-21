import React, { useState, useCallback } from 'react';
import { BusinessModel, Stage, StartupData, Benchmark, RiskAdjustments, ValuationResult } from './types';
import { calculateValuation } from './utils';
import { generateBenchmarks } from './services/geminiService';
import InputForm from './components/InputForm';
import BenchmarkTable from './components/BenchmarkTable';
import ResultsView from './components/ResultsView';
import RoadLogo from './components/RoadLogo';
import { ChevronRight, Check, Layers, Sliders, PieChart, AlertTriangle } from 'lucide-react';

// Initial State Defaults
const initialData: StartupData = {
  industry: '',
  businessModel: BusinessModel.SAAS,
  country: 'USA',
  stage: Stage.PRE_SEED,
  foundingDate: '',
  mrr: 0,
  mrrGrowth: 0,
  activeUsers: 0,
  retentionRate: 0,
  cac: 0,
  ltv: 0,
  burnRate: 0,
  runwayMonths: 12,
  lastRevenue: 0,
  tam: 0,
  sam: 0,
  som: 0,
  raisedCapital: 0,
  seekingCapital: 0,
  equityOffered: 0,
};

const initialAdjustments: RiskAdjustments = {
  teamQuality: 'duo',
  marketRisk: 'medium',
  productStage: 'beta',
  competition: 'moderate',
};

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StartupData>(initialData);
  const [adjustments, setAdjustments] = useState<RiskAdjustments>(initialAdjustments);
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [loadingBenchmarks, setLoadingBenchmarks] = useState(false);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);

  const handleNext = async () => {
    if (step === 1) {
      if (!data.industry || !data.mrr) {
        alert("Por favor completa la Industria y el MRR para continuar.");
        return;
      }
      setLoadingBenchmarks(true);
      setStep(2); // Move to UI while loading
      const result = await generateBenchmarks(data);
      setBenchmarks(result);
      setLoadingBenchmarks(false);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      const result = calculateValuation(data, benchmarks, adjustments);
      setValuationResult(result);
      setStep(4);
    }
  };

  const handleBack = () => setStep(Math.max(1, step - 1));

  const steps = [
    { id: 1, name: 'Datos', icon: Layers },
    { id: 2, name: 'Comparables', icon: PieChart },
    { id: 3, name: 'Ajustes', icon: Sliders },
    { id: 4, name: 'Valoración', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 print:pb-0 print:bg-white">
      {/* Header */}
      <header className="bg-slate-900 text-white pt-8 pb-24 px-4 sm:px-6 lg:px-8 no-print border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            {/* LOGO INTEGRATION */}
            <RoadLogo variant="horizontal" theme="white" width={220} className="mb-3" />
            <p className="text-slate-400 text-lg max-w-xl">
              Valoración Profesional por Comparables para Startups Pre-Seed y Seed. 
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-xs font-medium uppercase tracking-wider">
              Powered by Road Consulting
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto -mt-16 px-4 sm:px-6 lg:px-8 print:mt-0 print:max-w-none print:px-0 print:mx-0">
        {/* Step Indicator */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8 flex justify-between items-center overflow-x-auto no-print">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center min-w-fit">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= s.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-300'}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className={`ml-3 font-medium text-sm ${step >= s.id ? 'text-slate-800' : 'text-slate-400'}`}>{s.name}</span>
              {idx < steps.length - 1 && <div className="w-12 h-0.5 bg-slate-100 mx-4 hidden md:block"></div>}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6 print:space-y-0">
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <InputForm data={data} onChange={setData} />
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <BenchmarkTable 
                benchmarks={benchmarks} 
                loading={loadingBenchmarks} 
                onRegenerate={async () => {
                    setLoadingBenchmarks(true);
                    const res = await generateBenchmarks(data);
                    setBenchmarks(res);
                    setLoadingBenchmarks(false);
                }}
              />
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right-8 duration-300 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
               <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <Sliders className="text-indigo-600 w-6 h-6" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Ajustes de Riesgo y Calidad</h3>
                    <p className="text-slate-500 text-sm">Factores cualitativos que impactan tu premio o descuento.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block font-medium text-slate-700 mb-2">Equipo Fundador</label>
                        <select 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={adjustments.teamQuality}
                            onChange={(e) => setAdjustments({...adjustments, teamQuality: e.target.value as any})}
                        >
                            <option value="solo">Fundador Único (-10%)</option>
                            <option value="duo">2-3 Fundadores (Estándar)</option>
                            <option value="experienced_team">Equipo Experimentado (+15%)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium text-slate-700 mb-2">Madurez del Producto</label>
                         <select 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={adjustments.productStage}
                            onChange={(e) => setAdjustments({...adjustments, productStage: e.target.value as any})}
                        >
                            <option value="mvp">MVP / Prototipo</option>
                            <option value="beta">Beta Privada</option>
                            <option value="pmf">PMF Temprano</option>
                        </select>
                    </div>
                    <div>
                         <label className="block font-medium text-slate-700 mb-2">Densidad de Competencia</label>
                         <select 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={adjustments.competition}
                            onChange={(e) => setAdjustments({...adjustments, competition: e.target.value as any})}
                        >
                            <option value="saturated">Saturada / Alta</option>
                            <option value="moderate">Moderada</option>
                            <option value="blue_ocean">Océano Azul / Baja</option>
                        </select>
                    </div>
                </div>
                
                <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
                    <AlertTriangle className="text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-800">
                        Los descuentos calculados también se aplicarán automáticamente basándose en el Runway ({data.runwayMonths} meses) y Crecimiento ({data.mrrGrowth}%) que ingresaste previamente.
                    </p>
                </div>
            </div>
          )}

          {step === 4 && valuationResult && (
            <ResultsView result={valuationResult} data={data} benchmarks={benchmarks} />
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center no-print">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg font-medium transition ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            Atrás
          </button>
          
          {step < 4 && (
             <button
                onClick={handleNext}
                disabled={loadingBenchmarks}
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loadingBenchmarks ? 'Procesando...' : step === 3 ? 'Calcular Valoración' : 'Siguiente Paso'}
                {!loadingBenchmarks && <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
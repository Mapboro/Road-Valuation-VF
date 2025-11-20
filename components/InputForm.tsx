import React from 'react';
import { StartupData, BusinessModel, Stage } from '../types';
import { AlertCircle, Building, DollarSign, TrendingUp } from 'lucide-react';

interface Props {
  data: StartupData;
  onChange: (data: StartupData) => void;
}

const InputForm: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof StartupData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const businessModelMap: Record<string, string> = {
    [BusinessModel.SAAS]: "SaaS",
    [BusinessModel.MARKETPLACE]: "Marketplace",
    [BusinessModel.ECOMMERCE]: "eCommerce",
    [BusinessModel.FINTECH]: "Fintech",
    [BusinessModel.PROPTECH]: "Proptech",
    [BusinessModel.OTHER]: "Otro",
  };

  return (
    <div className="space-y-8">
      {/* Company Info */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
          <Building className="text-blue-600 w-5 h-5" />
          <h3 className="text-lg font-semibold text-slate-800">Perfil de la Empresa</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Industria</label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={data.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              placeholder="Ej: HealthTech"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Modelo de Negocio</label>
            <select
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={data.businessModel}
              onChange={(e) => handleChange('businessModel', e.target.value as BusinessModel)}
            >
              {Object.values(BusinessModel).map((m) => (
                <option key={m} value={m}>{businessModelMap[m] || m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">País</label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
              value={data.country}
              onChange={(e) => handleChange('country', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Etapa</label>
            <select
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none bg-white"
              value={data.stage}
              onChange={(e) => handleChange('stage', e.target.value as Stage)}
            >
              {Object.values(Stage).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
          <TrendingUp className="text-green-600 w-5 h-5" />
          <h3 className="text-lg font-semibold text-slate-800">Tracción y Métricas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">MRR Actual (USD)</label>
            <input
              type="number"
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
              value={data.mrr}
              onChange={(e) => handleChange('mrr', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Crecimiento Mensual (%)</label>
            <input
              type="number"
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
              value={data.mrrGrowth}
              onChange={(e) => handleChange('mrrGrowth', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuarios Activos</label>
            <input
              type="number"
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
              value={data.activeUsers}
              onChange={(e) => handleChange('activeUsers', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">LTV Est. (USD)</label>
            <input
              type="number"
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
              value={data.ltv}
              onChange={(e) => handleChange('ltv', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CAC Est. (USD)</label>
            <input
              type="number"
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
              value={data.cac}
              onChange={(e) => handleChange('cac', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tasa de Retención (%)</label>
            <input
              type="number"
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
              value={data.retentionRate}
              onChange={(e) => handleChange('retentionRate', Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      {/* Investment & Runway */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
          <DollarSign className="text-purple-600 w-5 h-5" />
          <h3 className="text-lg font-semibold text-slate-800">Inversión y Salud Financiera</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Burn Rate (Mensual)</label>
            <input
              type="number"
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
              value={data.burnRate}
              onChange={(e) => handleChange('burnRate', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Runway (Meses)</label>
            <input
              type="number"
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
              value={data.runwayMonths}
              onChange={(e) => handleChange('runwayMonths', Number(e.target.value))}
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Capital Buscado</label>
            <input
              type="number"
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
              value={data.seekingCapital}
              onChange={(e) => handleChange('seekingCapital', Number(e.target.value))}
            />
          </div>
        </div>
        {data.runwayMonths < 6 && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Caja baja detectada (Low Runway). Esto impactará negativamente la valoración.
            </div>
        )}
      </section>
    </div>
  );
};

export default InputForm;
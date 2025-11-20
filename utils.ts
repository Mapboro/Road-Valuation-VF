import { Benchmark, RiskAdjustments, Stage, StartupData, ValuationResult, BusinessModel } from "./types";

export const formatCurrency = (amount: number) => {
  // Formato: $ 1.000.000 (Punto para miles, sin decimales por defecto para valoraciones grandes)
  return '$ ' + amount.toLocaleString('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const formatNumber = (amount: number, decimals: number = 1) => {
  // Formato: 12,5 (Coma para decimales)
  return amount.toLocaleString('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Mapas de traducción para reportes
export const businessModelLabel = (model: BusinessModel): string => {
  const map: Record<string, string> = {
    [BusinessModel.SAAS]: "SaaS",
    [BusinessModel.MARKETPLACE]: "Marketplace",
    [BusinessModel.ECOMMERCE]: "eCommerce",
    [BusinessModel.FINTECH]: "Fintech",
    [BusinessModel.PROPTECH]: "Proptech",
    [BusinessModel.OTHER]: "Otro",
  };
  return map[model] || model;
};

export const stageLabel = (stage: Stage): string => {
  return stage; // Los enums ya están "bonitos" o se pueden traducir aquí si es necesario
};

export const calculateValuation = (
  data: StartupData,
  benchmarks: Benchmark[],
  adjustments: RiskAdjustments
): ValuationResult => {
  // 1. Averages from benchmarks
  const avgMrrMult = benchmarks.reduce((sum, b) => sum + b.evMrrMultiple, 0) / benchmarks.length;
  const avgRevMult = benchmarks.reduce((sum, b) => sum + b.evRevenueMultiple, 0) / benchmarks.length;
  const avgUserMult = benchmarks.reduce((sum, b) => sum + b.evUserMultiple, 0) / benchmarks.length;

  // 2. Raw Methods
  // Method A: EV / Annualized MRR
  const valMrr = (data.mrr * 12) * avgRevMult; 
  const valMrrDirect = data.mrr * avgMrrMult; 
  
  // Method B: EV / Sales (using last revenue annualized if different, otherwise MRR*12)
  const annualRevenue = Math.max(data.lastRevenue, data.mrr * 12);
  const valSales = annualRevenue * avgRevMult;

  // Method C: User based
  const valUsers = data.activeUsers * avgUserMult;

  // Method D: LTV/CAC Approach (Simple Unit Economics Valuation Proxy)
  // (LTV / CAC) * Annual Revenue * Factor (proxy for health)
  const efficiencyRatio = data.cac > 0 ? data.ltv / data.cac : 1;
  const valUnitEcon = annualRevenue * Math.min(efficiencyRatio * 2, 15); // Cap multiplier

  // 3. Weighting (Pre-Seed favors MRR/Sales, Seed favors Growth/Unit Econ)
  const rawWeighted = (valMrrDirect * 0.3) + (valSales * 0.3) + (valUsers * 0.2) + (valUnitEcon * 0.2);

  // 4. Adjustments
  const activeAdjustments: { name: string; impact: number }[] = [];

  // Stage Adjustment
  if (data.stage === Stage.PRE_SEED) {
    activeAdjustments.push({ name: "Descuento Etapa Pre-Seed", impact: -0.30 });
  } else {
    activeAdjustments.push({ name: "Descuento Etapa Seed", impact: -0.15 });
  }

  // Runway Risk
  if (data.runwayMonths < 6) {
    activeAdjustments.push({ name: "Riesgo Alto de Caja (<6m)", impact: -0.15 });
  } else if (data.runwayMonths < 12) {
    activeAdjustments.push({ name: "Riesgo Moderado de Caja (6-12m)", impact: -0.05 });
  }

  // Team Quality
  if (adjustments.teamQuality === 'solo') {
    activeAdjustments.push({ name: "Riesgo Fundador Único", impact: -0.10 });
  } else if (adjustments.teamQuality === 'experienced_team') {
    activeAdjustments.push({ name: "Premium Equipo Experimentado", impact: 0.15 });
  }

  // Growth Premium (Simple rule)
  if (data.mrrGrowth > 15) {
    activeAdjustments.push({ name: "Premium Alto Crecimiento (>15% CMGR)", impact: 0.10 });
  }

  // Calculate Total Adjustment Factor
  const totalAdjustmentFactor = 1 + activeAdjustments.reduce((sum, adj) => sum + adj.impact, 0);

  const baseValuation = rawWeighted * totalAdjustmentFactor;

  return {
    base: baseValuation,
    conservative: baseValuation * 0.8,
    optimistic: baseValuation * 1.2,
    methodologyBreakdown: [
      { method: "Múltiplo EV / MRR", value: valMrrDirect, weight: 0.3 },
      { method: "EV / Ventas (Revenue)", value: valSales, weight: 0.3 },
      { method: "Valor por Usuario", value: valUsers, weight: 0.2 },
      { method: "Economía Unitaria (LTV/CAC)", value: valUnitEcon, weight: 0.2 },
    ],
    adjustments: activeAdjustments,
    equityDilution: (data.seekingCapital / baseValuation) * 100,
    runwayStatus: data.runwayMonths < 6 ? "Crítico" : data.runwayMonths < 12 ? "Alerta" : "Saludable",
  };
};
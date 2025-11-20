export enum Stage {
  PRE_SEED = 'Pre-Seed',
  SEED = 'Seed',
}

export enum BusinessModel {
  SAAS = 'SaaS',
  MARKETPLACE = 'Marketplace',
  ECOMMERCE = 'eCommerce',
  FINTECH = 'Fintech',
  PROPTECH = 'Proptech',
  OTHER = 'Other',
}

export interface StartupData {
  industry: string;
  businessModel: BusinessModel;
  country: string;
  stage: Stage;
  foundingDate: string;
  
  // Financials
  mrr: number;
  mrrGrowth: number; // Percentage
  activeUsers: number;
  retentionRate: number; // Percentage
  cac: number;
  ltv: number;
  burnRate: number;
  runwayMonths: number;
  lastRevenue: number; // Annualized or LTM

  // Market
  tam: number;
  sam: number;
  som: number;

  // Investment
  raisedCapital: number;
  seekingCapital: number;
  equityOffered: number; // Percentage
}

export interface Benchmark {
  name: string;
  country: string;
  industry: string;
  evMrrMultiple: number;
  evRevenueMultiple: number;
  evUserMultiple: number;
  rationale: string;
}

export interface RiskAdjustments {
  teamQuality: 'solo' | 'duo' | 'experienced_team';
  marketRisk: 'high' | 'medium' | 'low';
  productStage: 'mvp' | 'beta' | 'pmf';
  competition: 'saturated' | 'moderate' | 'blue_ocean';
}

export interface ValuationResult {
  conservative: number;
  base: number;
  optimistic: number;
  methodologyBreakdown: {
    method: string;
    value: number;
    weight: number;
  }[];
  adjustments: {
    name: string;
    impact: number; // Percentage decimal (e.g., -0.15 for -15%)
  }[];
  equityDilution: number;
  runwayStatus: string;
}

import { GoogleGenAI, Type } from "@google/genai";
import { Benchmark, StartupData, ValuationResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBenchmarks = async (data: StartupData): Promise<Benchmark[]> => {
  if (!apiKey) {
    console.warn("No API Key provided. Returning mock data.");
    return getMockBenchmarks();
  }

  const prompt = `
    Genera 6 benchmarks de startups realistas y comparables para una compañía en etapa ${data.stage} en la industria ${data.industry} (Modelo: ${data.businessModel}) ubicada en ${data.country}.
    
    Asegúrate de que los múltiplos sean realistas para el mercado de Venture Capital actual:
    - EV/MRR: típicamente 8x - 25x dependiendo del crecimiento.
    - EV/Revenue: típicamente 5x - 15x.
    - EV/User: depende de la industria (usa rangos realistas).
    
    El campo 'rationale' (racional) debe estar escrito en ESPAÑOL explicando por qué es comparable.
    
    Devuelve PURO JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              country: { type: Type.STRING },
              industry: { type: Type.STRING },
              evMrrMultiple: { type: Type.NUMBER },
              evRevenueMultiple: { type: Type.NUMBER },
              evUserMultiple: { type: Type.NUMBER },
              rationale: { type: Type.STRING, description: "Explanation in Spanish" },
            },
            required: ["name", "country", "industry", "evMrrMultiple", "evRevenueMultiple", "evUserMultiple", "rationale"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text) as Benchmark[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getMockBenchmarks();
  }
};

export const generateExecutiveSummary = async (data: StartupData, valuation: ValuationResult): Promise<string> => {
  if (!apiKey) return "Falta la API Key. No se puede generar el resumen con IA.";

  const prompt = `
    Escribe un resumen financiero ejecutivo profesional para un reporte de valoración de startup.
    Idioma: ESPAÑOL.
    Estilo: Consultoría (McKinsey / Deloitte / Road Consulting).
    IMPORTANTE: Usa formato numérico español con punto para miles y coma para decimales (ej: $1.500.000,00).
    
    Contexto de la Startup:
    - Industria: ${data.industry} (${data.businessModel})
    - Etapa: ${data.stage}
    - MRR: $${data.mrr}
    - Crecimiento: ${data.mrrGrowth}%
    - Runway: ${data.runwayMonths} meses
    
    Resultados de Valoración:
    - Rango: $${(valuation.conservative / 1000000).toFixed(2)}M - $${(valuation.optimistic / 1000000).toFixed(2)}M (USD)
    - Base (Objetivo): $${(valuation.base / 1000000).toFixed(2)}M
    
    Instrucciones:
    1. Proporciona una "Tesis de Inversión" sucinta.
    2. Explica el "Racional de Valoración" citando el crecimiento y mercado.
    3. Da una evaluación de "Fundraising Fit" (¿es realista lo que piden?).
    4. Manténlo bajo 300 palabras. Usa formato Markdown profesional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Análisis no disponible.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Error generando el resumen.";
  }
};

const getMockBenchmarks = (): Benchmark[] => [
  {
    name: "EcoLogix (Simulado)",
    country: "USA",
    industry: "SaaS",
    evMrrMultiple: 12.5,
    evRevenueMultiple: 10.2,
    evUserMultiple: 150,
    rationale: "Perfil de crecimiento similar y segmento de mercado."
  },
  {
    name: "MarketFlow",
    country: "UK",
    industry: "SaaS",
    evMrrMultiple: 14.0,
    evRevenueMultiple: 11.5,
    evUserMultiple: 180,
    rationale: "Tasas de churn comparables y estructura de LTV."
  },
  {
    name: "NexaTech",
    country: "Brasil",
    industry: "SaaS",
    evMrrMultiple: 9.5,
    evRevenueMultiple: 7.8,
    evUserMultiple: 90,
    rationale: "Comparable regional con escala de operaciones similar."
  },
];
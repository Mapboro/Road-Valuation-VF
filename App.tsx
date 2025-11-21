import React from "react";
import RoadLogo from "./components/RoadLogo";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">

      {/* Logo */}
      <div className="mb-8">
        <RoadLogo variant="horizontal" theme="light" width={220} />
      </div>

      {/* Título */}
      <h1 className="text-4xl font-bold text-slate-800 mb-4">
        SeedValuate Pro
      </h1>

      {/* Subtítulo */}
      <p className="text-lg text-slate-600 max-w-xl text-center mb-10">
        Plataforma de valorización de startups en etapa Pre-Seed y Seed
        basada en comparables de mercado.
      </p>

      {/* Tarjeta principal */}
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center border border-slate-200">
        <p className="text-slate-700 mb-6">
          ✅ Tu aplicación está funcionando correctamente en Vercel.
        </p>

        <button
          onClick={() => alert("¡Todo funcionando correctamente 🚀!")}
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 px-6 rounded-lg font-semibold"
        >
          Probar funcionamiento
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-14 text-sm text-slate-400">
        Powered by Road Consulting
      </footer>
    </div>
  );
};

export default App;


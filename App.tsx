// App.tsx – Test mínimo

import React from "react";

const App: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        color: "white",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>
        ✅ Road Valuation está funcionando
      </h1>
      <p style={{ fontSize: "18px", maxWidth: 600, textAlign: "center", opacity: 0.9 }}>
        Si ves este mensaje, el problema NO es Vercel ni Vite, sino algún error en el
        componente original <code>App.tsx</code> o en sus imports.
      </p>
    </div>
  );
};

export default App;


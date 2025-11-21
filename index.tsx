<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Road Valuation | Valorización de Startups</title>

    <!-- Tailwind por CDN (opcional, lo puedes mantener) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />

    <!-- LIBRERÍAS PDF GLOBALES (para html2canvas + jsPDF) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

    <style>
      body {
        font-family: 'Inter', sans-serif;
        background-color: #f8fafc;
      }

      #pdf-content {
        background-color: white;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>

    <!-- 🔹 AQUÍ es donde realmente se monta React con Vite -->
    <script type="module" src="/main.tsx"></script>
  </body>
</html>

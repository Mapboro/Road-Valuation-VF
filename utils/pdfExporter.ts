// No imports ESM here to avoid bundler issues in AI Studio
// We use the global window objects injected via index.html scripts

export async function exportPDF(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error(`Element with id '${elementId}' not found.`);
    alert("Error interno: No se encontró el contenido para exportar.");
    return;
  }

  // 1. Acceder a las librerías globales
  const html2canvasFn = (window as any).html2canvas;
  const jspdfLib = (window as any).jspdf;

  if (!html2canvasFn || !jspdfLib) {
    console.error("Librerías PDF no cargadas. Verifica index.html");
    alert("Error: El sistema de PDF no se cargó correctamente. Recarga la página.");
    return;
  }

  const { jsPDF } = jspdfLib;

  try {
    // 2. Generar Canvas desde el DOM
    // scale: 2 mejora la calidad (retina/high-res)
    const canvas = await html2canvasFn(element, {
      scale: 2,
      useCORS: true, // Permite cargar imágenes externas si las hubiera
      logging: false,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");

    // 3. Configurar PDF (A4)
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm normalmente
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm normalmente

    // Calcular altura de la imagen ajustada al ancho del PDF
    const imgPropsWidth = canvas.width;
    const imgPropsHeight = canvas.height;
    const imgHeightInPdf = (imgPropsHeight * pdfWidth) / imgPropsWidth;

    let heightLeft = imgHeightInPdf;
    let position = 0;

    // 4. Añadir primera página
    // addImage(data, format, x, y, w, h)
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeightInPdf);
    heightLeft -= pdfHeight;

    // 5. Añadir páginas extra si el contenido es largo
    while (heightLeft > 0) {
      position = heightLeft - imgHeightInPdf; // Ajuste para siguiente página
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeightInPdf);
      heightLeft -= pdfHeight;
    }

    // 6. Descargar
    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Hubo un error generando el archivo PDF. Por favor intenta de nuevo.");
  }
}
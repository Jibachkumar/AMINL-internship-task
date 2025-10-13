import PDFDocument from "pdfkit";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

export const generatePdfReport = async ({
  title,
  data,
  barData,
  lineData,
  pieData,
}) => {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  const chunks = [];
  const pdfBufferPromise = new Promise((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));
  });

  // === Title ===
  doc.fontSize(18).text(title, { align: "center" });
  doc.moveDown(1.5);

  // === Chart Renderer ===
  const chartCanvas = new ChartJSNodeCanvas({ width: 800, height: 400 });

  // --- Bar Chart ---
  const barChartImage = await chartCanvas.renderToBuffer({
    type: "bar",
    data: barData,
    options: {
      responsive: false,
      plugins: { legend: { position: "top" } },
      scales: { y: { beginAtZero: true } },
    },
  });

  doc.image(barChartImage, { width: 500, align: "center" });
  doc.moveDown(1.5);

  // --- Line Chart ---
  const lineChartImage = await chartCanvas.renderToBuffer({
    type: "line",
    data: lineData,
    options: {
      responsive: false,
      plugins: { legend: { position: "top" } },
      scales: { y: { beginAtZero: true } },
    },
  });

  doc.image(lineChartImage, { width: 500, align: "center" });
  doc.moveDown(2);

  //---- pie chart -----
  doc.addPage();
  const pieCanvas = new ChartJSNodeCanvas({ width: 600, height: 400 });
  const pieChartImage = await pieCanvas.renderToBuffer({
    type: "pie",
    data: pieData,
    options: {
      plugins: {
        legend: { position: "right" },
        title: { display: true, text: "Sales Distribution" },
      },
    },
  });
  doc.fontSize(16).text("Sales Distribution (Pie Chart)", {
    align: "center",
    underline: true,
  });
  doc.moveDown(1);

  doc.image(pieChartImage, {
    width: 450,
    align: "center",
    valign: "center",
  });
  doc.moveDown(2);

  // === Table Section ===
  doc.fontSize(14).text("Summary Data", { underline: true });
  doc.moveDown(0.5);

  const tableTop = doc.y;
  const colWidths = [150, 150, 150];
  const headers = Object.keys(data[0]);

  // Headers
  headers.forEach((header, i) => {
    doc.font("Helvetica-Bold").text(header, 50 + i * colWidths[i], tableTop, {
      width: colWidths[i],
    });
  });

  // Rows
  data.forEach((row, rowIndex) => {
    const y = tableTop + 20 + rowIndex * 20;
    Object.values(row).forEach((val, i) => {
      doc.font("Helvetica").text(String(val), 50 + i * colWidths[i], y, {
        width: colWidths[i],
      });
    });
  });

  // End PDF and return buffer
  doc.end();
  return pdfBufferPromise;
};

"use client";

export default function ExportControls({ exportPDF, exportExcel }) {
  return (
    <>
      <button onClick={exportPDF}>Export PDF</button>
      <button onClick={exportExcel}>Export Excel</button>
    </>
  );
}

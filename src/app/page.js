"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const UNIT_OPTIONS = ["m²", "m³", "m", "kg", "tons", "pcs", "item"];
const CURRENCY_OPTIONS = ["R", "$", "€", "£"]; // Optional for future

export default function Home() {
  const [projectName, setProjectName] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [currency, setCurrency] = useState("R"); // Default currency

  const [boq, setBoq] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  // Generate BOQ
  const generateBOQ = async () => {
    try {
      const res = await fetch("/api/boq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectName, area, location }),
      });

      if (!res.ok) throw new Error("Failed to fetch BOQ");

      const data = await res.json();

      setBoq(Array.isArray(data.items) ? data.items : []);
      setGrandTotal(Number(data.grandTotal) || 0);
    } catch (err) {
      console.error(err);
      alert("Failed to generate BOQ. Check console.");
    }
  };

  // Update item field
  const updateItem = (index, field, value) => {
    const updated = [...boq];
    updated[index][field] = value;

    if (field === "qty" || field === "rate") {
      updated[index].total =
        Number(updated[index].qty) * Number(updated[index].rate);
    }

    setBoq(updated);
    recalcGrandTotal(updated);
  };

  // Recalculate grand total
  const recalcGrandTotal = (items) => {
    const total = items.reduce((sum, item) => sum + Number(item.total || 0), 0);
    setGrandTotal(total);
  };

  // Add item
  const addItem = () => {
    const newItem = {
      name: "New Item",
      qty: 0,
      unit: "m²",
      rate: 0,
      total: 0,
    };
    setBoq((prev) => [...prev, newItem]);
  };

  // Delete item
  const deleteItem = (index) => {
    const updated = boq.filter((_, i) => i !== index);
    setBoq(updated);
    recalcGrandTotal(updated);
  };

  // Reset BOQ
  const resetBOQ = () => {
    if (!confirm("Are you sure you want to reset the BOQ?")) return;
    setBoq([]);
    setGrandTotal(0);
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Thapello AI - BOQ", 14, 20);

    doc.setFontSize(12);
    doc.text(`Project: ${projectName}`, 14, 30);
    doc.text(`Area: ${area}`, 14, 36);
    doc.text(`Location: ${location}`, 14, 42);

    const tableData = boq.map((item) => [
      item.name,
      item.qty,
      item.unit,
      `${currency} ${Number(item.rate).toFixed(2)}`,
      `${currency} ${Number(item.total).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Item", "Qty", "Unit", "Rate", "Total"]],
      body: tableData,
      theme: "grid",
    });

    doc.text(
      `Grand Total: ${currency} ${grandTotal.toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save(`${projectName || "BOQ"}.pdf`);
  };

  // Export Excel
  const exportExcel = () => {
    const wsData = [
      ["Item", "Qty", "Unit", "Rate", "Total"],
      ...boq.map((item) => [
        item.name,
        item.qty,
        item.unit,
        Number(item.rate),
        Number(item.total),
      ]),
      ["Grand Total", "", "", "", grandTotal],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "BOQ");

    XLSX.writeFile(wb, `${projectName || "BOQ"}.xlsx`);
  };

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Thapello AI - BOQ Generator</h1>

      {/* INPUT FORM */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Area (m²)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {CURRENCY_OPTIONS.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button
          type="button"
          onClick={generateBOQ}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Generate BOQ
        </button>

        {boq?.length > 0 && (
          <>
            <button
              type="button"
              onClick={addItem}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              + Add Item
            </button>
            <button
              type="button"
              onClick={resetBOQ}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Reset BOQ
            </button>
            <button
              type="button"
              onClick={exportPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Export PDF
            </button>
            <button
              type="button"
              onClick={exportExcel}
              className="bg-orange-600 text-white px-4 py-2 rounded"
            >
              Export Excel
            </button>
          </>
        )}
      </div>

      {/* BOQ TABLE */}
      {boq?.length > 0 && (
        <div className="overflow-x-auto border rounded">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">Item</th>
                <th className="p-3 border">Qty</th>
                <th className="p-3 border">Unit</th>
                <th className="p-3 border">Rate</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {boq.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <input
                      className="w-full p-1 border rounded"
                      value={item.name || ""}
                      onChange={(e) =>
                        updateItem(index, "name", e.target.value)
                      }
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded"
                      value={item.qty || 0}
                      onChange={(e) =>
                        updateItem(index, "qty", e.target.value)
                      }
                    />
                  </td>
                  <td className="border p-2">
                    <select
                      className="w-full p-1 border rounded"
                      value={item.unit || "m²"}
                      onChange={(e) =>
                        updateItem(index, "unit", e.target.value)
                      }
                    >
                      {UNIT_OPTIONS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded"
                      value={item.rate || 0}
                      onChange={(e) =>
                        updateItem(index, "rate", e.target.value)
                      }
                    />
                  </td>
                  <td className="border p-2 font-semibold">
                    {currency} {Number(item.total || 0).toFixed(2)}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      type="button"
                      onClick={() => deleteItem(index)}
                      className="text-red-600 font-bold"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* GRAND TOTAL */}
      {boq?.length > 0 && (
        <div className="mt-6 text-right text-xl font-bold">
          Grand Total: {currency} {grandTotal.toFixed(2)}
        </div>
      )}
    </main>
  );
}
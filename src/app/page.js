"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "./lib/useAuth";
import { db } from "./lib/firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import ProjectDetailsForm from "./components/ProjectDetailsForm";
import BOQEditor from "./components/BOQEditor";
import ExportControls from "./components/ExportControls";
import SavedProjectsList from "./components/SavedProjectsList";
import ProjectIntelligenceProfile from "./components/ProjectIntelligenceProfile";
import IntelligencePreviewPanel from "./components/IntelligencePreviewPanel";
import { analyzeProjectProfile } from "./lib/intelligence/rulesEngine";

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [authChecked, setAuthChecked] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [currency, setCurrency] = useState("R");

  const [boq, setBoq] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [projectType, setProjectType] = useState("");
  const [buildingCategory, setBuildingCategory] = useState("");
  const [constructionMethod, setConstructionMethod] = useState("");
  const [qualityLevel, setQualityLevel] = useState("");

  const [projects, setProjects] = useState([]);

  const units = [
    "m²",
    "m³",
    "m",
    "kg",
    "tons",
    "pcs",
    "item",
  ];

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        setAuthChecked(true);
        loadProjects();
      }
    }
  }, [loading, user, router]);

  useEffect(() => {
    const total = boq.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    );

    setGrandTotal(total);
  }, [boq]);

  const generateBOQ = async () => {
    try {
      setIsGenerating(true);

      const analysis = analyzeProjectProfile({
        projectType,
        buildingCategory,
        constructionMethod,
        qualityLevel,
      });

      const response = await fetch("/api/boq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          area,
          location,
          projectType,
          buildingCategory,
          constructionMethod,
          qualityLevel,
          intelligenceAnalysis: analysis,
        }),
      });

      const data = await response.json();

      setBoq(data.items || []);
      setGrandTotal(data.grandTotal || 0);
    } catch (error) {
      console.error(error);
      alert("Failed to generate BOQ");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateItem = (index, field, value) => {
    const updated = [...boq];

    updated[index][field] = value;

    const qty = Number(updated[index].qty || 0);
    const rate = Number(updated[index].rate || 0);

    updated[index].total = qty * rate;

    setBoq(updated);
  };

  const addItem = () => {
    setBoq([
      ...boq,
      {
        name: "",
        qty: 0,
        unit: "item",
        rate: 0,
        total: 0,
      },
    ]);
  };

  const deleteItem = (index) => {
    const updated = boq.filter((_, i) => i !== index);
    setBoq(updated);
  };

  const resetBOQ = () => {
    setProjectName("");
    setArea("");
    setLocation("");
    setCurrency("R");
    setProjectType("");
    setBuildingCategory("");
    setConstructionMethod("");
    setQualityLevel("");
    setBoq([]);
    setGrandTotal(0);
  };

  const exportPDF = () => {
    if (boq.length === 0) {
      alert("No BOQ data available.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Thapello AI - BOQ Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Project: ${projectName}`, 14, 35);
    doc.text(`Area: ${area}`, 14, 42);
    doc.text(`Location: ${location}`, 14, 49);
    doc.text(`Currency: ${currency}`, 14, 56);

    autoTable(doc, {
      startY: 65,
      head: [["Item", "Qty", "Unit", "Rate", "Total"]],
      body: boq.map((item) => [
        item.name,
        item.qty,
        item.unit,
        item.rate,
        `${currency}${Number(item.total).toFixed(2)}`,
      ]),
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.text(
      `Grand Total: ${currency}${grandTotal.toFixed(2)}`,
      14,
      finalY
    );

    doc.save("Thapello_AI_BOQ_Report.pdf");
  };

  const exportExcel = () => {
    if (boq.length === 0) {
      alert("No BOQ data available.");
      return;
    }

    const worksheetData = [
      ["Project Name", projectName],
      ["Area", area],
      ["Location", location],
      ["Currency", currency],
      [],
      ["Item", "Qty", "Unit", "Rate", "Total"],
      ...boq.map((item) => [
        item.name,
        item.qty,
        item.unit,
        item.rate,
        item.total,
      ]),
      [],
      ["Grand Total", grandTotal],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BOQ");
    XLSX.writeFile(workbook, "Thapello_AI_BOQ_Report.xlsx");
  };

  const saveProject = async () => {
    try {
      if (!projectName) {
        alert("Please enter a project name.");
        return;
      }

      setIsSaving(true);

      const analysis = analyzeProjectProfile({
        projectType,
        buildingCategory,
        constructionMethod,
        qualityLevel,
      });

      await addDoc(collection(db, "projects"), {
        projectName,
        area,
        location,
        currency,
        projectType,
        buildingCategory,
        constructionMethod,
        qualityLevel,
        intelligenceAnalysis: analysis, // Stored for future reporting and historical intelligence insights
        boq,
        grandTotal,
        userId: user.uid,
        timestamp: new Date(),
      });

      alert("Project saved successfully.");

      loadProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const loadProjects = async () => {
    try {
      if (!user) return;

      const q = query(
        collection(db, "projects"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);

      const loadedProjects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProjects(loadedProjects);
    } catch (error) {
      console.error(error);
    }
  };

  const openProject = (project) => {
    setProjectName(project.projectName || "");
    setArea(project.area || "");
    setLocation(project.location || "");
    setCurrency(project.currency || "R");
    setProjectType(project.projectType || "");
    setBuildingCategory(project.buildingCategory || "");
    setConstructionMethod(project.constructionMethod || "");
    setQualityLevel(project.qualityLevel || "");

    const savedAnalysis = project.intelligenceAnalysis || null;
    // Restore saved intelligence snapshot for reporting/audit purposes if available.
    // The live preview continues to use the current profile inputs.
    if (savedAnalysis) {
      console.log("Loaded intelligenceAnalysis snapshot:", savedAnalysis);
    }

    setBoq(project.boq || []);
    setGrandTotal(project.grandTotal || 0);
  };

  if (!authChecked) {
    return (
      <div style={{ padding: 40 }}>
        Loading Thapello AI...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      <h1>Thapello AI</h1>

      <p>Quantity Surveying BOQ Generator</p>

      <hr />

      <ProjectDetailsForm
        projectName={projectName}
        area={area}
        location={location}
        currency={currency}
        setProjectName={setProjectName}
        setArea={setArea}
        setLocation={setLocation}
        setCurrency={setCurrency}
        generateBOQ={generateBOQ}
        isGenerating={isGenerating}
        saveProject={saveProject}
        isSaving={isSaving}
        loadProjects={loadProjects}
        resetBOQ={resetBOQ}
      />

      <ProjectIntelligenceProfile
        projectType={projectType}
        setProjectType={setProjectType}
        buildingCategory={buildingCategory}
        setBuildingCategory={setBuildingCategory}
        constructionMethod={constructionMethod}
        setConstructionMethod={setConstructionMethod}
        qualityLevel={qualityLevel}
        setQualityLevel={setQualityLevel}
      />

      <IntelligencePreviewPanel
        analysis={analyzeProjectProfile({
          projectType,
          buildingCategory,
          constructionMethod,
          qualityLevel,
        })}
      />

      <ExportControls
        exportPDF={exportPDF}
        exportExcel={exportExcel}
      />

      {boq.length > 0 && (
        <>
          <BOQEditor
            boq={boq}
            updateItem={updateItem}
            addItem={addItem}
            deleteItem={deleteItem}
            currency={currency}
          />

          <div
            style={{
              marginTop: "20px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            Grand Total: {currency}
            {grandTotal.toFixed(2)}
          </div>
        </>
      )}

      <hr style={{ marginTop: "40px" }} />

      <SavedProjectsList
        projects={projects}
        openProject={openProject}
      />
    </div>
  );
}
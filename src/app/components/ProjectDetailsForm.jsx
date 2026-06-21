"use client";

export default function ProjectDetailsForm({
  projectName,
  area,
  location,
  currency,
  setProjectName,
  setArea,
  setLocation,
  setCurrency,
  generateBOQ,
  isGenerating,
  saveProject,
  isSaving,
  loadProjects,
  resetBOQ,
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "10px",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <input
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      <input
        placeholder="Area (m²)"
        value={area}
        onChange={(e) => setArea(e.target.value)}
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value="R">R</option>
        <option value="$">$</option>
        <option value="€">€</option>
        <option value="£">£</option>
      </select>

      <button onClick={generateBOQ} disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Generate BOQ"}
      </button>

      <button onClick={saveProject} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Project"}
      </button>

      <button onClick={loadProjects}>Load My Projects</button>
      <button onClick={resetBOQ}>Reset BOQ</button>
    </div>
  );
}

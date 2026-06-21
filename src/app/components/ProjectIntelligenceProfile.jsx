"use client";

export default function ProjectIntelligenceProfile({
  projectType,
  setProjectType,
  buildingCategory,
  setBuildingCategory,
  constructionMethod,
  setConstructionMethod,
  qualityLevel,
  setQualityLevel,
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "10px",
        marginTop: "20px",
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}
    >
      <h3>Project Intelligence Profile</h3>

      <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
        <option value="">Select Project Type</option>
        <option value="Residential">Residential</option>
        <option value="Commercial">Commercial</option>
        <option value="Industrial">Industrial</option>
        <option value="Infrastructure">Infrastructure</option>
        <option value="Renovation">Renovation</option>
      </select>

      <select
        value={buildingCategory}
        onChange={(e) => setBuildingCategory(e.target.value)}
      >
        <option value="">Select Building Category</option>
        <option value="House">House</option>
        <option value="Apartment">Apartment</option>
        <option value="Office">Office</option>
        <option value="Retail">Retail</option>
        <option value="Warehouse">Warehouse</option>
        <option value="Other">Other</option>
      </select>

      <select
        value={constructionMethod}
        onChange={(e) => setConstructionMethod(e.target.value)}
      >
        <option value="">Select Construction Method</option>
        <option value="Brick and mortar">Brick and mortar</option>
        <option value="Reinforced concrete frame">Reinforced concrete frame</option>
        <option value="Steel structure">Steel structure</option>
        <option value="Modular">Modular</option>
      </select>

      <select value={qualityLevel} onChange={(e) => setQualityLevel(e.target.value)}>
        <option value="">Select Quality Level</option>
        <option value="Economy">Economy</option>
        <option value="Standard">Standard</option>
        <option value="Premium">Premium</option>
        <option value="Luxury">Luxury</option>
      </select>
    </div>
  );
}

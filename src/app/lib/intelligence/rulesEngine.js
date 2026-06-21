// QS Intelligence Rules Engine (foundation)
// This module provides a simple, rule-based analyzer for project intelligence.
// It is intentionally lightweight and contains deterministic rules to be
// expanded later. Do NOT connect to external AI APIs here. This is a
// foundational layer for future QS intelligence features.

export function analyzeProjectProfile({
  projectType = "",
  buildingCategory = "",
  constructionMethod = "",
  qualityLevel = "",
} = {}) {
  // Normalize inputs to predictable casing
  const pt = (projectType || "").toString();
  const bc = (buildingCategory || "").toString();
  const cm = (constructionMethod || "").toString();
  const ql = (qualityLevel || "").toString();

  // Determine construction complexity and labour intensity from project type
  let constructionComplexity = "Medium";
  let labourIntensity = "Medium";

  switch (pt) {
    case "Residential":
      constructionComplexity = "Medium";
      labourIntensity = "Medium";
      break;
    case "Commercial":
      constructionComplexity = "High";
      labourIntensity = "High";
      break;
    case "Industrial":
      constructionComplexity = "High";
      labourIntensity = "High";
      break;
    case "Infrastructure":
      constructionComplexity = "Very High";
      labourIntensity = "High";
      break;
    case "Renovation":
      constructionComplexity = "Variable";
      labourIntensity = "Medium";
      break;
    default:
      // keep defaults
      break;
  }

  // Determine cost level from quality level
  let costLevel = "Standard";
  switch (ql) {
    case "Economy":
      costLevel = "Economy";
      break;
    case "Standard":
      costLevel = "Standard";
      break;
    case "Premium":
      costLevel = "Premium";
      break;
    case "Luxury":
      costLevel = "Luxury";
      break;
    default:
      break;
  }

  // Basic material profile heuristics (composed from buildingCategory and constructionMethod)
  const materials = new Set();

  // Building category influence
  switch (bc) {
    case "House":
    case "Apartment":
      materials.add("Brickwork");
      materials.add("Concrete");
      materials.add("Standard finishes");
      break;
    case "Office":
    case "Retail":
      materials.add("Reinforced concrete");
      materials.add("Glazing and finishes");
      break;
    case "Warehouse":
      materials.add("Steel structure");
      materials.add("Concrete slab");
      break;
    case "Other":
      materials.add("Mixed materials");
      break;
    default:
      break;
  }

  // Construction method influence
  switch (cm) {
    case "Brick and mortar":
      materials.add("Brickwork");
      break;
    case "Reinforced concrete frame":
      materials.add("Concrete");
      materials.add("Reinforcing steel");
      break;
    case "Steel structure":
      materials.add("Structural steel");
      break;
    case "Modular":
      materials.add("Prefabricated modules");
      break;
    default:
      break;
  }

  // Infrastructure special-casing
  if (pt === "Infrastructure") {
    materials.clear();
    materials.add("Heavy civil concrete");
    materials.add("Asphalt");
    materials.add("Structural steel");
  }

  // Renovation hint
  if (pt === "Renovation") {
    materials.add("Selective repairs");
    materials.add("Match existing finishes");
  }

  // Compose recommendations with richer context awareness
  const recommendations = [];

  // Project Type recommendations
  if (pt === "Residential") {
    recommendations.push("Standard residential construction assumptions apply");
    recommendations.push("Conventional labour allocation recommended");
  }
  if (pt === "Commercial") {
    recommendations.push("Allow for higher services and MEP complexity");
    recommendations.push("Increased coordination requirements expected");
    recommendations.push("Consider specialist subcontractors for compliance");
  }
  if (pt === "Industrial") {
    recommendations.push("Expect heavy civil works and specialist contractors");
    recommendations.push("Review structural loading requirements");
    recommendations.push("Consider heavy-duty finishes and safety specifications");
  }
  if (pt === "Infrastructure") {
    recommendations.push("Expect heavy civil works and specialist contractors");
    recommendations.push("Allow extended timeframes for utility coordination");
    recommendations.push("Plan for site access and logistics constraints");
  }
  if (pt === "Renovation") {
    recommendations.push("Factor in existing condition assessment");
    recommendations.push("Plan for phased construction to maintain occupancy");
    recommendations.push("Allow for unknowns in existing structures");
  }

  // Quality Level recommendations
  if (ql === "Luxury") {
    recommendations.push("Plan for high-end finishes and durable specifications");
    recommendations.push("Increased quality control and inspection requirements");
  }
  if (ql === "Premium") {
    recommendations.push("Specify quality-grade materials throughout");
    recommendations.push("Enhanced finish standards recommended");
  }
  if (ql === "Economy") {
    recommendations.push("Optimize for cost-effective solutions");
    recommendations.push("Consider value-engineering opportunities");
  }

  // Building Category recommendations
  if (bc === "Warehouse") {
    recommendations.push("Optimize floor loading capacity specifications");
    recommendations.push("Plan for utility distribution systems");
  }
  if (bc === "Office" || bc === "Retail") {
    recommendations.push("Plan for higher MEP service zones");
    recommendations.push("Consider future-proofing for tenant fit-out");
  }

  // Construction Method recommendations
  if (cm === "Modular") {
    recommendations.push("Investigate factory lead times for prefabricated modules");
    recommendations.push("Plan for site logistics and assembly sequencing");
  }
  if (cm === "Steel structure") {
    recommendations.push("Coordinate structural erection and weather protection");
    recommendations.push("Plan for specialist crane and bolting teams");
  }
  if (cm === "Reinforced concrete frame") {
    recommendations.push("Allow time for formwork, cure cycles, and striking");
    recommendations.push("Coordinate concrete pours and curing requirements");
  }

  // Remove duplicates while preserving order
  const uniqueRecommendations = [...new Set(recommendations)];

  return {
    constructionComplexity,
    costLevel,
    materialProfile: Array.from(materials),
    labourIntensity,
    recommendations: uniqueRecommendations,
  };
}

"use client";

export default function IntelligencePreviewPanel({ analysis }) {
  if (!analysis) {
    return null;
  }

  const {
    constructionComplexity,
    costLevel,
    labourIntensity,
    materialProfile,
    recommendations,
  } = analysis;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "20px",
        marginTop: "20px",
        marginBottom: "20px",
        background: "#fafafa",
      }}
    >
      <h3>QS Intelligence Assessment</h3>

      <div style={{ marginTop: "12px" }}>
        <strong>Construction Complexity:</strong>
        <div>{constructionComplexity || "N/A"}</div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <strong>Cost Level:</strong>
        <div>{costLevel || "N/A"}</div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <strong>Labour Intensity:</strong>
        <div>{labourIntensity || "N/A"}</div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <strong>Material Profile:</strong>
        <ul style={{ marginTop: "8px" }}>
          {(materialProfile || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "12px" }}>
        <strong>Recommendations:</strong>
        <ul style={{ marginTop: "8px" }}>
          {(recommendations || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

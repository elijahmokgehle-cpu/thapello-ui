"use client";

export default function SavedProjectsList({ projects, openProject }) {
  return (
    <>
      <h2>Saved Projects</h2>

      {projects.length === 0 ? (
        <p>No saved projects found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
              }}
            >
              <h3>{project.projectName}</h3>

              <p>Area: {project.area}</p>
              <p>Location: {project.location}</p>
              <p>
                Grand Total: {project.currency || "R"}
                {Number(project.grandTotal || 0).toFixed(2)}
              </p>

              <button onClick={() => openProject(project)}>
                Open Project
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

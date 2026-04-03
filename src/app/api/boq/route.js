 // src/app/api/boq/route.js

export async function POST(req) {
  try {
    // Parse incoming project data
    const { projectData } = await req.json();

    // For now, we’ll return a mock BOQ (replace with AI logic later)
    const mockBOQ = {
      projectName: projectData.projectName || "Untitled Project",
      location: projectData.location || "Unknown",
      area: projectData.area || 0,
      items: [
        { name: "Cement", qty: 100, unit: "bags" },
        { name: "Bricks", qty: 1000, unit: "pcs" },
        { name: "Steel Rods", qty: 50, unit: "pieces" },
      ],
    };

    return new Response(
      JSON.stringify({ success: true, data: mockBOQ }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Return error in a structured way
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
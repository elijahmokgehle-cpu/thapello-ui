 // app/api/boq/route.js
export async function POST(request) {
  try {
    const body = await request.json(); // parse JSON body
    const { projectName, area, location, intelligenceAnalysis } = body;

    // Intelligence context received for future QS-driven BOQ rules
    // Currently stored for foundation; will be used in advanced BOQ generation logic

    // Dummy BOQ response for testing
    const items = [
      { name: "Concrete", qty: 10, unit: "m³", rate: 100, total: 1000 },
      { name: "Bricks", qty: 500, unit: "pcs", rate: 2, total: 1000 },
    ];

    const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

    return new Response(
      JSON.stringify({ items, grandTotal }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to generate BOQ" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
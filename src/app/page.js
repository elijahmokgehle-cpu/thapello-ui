"use client"; // ensures this page runs as a client component

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  async function handleCalculateBOQ() {
    setLoading(true);

    try {
      const projectData = {
        // You can replace these with actual user inputs later
        projectName: "Test Project",
        area: 100,
        location: "Johannesburg",
      };

      const response = await fetch("/api/boq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectData }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("BOQ Result:", result.data);
        alert("BOQ calculated successfully! Check console for details.");
      } else {
        console.error(result.error);
        alert("Error calculating BOQ");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col items-center justify-center w-full max-w-3xl p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-6 text-black dark:text-white">
          Thapello AI BOQ
        </h1>

        <p className="mb-6 text-lg text-zinc-700 dark:text-zinc-300 text-center">
          Click the button below to calculate your BOQ using the AI-powered API
        </p>

        <button
          onClick={handleCalculateBOQ}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-medium text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Calculating..." : "Calculate BOQ"}
        </button>
      </main>
    </div>
  );
}

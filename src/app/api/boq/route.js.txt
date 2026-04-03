import { NextResponse } from 'next/server';

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const backendUrl = process.env.THAPELLO_BACKEND_URL;

  const { projectData } = await request.json();

  try {
    const response = await fetch(`${backendUrl}/calculate-boq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ projectData }),
    });

    const result = await response.json();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
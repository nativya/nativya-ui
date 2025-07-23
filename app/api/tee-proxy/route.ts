import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { teeUrl, requestBody } = await req.json();
    if (!teeUrl || !requestBody) {
      return NextResponse.json({ error: "Missing teeUrl or requestBody" }, { status: 400 });
    }
    const response = await fetch(teeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 
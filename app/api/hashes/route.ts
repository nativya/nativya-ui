import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    // Fetch all members from the 'uniqueness_hashes' set
    const hashes = await redis.smembers("uniqueness_hashes");

    return NextResponse.json({ hashes });
  } catch (error) {
    console.error("Error fetching hashes from Upstash Redis:", error);
    return NextResponse.json(
      { error: "Failed to fetch hashes" },
      { status: 500 }
    );
  }
}

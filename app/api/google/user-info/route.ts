import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getUserInfo } from "@/app/lib/google/googleApi";
import { authOptions } from "@/app/lib/auth/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userInfo = await getUserInfo(session.accessToken);
    return NextResponse.json(userInfo);
  } catch (error) {
    console.error("Error fetching user info:", error);

    // Check if this is an auth error (Google API returns 401 for invalid credentials)
    if (
      error instanceof Error &&
      error.name === "GaxiosError" &&
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 401
    ) {
      return NextResponse.json(
        { error: "Authentication failed", code: "AUTH_ERROR" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch user information" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
// import { authOptions } from "../auth/[...nextauth]/route";
// import { uploadToGoogleDrive } from "../../lib/google/googleService";
import { authOptions } from "@/app/lib/auth/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { /* encryptedContent, metadata */ } = await req.json();

  try {
    // const response = await uploadToGoogleDrive({
    //   accessToken: session.accessToken,
    //   encryptedContent,
    //   metadata,
    // });
    // return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
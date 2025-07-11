import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth/authOptions";
import { google } from "googleapis";
import type { Session } from "next-auth";
import { drive_v3 } from "googleapis";


// Helper to find the folder ID for 'VANA DLP Data'
async function getVanaDlpFolderId(drive:drive_v3.Drive) {
  const res = await drive.files.list({
    q: "name = 'VANA DLP Data' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
    fields: "files(id, name)",
    spaces: "drive",
    pageSize: 1,
  });
  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id;
  }
  return null;
}

export async function GET() {
  const session = (await getServerSession(authOptions)) as (Session & { accessToken?: string });

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Set up Google Drive API client
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
    const drive = google.drive({ version: "v3", auth });

    // Find the 'VANA DLP Data' folder
    const folderId = await getVanaDlpFolderId(drive);
    if (!folderId) {
      return NextResponse.json({ files: [] }); // No folder, no files
    }

    // List files in the folder
    const { data } = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, name, createdTime, mimeType, size)",
      spaces: "drive",
    });

    // Fetch file contents for each file
    const filesWithContent = await Promise.all(
      (data.files || []).map(async (file) => {
        if (!file.id) return null;
        const res = await drive.files.get(
          { fileId: String(file.id), alt: "media" },
          { responseType: "arraybuffer" }
        );
        
        return {
          id: file.id,
          name: file.name,
          createdTime: file.createdTime,
          mimeType: file.mimeType,
          size: file.size,
          encryptedData: Buffer.from(res.data as ArrayBuffer).toString("base64"),
        };
      })
    );

    return NextResponse.json({ files: filesWithContent.filter(Boolean) });
  } catch (error) {
    console.error("Error fetching contributions from Google Drive:", error);
    return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 500 });
  }
} 
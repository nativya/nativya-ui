// NOTE: This file should only be imported in server components or API routes
// as it uses Node.js specific modules like googleapis
import { google } from "googleapis";
import { Readable } from "stream";

export type GoogleUserInfo = {
  id: string;
  email: string;
  name: string;
  picture: string;
  locale: string;
  verifiedEmail: boolean;
};

export type GoogleDriveInfo = {
  totalStorageBytes: string;
  usedStorageBytes: string;
  percentUsed: number;
  trashBytes: string;
};

export async function getUserInfo(
  accessToken: string
): Promise<GoogleUserInfo> {
  const response = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  const data = await response.json();

  // Log the raw data for debugging
  console.log("Raw Google user data:", JSON.stringify(data));

  return {
    id: data.sub,
    email: data.email,
    name: data.name,
    picture: data.picture,
    locale: data.locale ?? "",
    verifiedEmail: data.verified_email,
  };
}

export async function getDriveInfo(
  accessToken: string
): Promise<GoogleDriveInfo> {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const response = await drive.about.get({
    fields: "storageQuota",
  });

  const storageQuota = response.data.storageQuota;

  if (!storageQuota) {
    throw new Error("Failed to fetch storage quota");
  }

  const totalBytes = parseInt(storageQuota.limit || "0", 10);
  const usedBytes = parseInt(storageQuota.usage || "0", 10);
  const trashBytes = parseInt(storageQuota.usageInDriveTrash || "0", 10);

  const percentUsed = totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0;

  return {
    totalStorageBytes: formatBytes(totalBytes),
    usedStorageBytes: formatBytes(usedBytes),
    percentUsed: Math.round(percentUsed * 100) / 100,
    trashBytes: formatBytes(trashBytes),
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Uploads a file to Google Drive
 * @param accessToken The user's access token
 * @param fileData The blob to upload
 * @param fileName The name of the file
 * @returns The Google Drive file ID and URL
 */
export async function uploadFileToDrive(
  accessToken: string,
  fileData: Blob,
  fileName: string
): Promise<{ id: string; webViewLink: string }> {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  // Convert Blob to Buffer
  const buffer = Buffer.from(await fileData.arrayBuffer());

  // Create a readable stream from the buffer
  const readableStream = new Readable();
  readableStream.push(buffer);
  readableStream.push(null); // Signal the end of the stream

  // Upload file to Google Drive
  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType: "application/octet-stream",
    },
    media: {
      mimeType: "application/octet-stream",
      body: readableStream, // Use the stream instead of the buffer directly
    },
    fields: "id, webViewLink",
  });

  // Make the file publicly accessible by link
  await drive.permissions.create({
    fileId: response.data.id as string,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // Refetch to get the webViewLink
  const file = await drive.files.get({
    fileId: response.data.id as string,
    fields: "id, webViewLink",
  });

  return {
    id: file.data.id as string,
    webViewLink: file.data.webViewLink as string,
  };
}
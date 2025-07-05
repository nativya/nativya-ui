/**
 * Google Drive service for client-side file operations
 */
import { DriveInfo, UserInfo } from "@/app/types";
import { clientSideEncrypt, formatVanaFileId } from "../../crypto/utils";

export interface UploadResponse {
  downloadUrl: string;
  fileId: string;
  vanaFileId: string;
}


/**
 * Handle the complete data upload process:
 * 1. Encrypt the data
 * 2. Upload to Google Drive
 * 3. Set permissions
 * 4. Generate and return all necessary URLs
 */
export const uploadUserData = async (
  userInfo: UserInfo,
  signature: string,
  accessToken: string,
  driveInfo?: DriveInfo
): Promise<UploadResponse> => {
  // Prepare data package
  const timestamp = Date.now();
  const dataPackage = {
    userId: userInfo.id || "unknown",
    email: userInfo.email,
    timestamp,
    profile: {
      name: userInfo.name,
      locale: userInfo.locale || "en",
    },
    storage: driveInfo
      ? {
          percentUsed: driveInfo.percentUsed,
        }
      : undefined,
    metadata: {
      source: "Google",
      collectionDate: new Date().toISOString(),
      dataType: "profile",
    },
  };

  const fileString = JSON.stringify(dataPackage);
  const fileBlob = new Blob([fileString], { type: "application/json" });

  // Encrypt the data
  const encryptedBlob = await clientSideEncrypt(fileBlob, signature);

  // Upload to Drive
  const fileName = `vana_dlp_data_${timestamp}.json`;
  const fileDetails = await uploadFileToDrive(
    encryptedBlob,
    fileName,
    accessToken
  );

  // Set permissions and get download URL
  await updateFilePermissions(accessToken, fileDetails.id);
  const downloadUrl = await createSharableLink(fileDetails.id);

  // Return complete response
  return {
    downloadUrl: downloadUrl,
    fileId: fileDetails.id,
    vanaFileId: formatVanaFileId(fileDetails.webViewLink, timestamp),
  };
};

/**
 * Upload a file directly to Google Drive
 * @param file Blob data to upload
 * @param fileName Name for the file
 * @param token Google OAuth access token
 * @returns Object with file details
 */
const uploadFileToDrive = async (
  encryptedBlob: Blob,
  fileName: string,
  token: string
) => {
  const folderId = await findOrCreateFolder(token, "VANA DLP Data");
  const url =
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

  // Construct metadata
  const metadata = {
    name: `encrypted_${fileName}`,
    parents: [folderId],
  };

  // Create the multipart body
  const formData = new FormData();
  formData.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  formData.append("file", encryptedBlob);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Google Drive API error ${response.status}: ${await response.text()}`
      );
    }

    const fileDetails = await response.json();
    return await fetchFileDetails(token, fileDetails.id);
  } catch (error) {
    console.error("Failed to upload file to Google Drive:", error);
    throw error;
  }
};

/**
 * Fetch detailed information about a file
 * @param token Google OAuth access token
 * @param fileId File ID to get details for
 * @returns Object with file details
 */
const fetchFileDetails = async (token: string, fileId: string) => {
  const detailsUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,webViewLink`;

  const response = await fetch(detailsUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch file details: ${
        response.status
      } ${await response.text()}`
    );
  }

  return await response.json();
};

/**
 * Find or create a folder in Google Drive
 * @param token Google OAuth access token
 * @param folderName Name of the folder to find or create
 * @returns ID of the found or created folder
 */
const findOrCreateFolder = async (token: string, folderName: string) => {
  const url = `https://www.googleapis.com/drive/v3/files`;
  const params = new URLSearchParams({
    q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
    pageSize: "1",
  });

  const searchResponse = await fetch(`${url}?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await searchResponse.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id; // Return the first found folder's ID
  } else {
    // Folder not found, create it
    const metadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    };
    const createResponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    });

    const folderData = await createResponse.json();
    return folderData.id;
  }
};

/**
 * Create a sharable link for a file
 * @param token Google OAuth access token
 * @param fileId ID of the file to create a link for
 * @returns Sharable link for the file
 */
const createSharableLink = async (fileId: string) => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

/**
 * Update a file's permissions to make it publicly accessible
 * @param token Google OAuth access token
 * @param fileId ID of the file to update permissions for
 */
const updateFilePermissions = async (token: string, fileId: string) => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`;

  const body = JSON.stringify({
    role: "reader",
    type: "anyone",
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body,
  });

  if (!response.ok) {
    throw new Error(`Failed to update permissions: ${await response.text()}`);
  }

  return await response.json();
};
import * as openpgp from "openpgp";

/**
 * Client-side encryption of file data
 * @param data The data to encrypt
 * @param signature The signature to use for encryption
 * @returns The encrypted data as a Blob
 */
export async function clientSideEncrypt(
  data: Blob,
  signature: string
): Promise<Blob> {
  const dataBuffer = await data.arrayBuffer();
  const message = await openpgp.createMessage({
    binary: new Uint8Array(dataBuffer),
  });

  const encrypted = await openpgp.encrypt({
    message,
    passwords: [signature],
    format: "binary",
  });

  // Convert WebStream<Uint8Array> to Blob
  const response = new Response(encrypted as ReadableStream<Uint8Array>);
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const encryptedBlob = new Blob([uint8Array], {
    type: "application/octet-stream",
  });
  return encryptedBlob;
}

export async function clientSideDecrypt(
  encryptedBlob: Blob,
  signature: string
): Promise<Blob> {
  try {
    // Convert Blob to Uint8Array
    const encryptedBuffer = await encryptedBlob.arrayBuffer();
    const encryptedData = new Uint8Array(encryptedBuffer);
    
    // Create message from encrypted data
    const message = await openpgp.readMessage({
      binaryMessage: encryptedData
    });
    
    // Decrypt the message
    const { data: decrypted } = await openpgp.decrypt({
      message,
      passwords: [signature],
      format: "binary"
    });
    
    // Convert decrypted data back to Blob
    const decryptedBlob = new Blob([decrypted as Uint8Array]);
    return decryptedBlob;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

/**
 * Encrypts data using a wallet public key
 * @param data The data to encrypt
 * @param publicKey The wallet public key
 * @returns The encrypted data as a hex string
 */
export const encryptWithWalletPublicKey = async (
  data: string,
  publicKey: string
): Promise<string> => {
  const eccrypto = await import("eccrypto");

  // Get consistent encryption parameters
  const { iv, ephemeralKey } = getEncryptionParameters();

  const publicKeyBytes = Buffer.from(
    publicKey.startsWith("0x") ? publicKey.slice(2) : publicKey,
    "hex"
  );
  const uncompressedKey =
    publicKeyBytes.length === 64
      ? Buffer.concat([Buffer.from([4]), publicKeyBytes])
      : publicKeyBytes;

  const encryptedBuffer = await eccrypto.default.encrypt(
    uncompressedKey,
    Buffer.from(data),
    {
      iv: Buffer.from(iv),
      ephemPrivateKey: Buffer.from(ephemeralKey),
    }
  );

  const encryptedHex = Buffer.concat([
    encryptedBuffer.iv,
    encryptedBuffer.ephemPublicKey,
    encryptedBuffer.ciphertext,
    encryptedBuffer.mac,
  ]).toString("hex");

  return encryptedHex;
};

/**
 * Prepares a file ID for the VANA DLP registry
 * @param url The URL of the file
 * @param timestamp Optional timestamp
 * @returns A formatted file ID
 */
export function formatVanaFileId(
  url: string,
  timestamp: number = Date.now()
): string {
  return `vana_submission_${timestamp}_${url.substring(
    url.lastIndexOf("/") + 1
  )}`;
}

// Store the generated values so they remain consistent
let generatedIV: Uint8Array | null = null;
let generatedEphemeralKey: Uint8Array | null = null;

/**
 * Generate or retrieve the encryption parameters (IV and ephemeral key)
 * Ensures the same values are used across multiple calls
 * @returns An object containing the IV and ephemeral key
 */
export function getEncryptionParameters() {
  if (!generatedIV || !generatedEphemeralKey) {
    // 16-byte initialization vector (fixed value)
    generatedIV = new Uint8Array([
      0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
      0x0d, 0x0e, 0x0f, 0x10,
    ]);

    // 32-byte ephemeral key (fixed value)
    generatedEphemeralKey = new Uint8Array([
      0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc,
      0xdd, 0xee, 0xff, 0x00, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80,
      0x90, 0xa0, 0xb0, 0xc0, 0xd0, 0xe0, 0xf0, 0x00,
    ]);
  }

  return {
    iv: generatedIV,
    ephemeralKey: generatedEphemeralKey,
    ivHex: Buffer.from(generatedIV).toString("hex"),
    ephemeralKeyHex: Buffer.from(generatedEphemeralKey).toString("hex"),
  };
}


/**
 * Decrypts data using a wallet private key
 * @param encryptedHex The encrypted data as a hex string
 * @param privateKey The wallet private key
 * @returns The decrypted data as a string
 */
export const decryptWithWalletPrivateKey = async (
  encryptedHex: string,
  privateKey: string
): Promise<string> => {
  try {
    const eccrypto = await import("eccrypto");
    
    // Convert hex string back to buffer
    const encryptedBuffer = Buffer.from(encryptedHex, "hex");
    
    // Extract the components (based on the encryption structure)
    // IV: 16 bytes, ephemPublicKey: 65 bytes, MAC: 32 bytes
    // Ciphertext: remaining bytes
    const iv = encryptedBuffer.slice(0, 16);
    const ephemPublicKey = encryptedBuffer.slice(16, 81);
    const macStart = encryptedBuffer.length - 32;
    const mac = encryptedBuffer.slice(macStart);
    const ciphertext = encryptedBuffer.slice(81, macStart);
    
    // Prepare the encrypted object structure expected by eccrypto
    const encryptedObj = {
      iv,
      ephemPublicKey,
      ciphertext,
      mac
    };
    
    // Convert private key to buffer
    const privateKeyBuffer = Buffer.from(
      privateKey.startsWith("0x") ? privateKey.slice(2) : privateKey,
      "hex"
    );
    
    // Decrypt the data
    const decryptedBuffer = await eccrypto.default.decrypt(
      privateKeyBuffer,
      encryptedObj
    );
    
    return decryptedBuffer.toString();
  } catch (error) {
    throw new Error(`Wallet decryption failed: ${error.message}`);
  }
};

/**
 * Utility function to validate if a string is a valid hex
 * @param hex The hex string to validate
 * @returns boolean indicating if the string is valid hex
 */
export function isValidHex(hex: string): boolean {
  return /^[0-9a-fA-F]+$/.test(hex.replace(/^0x/, ""));
}

/**
 * Utility function to extract file information from a VANA file ID
 * @param fileId The VANA file ID
 * @returns Object containing timestamp and filename
 */
export function parseVanaFileId(fileId: string): {
  timestamp: number;
  filename: string;
} | null {
  const match = fileId.match(/^vana_submission_(\d+)_(.+)$/);
  if (!match) {
    return null;
  }
  
  return {
    timestamp: parseInt(match[1], 10),
    filename: match[2]
  };
}
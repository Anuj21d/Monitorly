import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const keyHex = process.env.MONITOR_CREDENTIALS_KEY;

  if (!keyHex || !/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    throw new Error(
      "MONITOR_CREDENTIALS_KEY must be a valid 64-character hexadecimal key",
    );
  }

  return Buffer.from(keyHex, "hex");
}

export function encryptCredentials(value: unknown): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const plaintext = JSON.stringify(value);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return JSON.stringify({
    version: 1,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
    data: encrypted.toString("hex"),
  });
}

export function decryptCredentials<T>(encryptedValue: string): T {
  const key = getEncryptionKey();
  const payload = JSON.parse(encryptedValue);

  if (
    payload.version !== 1 ||
    typeof payload.iv !== "string" ||
    typeof payload.authTag !== "string" ||
    typeof payload.data !== "string" ||
    !/^[0-9a-f]{24}$/i.test(payload.iv) ||
    !/^[0-9a-f]{32}$/i.test(payload.authTag) ||
    !/^(?:[0-9a-f]{2})*$/i.test(payload.data)
  ) {
    throw new Error("Invalid encrypted credential format");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(payload.iv, "hex"),
  );

  decipher.setAuthTag(Buffer.from(payload.authTag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.data, "hex")),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString("utf8")) as T;
}

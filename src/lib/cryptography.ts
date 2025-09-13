// All this file was designed to run only on browser to e2ee 
// it only runs on browser because is used window.crypto

export async function deriveKeyFromPassword(password: string, saltHex: string) {
  const salt = Uint8Array.from(
    saltHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt, iterations: 310000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(data: any, derivedKey: CryptoKey) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const dataAsbytes = new TextEncoder().encode(JSON.stringify(data));
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    dataAsbytes
  );
  return { iv, encryptedData };
}

export async function decryptData(
  encryptDataResult: {
    iv: Uint8Array<ArrayBuffer>;
    encryptedData: ArrayBuffer;
  },
  derivedKey: CryptoKey
) {
  const decryptedMessage = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: encryptDataResult.iv },
    derivedKey,
    encryptDataResult.encryptedData
  );

  const message = new TextDecoder().decode(decryptedMessage);
  return JSON.parse(message);
}

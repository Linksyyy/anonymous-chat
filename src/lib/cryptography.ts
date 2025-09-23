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
    { name: "PBKDF2", salt: salt, iterations: 310000, hash: "SHA-512" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function symmetricEncrypt(data: any, derivedKey: CryptoKey) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const dataAsbytes = new TextEncoder().encode(JSON.stringify(data));
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    dataAsbytes
  );
  return { iv, encryptedData };
}

export async function symmetricDecrypt(
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

export async function generateUserKeyPair() {
  const keys = window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  return keys;
}

export async function asymmetricEncrypt(
  privateKey: CryptoKey,
  dataString: string
) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(dataString);

  return await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    privateKey,
    data
  );
}

export async function asymmetricDecrypt(
  publlicKey: CryptoKey,
  encryptedData: ArrayBuffer
) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  return await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    publlicKey,
    encryptedData
  );
}

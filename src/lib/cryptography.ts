import crypt from "node:crypto";

export const client = {
  async hash(dataString: string) {
    const data = new TextEncoder().encode(dataString);
    const digest = await window.crypto.subtle.digest({ name: "SHA-512" }, data);
    //tranform the ArrayBuffer into hexadecimal
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  },

  async deriveKeyFromPassword(password: string, saltHex: string) {
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
  },

  async symmetricEncrypt(data: any, derivedKey: CryptoKey) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const dataAsbytes = new TextEncoder().encode(JSON.stringify(data));
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      derivedKey,
      dataAsbytes
    );
    return { iv, encryptedData };
  },

  async symmetricDecrypt(
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
  },
};

export const server = {
  async generateUserKeyPair() {
    const keys = crypto.subtle.generateKey(
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
  },

  async asymmetricEncrypt(privateKey: CryptoKey, dataString: string) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = new TextEncoder().encode(dataString);

    return await crypto.subtle.encrypt({ name: "RSA-OAEP" }, privateKey, data);
  },

  async asymmetricDecrypt(publlicKey: CryptoKey, encryptedData: ArrayBuffer) {
    return await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      publlicKey,
      encryptedData
    );
  },

  async exportKeyToJwt(key: CryptoKey) {
    return await crypto.subtle.exportKey("jwk", key);
  },

  async importKeyFromJwt(
    jwt: JsonWebKey,
    algorithmName: string,
    keyUsages: string[]
  ) {
    return await crypto.subtle.importKey(
      // @ts-ignore
      "jwk",
      jwt,
      {
        name: algorithmName,
        hash: "SHA-256",
      },
      true,
      keyUsages
    );
  },

  async deriveKeyFromPassword(password: string, saltHex: string) {
    const salt = Uint8Array.from(
      saltHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
    const baseKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    return await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: 310000, hash: "SHA-512" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  },

  async symmetricEncrypt(data: any, derivedKey: CryptoKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const dataAsbytes = new TextEncoder().encode(JSON.stringify(data));
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      derivedKey,
      dataAsbytes
    );
    return { iv, encryptedData };
  },
};

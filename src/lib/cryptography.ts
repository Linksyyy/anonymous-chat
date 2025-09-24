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

  async importKey(keyHex: string) {
    // Imports a key from a hex string
    const rawKey = Uint8Array.from(
      keyHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );
    const key = await window.crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );
    return key;
  },

  bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  },

  hexToBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes.buffer;
  },

  async symmetricDecrypt(
    encryptDataResult: {
      iv: string; // Expects a hex string
      encryptedData: string; // Expects a hex string
    },
    derivedKey: CryptoKey
  ) {
    try {
      const ivBuffer = this.hexToBuffer(encryptDataResult.iv);
      const dataBuffer = this.hexToBuffer(encryptDataResult.encryptedData);

      const decryptedMessage = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
        derivedKey,
        dataBuffer
      );

      const message = new TextDecoder().decode(decryptedMessage);
      return JSON.parse(message);
    } catch (error) {
      console.error("Decryption failed.", error);
      return null;
    }
  },

  async generateSymmetricKey() {
    const key = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["decrypt", "encrypt"]
    );
    return key;
  },

  async exportKeyToJwt(key: CryptoKey) {
    return await window.crypto.subtle.exportKey("jwk", key);
  },

  async importKeyFromJwt(
    jwt: JsonWebKey,
    algorithmName: string,
    keyUsages: string[]
  ) {
    return await window.crypto.subtle.importKey(
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

  async asymmetricEncrypt(privateKey: CryptoKey, dataString: string) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const data = new TextEncoder().encode(dataString);

    return await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      privateKey,
      data
    );
  },

  async asymmetricDecrypt(publlicKey: CryptoKey, encryptedData: ArrayBuffer) {
    return await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      publlicKey,
      encryptedData
    );
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

  bufferToHex(buffer: ArrayBuffer | Uint8Array<ArrayBuffer>): string {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  },

  hexToBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes.buffer;
  },
};

"use client";
import { createContext, useContext, useState } from "react";
import { client as cryptoClient } from "../lib/cryptography";

const keyContext = createContext();

export function KeyProvider({ children }) {
  const [key, setKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);

  const loadAndSetUserKeys = async (
    publicKey,
    privateKey,
    passwordDerivedKey
  ) => {
    const { encryptedKeyHex, ivHex } = privateKey;
    const decryptedJwk = await cryptoClient.symmetricDecrypt(
      { encryptedData: encryptedKeyHex, iv: ivHex },
      passwordDerivedKey
    );

    if (decryptedJwk) {
      const privateKeyObject = await cryptoClient.importKeyFromJwt(
        decryptedJwk,
        "RSA-OAEP",
        ["decrypt"]
      );
      setPrivateKey(privateKeyObject);

      const publicKeyObject = await cryptoClient.importKeyFromJwt(
        publicKey,
        "RSA-OAEP",
        ["encrypt"]
      );
      setPublicKey(publicKeyObject);
    } else {
      console.error(
        "Failed to decrypt the private key. The password might be wrong."
      );
    }
  };

  const ctx = { key, setKey, publicKey, privateKey, loadAndSetUserKeys };
  return <keyContext.Provider value={ctx}>{children}</keyContext.Provider>;
}

export function useKeyProvider() {
  return useContext(keyContext);
}

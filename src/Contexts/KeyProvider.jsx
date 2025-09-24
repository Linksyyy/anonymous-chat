"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { client as cryptoClient } from "../lib/cryptography";

const keyContext = createContext();

export function KeyProvider({ children }) {
  const [key, setKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [groupKeys, setGroupKeys] = useState(new Map());
  const [privateKey, setPrivateKey] = useState(null);

  function addGroupKey(chatId, key) {
    const newGroupKeys = new Map(groupKeys);
    newGroupKeys.set(chatId, key);
    setGroupKeys(newGroupKeys);
  }

  function getGroupKey(chatdId) {
    return groupKeys.get(chatdId);
  }

  async function loadAndSetUserKeys(publicKey, privateKey, passwordDerivedKey) {
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
  }

  const ctx = {
    key,
    setKey,
    publicKey,
    privateKey,
    loadAndSetUserKeys,
    addGroupKey,
    getGroupKey,
  };
  return <keyContext.Provider value={ctx}>{children}</keyContext.Provider>;
}

export function useKeyProvider() {
  return useContext(keyContext);
}

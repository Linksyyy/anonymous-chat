"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { client as cryptoClient } from "../lib/cryptography";

const keyContext = createContext();

export function KeyProvider({ children }) {
  const [key, setKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [groupKeys, setGroupKeys] = useState(new Map());
  const [privateKey, setPrivateKey] = useState(null);

  async function encryptAndStoreGroupKeys(newGroupKeys) {
    const groupKeyEntries = Array.from(newGroupKeys.entries()); //[[key, value],...]

    const encryptedGroupKeys = await cryptoClient.symmetricEncrypt(
      groupKeyEntries,
      key
    );
    localStorage.setItem(
      "encrypted-group-keys",
      JSON.stringify(encryptedGroupKeys)
    );
  }

  async function addGroupKey(chatId, groupKey) {
    const newGroupKeys = new Map(groupKeys);
    newGroupKeys.set(chatId, await groupKey);
    setGroupKeys(newGroupKeys);

    await encryptAndStoreGroupKeys(newGroupKeys);
  }

  async function getGroupKey(chatdId) {
    return await cryptoClient.importKeyFromJwt(
      groupKeys.get(chatdId),
      "AES-GCM",
      ["decrypt", "encrypt"]
    );
  }

  async function changeGroupKeys(newGroupKeys) {
    setGroupKeys(newGroupKeys);

    await encryptAndStoreGroupKeys(newGroupKeys);
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
    setGroupKeys: changeGroupKeys,
  };
  return <keyContext.Provider value={ctx}>{children}</keyContext.Provider>;
}

export function useKeyProvider() {
  return useContext(keyContext);
}

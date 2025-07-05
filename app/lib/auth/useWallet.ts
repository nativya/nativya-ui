import { useState } from "react";
import { ethers } from "ethers";
import { useAppStore } from "../../store/useAppStore";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const address = useAppStore((state) => state.address);
  const setAddress = useAppStore((state) => state.setAddress);
  const [error, setError] = useState<string | null>(null);

  async function connectWallet() {
    setError(null);
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      return accounts[0];
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function signMessage(message: string) {
    setError(null);
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      return signature;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  return { address, setAddress, connectWallet, signMessage, error };
}
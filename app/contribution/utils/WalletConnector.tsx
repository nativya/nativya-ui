"use client";
import React from "react";
import { useWallet } from "../../lib/auth/useWallet";

export default function WalletConnector() {
  const { address, connectWallet, error } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch {}
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto my-8 bg-white shadow">
      <h2 className="text-lg font-bold mb-2">Wallet Connection</h2>
      {address ? (
        <div>
          <div className="mb-2">Connected: <span className="font-mono">{address}</span></div>
        </div>
      ) : (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      )}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
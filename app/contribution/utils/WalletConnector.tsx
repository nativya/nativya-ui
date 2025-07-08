"use client";
import React from "react";
import { useWallet } from "../../lib/auth/useWallet";
import { Button } from "../../components/ui/Button";

export default function WalletConnector() {
  const { address, connectWallet, setAddress, error } = useWallet();

  const handleWalletToggle = async () => {
    try {
      if (address) {
        // Disconnect wallet
        setAddress(null);
        // Clear the selected address from MetaMask
        // if (window.ethereum) {
        //   window.ethereum.selectedAddress = null;
        // }
      } else {
        // Connect wallet
        await connectWallet();
      }
    } catch (error) {
      console.error("Wallet operation failed:", error);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto my-8 bg-white shadow">
      <h2 className="text-lg font-bold mb-4 text-gray-900">Wallet Connection</h2>
      
      {address ? (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Connected</span>
            </div>
            <div className="text-sm text-gray-600 break-all">
              <span className="font-mono">{address}</span>
            </div>
          </div>
          <Button
            onClick={handleWalletToggle}
            variant="outline"
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-600">Not Connected</span>
            </div>
            <div className="text-sm text-gray-500">
              Connect your wallet to start contributing
            </div>
          </div>
          <Button
            onClick={handleWalletToggle}
            className="w-full"
          >
            Connect Wallet
          </Button>
        </div>
      )}
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}
    </div>
  );
}
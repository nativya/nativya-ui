"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "../../components/ui/Button";

function truncateAddress(address: string) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
}

export default function WalletConnector() {
  const { address } = useAccount();
  const { connect, error: connectError, isPending, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleWalletToggle = () => {
    if (!address && connectors.length > 0) {
      const connector = connectors[0];
      if (connector) {
        connect({ connector });
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setDropdownOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative flex items-center gap-2" ref={dropdownRef}>
      {address ? (
        <>
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-lg font-mono text-xs text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Wallet address"
            type="button"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
            <span>{truncateAddress(address)}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-blue-200 rounded-lg shadow-lg z-50">
              <Button
                onClick={handleDisconnect}
                size="sm"
                variant="outline"
                className="w-full text-red-600 hover:text-white hover:bg-red-600"
              >
                Disconnect
              </Button>
            </div>
          )}
        </>
      ) : (
        <Button
          onClick={handleWalletToggle}
          size="sm"
          className="px-3 py-1.5 text-xs"
          disabled={isPending}
        >
          {isPending ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
      {(connectError) && (
        <span className="ml-2 text-xs text-red-600">{connectError.message}</span>
      )}
    </div>
  );
}
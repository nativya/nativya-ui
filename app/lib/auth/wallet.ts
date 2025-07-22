// import { mokshaTestnet, vanaMainnet } from "@/contracts/chains";
import { mokshaTestnet, vanaMainnet } from "@/app/contracts/chains";
import { createConfig, http } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";

// Configure Wagmi
const config = createConfig({
  chains: [mokshaTestnet, vanaMainnet],
  connectors: [
    injected(), // MetaMask and browser injected wallets
    coinbaseWallet({
      appName: "Vana DLP Template",
    }),
  ],
  transports: {
    [mokshaTestnet.id]: http(),
    [vanaMainnet.id]: http(),
  },
});

export const wagmiConfig = config;
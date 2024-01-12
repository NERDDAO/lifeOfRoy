import { createConfig } from "wagmi";
import { appChains, wagmiConnectors } from "@/app/web3/wagmiConnectors";

export const wagmiConfig = createConfig({
    autoConnect: false,
    connectors: wagmiConnectors,
    publicClient: appChains.publicClient,
});

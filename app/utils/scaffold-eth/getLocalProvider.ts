import { Chain } from "wagmi";
import { useEthersProvider } from "~~/utils/wagmi-utils";

/**
 * @dev Get the localProvider for given chain
 * @param {Chain} chain - specify chain for localProvider
 * @return public provider for passed chain
 */
export const useLocalProvider = (chain: Chain) => {
  const chainProviderLoader = useEthersProvider();
  const provider = chainProviderLoader?.provider;

  return provider;
};

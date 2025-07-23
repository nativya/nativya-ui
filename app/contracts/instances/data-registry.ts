import { getContract } from "viem";

import { DataRegistryImplementationAbi } from "../abi/DataRegistryImplementation";
import { getContractAddress } from "../addresses";
import { createClient } from "../client";

/**
 * Instance of the DataRegistry Contract. This is a proxy contract that delegates calls to the implementation contract.
 */
export const DataRegistry = (
  client: ReturnType<typeof createClient> = createClient(),
) => {
  return getContract({
    address: getContractAddress(client.chain.id, "DataRegistryProxy"),
    abi: DataRegistryImplementationAbi,
    client,
  });
};
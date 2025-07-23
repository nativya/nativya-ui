import { DataLiquidityPoolImplementationAbi } from "./DataLiquidityPoolImplementation";
import { DataRegistryImplementationAbi } from "./DataRegistryImplementation";
import { TeePoolImplementationAbi } from "./TeePoolImplementation";

const contractAbis = {
  DataRegistryProxy: DataRegistryImplementationAbi,
  TeePoolProxy: TeePoolImplementationAbi,
  DataLiquidityPoolProxy: DataLiquidityPoolImplementationAbi,
} as const;

export type ContractAbis = typeof contractAbis;

export type VanaContract = keyof ContractAbis;

export function getAbi<T extends VanaContract>(contract: T): ContractAbis[T] {
  const abi = contractAbis[contract];
  if (!abi) {
    throw new Error(`Unsupported contract: ${contract}`);
  }
  return abi;
}
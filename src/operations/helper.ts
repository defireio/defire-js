import { Operation as OperationContract } from "../contracts/Operation";
import * as ethUtils from "ethereumjs-util";
import { Address, Account } from "typings";

export const getInAssets = async (
  account: Account,
  address: Address,
  params: string
): Promise<string[]> => {
  const contract = new OperationContract(address);
  const data = contract.getInAssets(params);
  return getAssetsCall(account, address, data);
};

export const getOutAssets = async (
  account: Account,
  address: Address,
  params: string
): Promise<string[]> => {
  const contract = new OperationContract(address);
  const data = contract.getOutAssets(params);
  return getAssetsCall(account, address, data);
};

const getAssetsCall = async (
  account: Account,
  address: Address,
  data: any
): Promise<string[]> => {
  const params = [
    {
      from: account.address,
      to: address,
      data: data,
    },
    "latest",
  ];
  const result = await account.makeRequest("eth_call", params);
  const addresses = result.substring(130).match(/.{1,64}/g);
  if (addresses == null) return [];
  else
    return addresses.map((addr: Address) =>
      ethUtils.toChecksumAddress("0x" + addr.substring(24))
    );
};

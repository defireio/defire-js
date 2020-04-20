import { Address } from "typings";
import { encodeFunctionCall } from "../utils/utils";

export class Operation {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  operate(amounts: string[], params: string) {
    return encodeFunctionCall("operate(uint256[],bytes)", amounts, params);
  }

  getInAssets(params: string) {
    return encodeFunctionCall("getInAssets(bytes)", params);
  }

  getOutAssets(params: string) {
    return encodeFunctionCall("getOutAssets(bytes)", params);
  }
}

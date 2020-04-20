import { Address } from "typings";
import { encodeFunctionCall } from "../utils/utils";

export class FundFactory {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  createInstance(
    managers: Address[],
    operations: Address[],
    assets: Address[]
  ) {
    return encodeFunctionCall(
      "createInstance(address[],address[],address[])",
      managers,
      operations,
      assets
    );
  }
}

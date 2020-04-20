import { Address } from "typings";
import { encodeFunctionCall } from "../utils/utils";

export class PortfolioFactory {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  createInstance(
    clients: Address[],
    managers: Address[],
    operations: Address[],
    assets: Address[]
  ) {
    return encodeFunctionCall(
      "createInstance(address[],address[],address[],address[])",
      clients,
      managers,
      operations,
      assets
    );
  }
}

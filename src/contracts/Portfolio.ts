import { Address, OperationParam } from "typings";
import { encodeFunctionCall } from "../utils/utils";

export class Portfolio {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  isOwner(owner: Address) {
    return encodeFunctionCall("isPortfolioOwner(address)", owner);
  }

  isMainOwner(owner: Address) {
    return encodeFunctionCall("isPortfolioMainOwner(address)", owner);
  }

  addOwner(owner: Address) {
    return encodeFunctionCall("addPortfolioOwner(address)", owner);
  }

  removeOwner(owner: Address) {
    return encodeFunctionCall("removePortfolioOwner(address)", owner);
  }

  withdraw(assets: Address[], amounts: string[], to: Address) {
    return encodeFunctionCall(
      "withdraw(address[],uint256[],address)",
      assets,
      amounts,
      to
    );
  }
}

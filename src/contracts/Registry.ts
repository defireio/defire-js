import { Address } from "typings";
import { encodeFunctionCall } from "../utils/utils";

export class Registry {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  isElement(element: Address) {
    return encodeFunctionCall("isElement(address)", element);
  }
}

export class FundRegistry {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  isFund(fund: Address) {
    return encodeFunctionCall("isFund(address)", fund);
  }
}

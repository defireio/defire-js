import { Address } from "typings";
import { encodeFunctionCall } from "../utils/utils";

export class Fund {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  getFundToken() {
    return encodeFunctionCall("getFundToken()");
  }
}

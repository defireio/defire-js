import { Address } from "typings";
import { encodeFunctionCall } from "../utils/utils";

export class ERC20 {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  allowance(owner: Address, spender: Address) {
    return encodeFunctionCall("allowance(address,address)", owner, spender);
  }

  balanceOf(owner: Address) {
    return encodeFunctionCall("balanceOf(address)", owner);
  }

  totalSupply() {
    return encodeFunctionCall("totalSupply()");
  }

  approve(spender: Address, value: string) {
    return encodeFunctionCall("approve(address,uint256)", spender, value);
  }
}

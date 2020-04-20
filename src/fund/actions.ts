import { Address, Account } from "typings";
import { Actions as OperableActions } from "../common/operable";

export class Actions extends OperableActions {
  constructor(address: Address, account: Account) {
    super(address, account);
  }
}

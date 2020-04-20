import { Address, Configuration, Account } from "typings";
import { Query } from "./query";
import { Actions } from "./actions";

export class Portfolio {

  config: Configuration;
  address: Address;
  account: Account;
  query: Query;
  actions: Actions;

  constructor(config: Configuration, address: Address, account: Account) {
    this.config = config;
    this.address = address;
    this.account = account;
    this.query = new Query(this.address, this.account);
    this.actions = new Actions(this.address, this.account);
  }
}

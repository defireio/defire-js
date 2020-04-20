import { Address, Account } from "typings";
import { Portfolio as PortfolioContract } from "../contracts/portfolio";
import { Query as OperableQuery } from "../common/operable";
import { validateAddress } from "../utils/utils";
import { InvalidAddress } from "../utils/errors";

export class Query extends OperableQuery {
  constructor(address: Address, account: Account) {
    super(address, account);
  }

  async isOwner(address: Address): Promise<boolean> {
    validateAddress(address, new InvalidAddress());
    const operable = new PortfolioContract(this.address);
    const data = operable.isOwner(address);
    const params = [
      {
        from: this.account.address,
        to: this.address,
        data: data,
      },
      "latest",
    ];
    const result = await this.account.makeRequest("eth_call", params);
    return parseInt(result.substring(2)) == 1;
  }

  async isMainOwner(address: Address): Promise<boolean> {
    validateAddress(address, new InvalidAddress());
    const operable = new PortfolioContract(this.address);
    const data = operable.isMainOwner(address);
    const params = [
      {
        from: this.account.address,
        to: this.address,
        data: data,
      },
      "latest",
    ];
    const result = await this.account.makeRequest("eth_call", params);
    return parseInt(result.substring(2)) == 1;
  }
}

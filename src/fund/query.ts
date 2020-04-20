import { Address, Account } from "typings";
import { Fund as FundContract } from "../contracts/fund";
import { ERC20 } from "../contracts/ERC20";
import { Query as OperableQuery } from "../common/operable";
import * as ethUtils from "ethereumjs-util";
import JSBI from "JSBI";

export class Query extends OperableQuery {
  constructor(address: Address, account: Account) {
    super(address, account);
  }

  async getToken(): Promise<Address> {
    const fund = new FundContract(this.address);
    const data = fund.getFundToken();
    const params = [
      {
        from: this.account.address,
        to: this.address,
        data: data,
      },
      "latest",
    ];
    const result = await this.account.makeRequest("eth_call", params);
    return ethUtils.toChecksumAddress("0x" + result.substring(26));
  }

  async getTokenTotalSupply(): Promise<JSBI> {
    const tokenAddress = await this.getToken();
    const token = new ERC20(tokenAddress);
    const data = token.totalSupply();
    const params = [
      {
        from: this.account.address,
        to: tokenAddress,
        data: data,
      },
      "latest",
    ];
    const result = await this.account.makeRequest("eth_call", params);
    return JSBI.BigInt(result);
  }
}

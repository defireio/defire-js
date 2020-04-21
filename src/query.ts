import { Address, Configuration, Account } from "typings";
import { Registry, FundRegistry } from "./contracts/Registry";
import { ERC20 } from "./contracts/ERC20";
import { Fund } from "./fund/fund";
import { Portfolio } from "./portfolio/portfolio";
import { validateAddress } from "./utils/utils";
import { InvalidAddress } from "./utils/errors";
import { ETH_ADDRESS } from "./common/constants";
import { loadAssets } from "./utils/assets";
import JSBI from "jsbi";

export class Query {
  config: Configuration;
  account: Account;

  constructor(config: Configuration, account: Account) {
    this.config = config;
    this.account = account;
  }

  async isFund(address: Address): Promise<boolean> {
    validateAddress(address, new InvalidAddress());
    const registry = new FundRegistry(this.config.contracts.FUND_REGISTRY);
    const data = registry.isFund(address);
    const params = [
      {
        from: this.account.address,
        to: registry.address,
        data: data,
      },
      "latest",
    ];
    const result = await this.account.makeRequest("eth_call", params);
    return parseInt(result.substring(2)) == 1;
  }

  async getFund(address: Address): Promise<Fund> {
    const valid = await this.isFund(address);
    if (valid) {
      return new Fund(this.config, address, this.account);
    } else {
      throw "Invalid fund address";
    }
  }

  async getPortfolio(address: Address): Promise<Portfolio> {
    validateAddress(address, new InvalidAddress());
    return new Portfolio(this.config, address, this.account);
  }

  async isOperation(address: Address): Promise<boolean> {
    validateAddress(address, new InvalidAddress());
    const registry = new Registry(this.config.contracts.OPERATION_REGISTRY);
    const data = registry.isElement(address);
    const params = [
      {
        from: this.account.address,
        to: registry.address,
        data: data,
      },
      "latest",
    ];
    const result = await this.account.makeRequest("eth_call", params);
    return parseInt(result.substring(2)) == 1;
  }

  async isAsset(address: Address): Promise<boolean> {
    validateAddress(address, new InvalidAddress());
    const registry = new Registry(this.config.contracts.ASSET_REGISTRY);
    const data = registry.isElement(address);
    const params = [
      {
        from: this.account.address,
        to: registry.address,
        data: data,
      },
      "latest",
    ];
    const result = await this.account.makeRequest("eth_call", params);
    return parseInt(result.substring(2)) == 1;
  }

  async hasAsset(assetAddress: Address): Promise<boolean> {
    const balance = await this.balance(assetAddress);
    return JSBI.GT(balance, 0);
  }

  async getAssets(): Promise<string[]> {
    const assets: Address[] = [];
    const assetsObj = loadAssets(this.config);
    for (let asset of Object.values(assetsObj)) {
      if (await this.hasAsset(asset)) {
        assets.push(asset);
      }
    }
    return assets;
  }

  async balance(assetAddress: Address): Promise<JSBI> {
    validateAddress(assetAddress, new InvalidAddress());
    let method;
    let params;
    if (assetAddress == ETH_ADDRESS) {
      method = "eth_getBalance";
      params = [this.account.address, "latest"];
    } else {
      method = "eth_call";
      const token = new ERC20(assetAddress);
      const data = token.balanceOf(this.account.address);
      params = [
        {
          from: this.account.address,
          to: assetAddress,
          data: data,
        },
        "latest",
      ];
    }
    const result = await this.account.makeRequest(method, params);
    return JSBI.BigInt(result);
  }
}

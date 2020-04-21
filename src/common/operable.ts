import {
  Address,
  ActionOptions,
  OperationParam,
  Account,
  Operation,
} from "typings";
import * as ethUtils from "ethereumjs-util";
import { Operable } from "../contracts/Operable";
import { ERC20 } from "../contracts/ERC20";
import { Action, executeAction } from "./action";
import { validateAddress, validateArray } from "../utils/utils";
import { ETH_ADDRESS } from "./constants";
import { decodeParameters } from "../utils/utils";
import JSBI from "jsbi";
import { InvalidAddress, InvalidArray, InvalidParams } from "../utils/errors";

export class Actions {
  address: Address;
  account: Account;

  constructor(address: Address, account: Account) {
    this.address = address;
    this.account = account;
  }

  async addManager(
    manager: Address,
    opts: ActionOptions = {}
  ): Promise<Address | Action> {
    validateAddress(manager, new InvalidAddress());
    const operable = new Operable(this.address);
    const data = operable.addManager(manager);
    const action = new Action(
      this.account,
      this.address,
      data,
      Object.assign(opts, {
        parseResult: () => {
          return manager;
        },
      })
    );
    return await executeAction(action, opts);
  }

  async removeManager(
    manager: Address,
    opts: ActionOptions = {}
  ): Promise<Address | Action> {
    validateAddress(manager, new InvalidAddress());
    const operable = new Operable(this.address);
    const data = operable.removeManager(manager);
    const action = new Action(
      this.account,
      this.address,
      data,
      Object.assign(opts, {
        parseResult: () => {
          return manager;
        },
      })
    );
    return await executeAction(action, opts);
  }

  async execute(
    param: Operation | Operation[],
    opts: ActionOptions = {}
  ): Promise<boolean | Action> {
    if (Object.prototype.toString.call(param) === "[object Array]") {
      return this._executeMultipleOperations(param as Operation[], opts);
    } else if (typeof param === "object") {
      return this._executeSingleOperation(param as Operation, opts);
    } else {
      throw new InvalidParams();
    }
  }

  async _executeSingleOperation(
    operation: Operation,
    opts: ActionOptions = {}
  ): Promise<boolean | Action> {
    const encodedParams = operation.query.getEncodedParams();
    const operationData = {
      addr: operation.address,
      inAmounts: operation.query.inAssets,
      outAmounts: operation.query.outAssets,
      params: encodedParams,
    };
    const operable = new Operable(this.address);
    const data = operable.executeOperation(operationData);
    const action = new Action(this.account, this.address, data, opts);
    return await executeAction(action, opts);
  }

  async _executeMultipleOperations(
    operations: Operation[],
    opts: ActionOptions = {}
  ): Promise<boolean | Action> {
    validateArray(
      operations,
      1,
      new InvalidArray("There must be at least one operation to exceute.")
    );
    if (operations.length < 1) {
      throw "There must be at least one operation";
    }
    const operationsData: OperationParam[] = [];
    for (let index = 0; index < operations.length; index++) {
      const operation = operations[index];
      const encodedParams = operation.query.getEncodedParams();
      operationsData.push({
        addr: operation.address,
        inAmounts: operation.query.inAssets,
        outAmounts: operation.query.outAssets,
        params: encodedParams,
      });
    }
    const operable = new Operable(this.address);
    const data = operable.executeOperations(operationsData);
    const action = new Action(this.account, this.address, data, opts);
    return await executeAction(action, opts);
  }
}

export class Query {
  address: Address;
  account: Account;

  constructor(address: Address, account: Account) {
    this.address = address;
    this.account = account;
  }

  async isManager(address: Address): Promise<boolean> {
    validateAddress(address, new InvalidAddress());
    const operable = new Operable(this.address);
    const data = operable.isManager(address);
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

  async isMainManager(address: Address): Promise<boolean> {
    validateAddress(address, new InvalidAddress());
    const operable = new Operable(this.address);
    const data = operable.isMainManager(address);
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

  async hasAsset(assetAddress: Address): Promise<boolean> {
    validateAddress(assetAddress, new InvalidAddress());
    const operable = new Operable(this.address);
    const data = operable.hasAsset(assetAddress);
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

  async getAssets(): Promise<string[]> {
    const operable = new Operable(this.address);
    const data = operable.getAssets();
    const params = [
      {
        from: this.account.address,
        to: this.address,
        data: data,
      },
      "latest",
    ];
    const result = await this.account.makeRequest("eth_call", params);
    const addresses: Address[] = decodeParameters(["address[]"], result);
    return addresses.map((addr: Address) => ethUtils.toChecksumAddress(addr));
  }

  async balance(assetAddress: Address): Promise<JSBI> {
    validateAddress(assetAddress, new InvalidAddress());
    let method;
    let params;
    if (assetAddress == ETH_ADDRESS) {
      method = "eth_getBalance";
      params = [this.address, "latest"];
    } else {
      method = "eth_call";
      const token = new ERC20(assetAddress);
      const data = token.balanceOf(this.address);
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

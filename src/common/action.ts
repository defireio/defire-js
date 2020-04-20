import {
  Address,
  ActionOptions,
  Configuration,
  Transaction,
  Account,
} from "typings";
import { ActionFailed } from "../utils/errors";
import JSBI from "jsbi";

export enum ACTION_STATUS {
  NOT_EXECUTED = 0,
  EXECUTING = 1,
  SUCCEED = 2,
  FAILED = 3,
}

export const executeAction = async (action: Action, opts: ActionOptions) => {
  try {
    if (opts.execute === false) {
      return action;
    }
    await action.execute(true);
    if (action.status === ACTION_STATUS.SUCCEED) {
      return action.parseResult ? action.parseResult(action.result) : true;
    } else {
      throw new Error(action.error);
    }
  } catch (e) {
    throw new ActionFailed("Action failed: " + e.message);
  }
};

export class Action {
  config: Configuration;
  account: Account;
  opts: ActionOptions;
  status: ACTION_STATUS;
  txParams: Transaction;
  hash?: string;
  result?: any;
  error?: string;
  parseResult?: (result: any) => any;

  constructor(
    account: Account,
    address: Address,
    data: string,
    opts: ActionOptions = {}
  ) {
    this.config = account.config;
    this.account = account;
    this.status = ACTION_STATUS.NOT_EXECUTED;
    this.opts = opts;
    this.parseResult = this.opts.parseResult;
    this.txParams = this.getTxParams(address, data);
  }

  getTxParams(address: Address, data: string): Transaction {
    const gasPrice = this.getGasPrice();
    const gasLimit = this.getGasLimit();
    const value = this.getTxValue();
    return {
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      to: address,
      data: data,
      value: value,
    };
  }

  getGasPrice(): string {
    return (
      "0x" +
      (this.opts.gasPrice
        ? this.opts.gasPrice.toString(16)
        : JSBI.BigInt(this.config.gasPrice).toString(16))
    );
  }

  getGasLimit(): string {
    return (
      "0x" +
      (this.opts.gasLimit
        ? this.opts.gasLimit.toString(16)
        : JSBI.BigInt(this.config.gasLimit).toString(16))
    );
  }

  getTxValue(): string {
    return this.opts.value ? "0x" + this.opts.value.toString(16) : "0x0";
  }

  async execute(wait: boolean): Promise<Action> {
    try {
      const hash = await this.account.sendTransaction(this.txParams);
      this.status = ACTION_STATUS.EXECUTING;
      this.hash = hash;
      if (wait) {
        await this.updateStatus();
        while (this.status === ACTION_STATUS.EXECUTING) {
          await this.waitAndUpdateStatus();
        }
      }
      return this;
    } catch (e) {
      this.status = ACTION_STATUS.FAILED;
      this.error = e.message;
      return this;
    }
  }

  async waitAndUpdateStatus() {
    const that = this;
    return new Promise((resolve, reject) => {
      setTimeout(async function () {
        try {
          await that.updateStatus();
          resolve();
        } catch (e) {
          reject();
        }
      }, 3000);
    });
  }

  async updateStatus() {
    if (this.status === ACTION_STATUS.EXECUTING) {
      let params = [this.hash];
      const result = await this.account.makeRequest(
        "eth_getTransactionReceipt",
        params
      );

      if (result === null) return;

      if (result.status == "0x1") {
        this.result = result;
        this.status = ACTION_STATUS.SUCCEED;
      } else {
        this.result = null;
        this.error = "Ethereum transaction failed";
        this.status = ACTION_STATUS.FAILED;
      }
    }
  }
}

import {
  Address,
  Account,
  Operation as IOperation,
  OperationQuery,
  OutAssetAmount,
} from "typings";
import {
  encodeParameters,
  validateField,
  validateObjectAmount,
  amountToString,
  validateAddress,
} from "../utils/utils";
import { MissingField, InvalidAddress } from "../utils/errors";
import * as helper from "./helper";

class Query {
  address: Address;
  account: Account;
  inAssets: string[];
  outAssets: OutAssetAmount[];
  paramTypes: string[];
  paramValues: any[];

  constructor(
    address: Address,
    account: Account,
    inAssets: string[],
    paramTypes: string[],
    paramValues: any[]
  ) {
    this.address = address;
    this.account = account;
    this.inAssets = inAssets;
    this.outAssets = [];
    this.paramTypes = paramTypes;
    this.paramValues = paramValues;
  }

  async getInAssets(): Promise<string[]> {
    return helper.getInAssets(
      this.account,
      this.address,
      this.getEncodedParams()
    );
  }

  async getOutAssets(): Promise<string[]> {
    return helper.getOutAssets(
      this.account,
      this.address,
      this.getEncodedParams()
    );
  }

  getEncodedParams(): string {
    if (this.paramTypes.length == 0) {
      return "0x0";
    } else {
      return encodeParameters(this.paramTypes, this.paramValues);
    }
  }
}

export class Operation implements IOperation {
  address: Address;
  query: OperationQuery;

  constructor(
    account: Account,
    address: Address,
    inAssets: string[],
    paramTypes: string[],
    paramValues: any[],
  ) {
    this.address = address;

    this.query = new Query(
      this.address,
      account,
      inAssets,
      paramTypes,
      paramValues
    );
  }

  redirectOutput(params: any) {
    validateField(params, "asset", new MissingField("Need to set address"));
    validateAddress(params.asset, new InvalidAddress());
    validateObjectAmount(params, "amount");
    this.query.outAssets.push({
      asset: params.asset,
      amount: amountToString(params.amount),
      isPercentage: params.isPercentage ? true : false,
      to: params.to,
    });
  }
}

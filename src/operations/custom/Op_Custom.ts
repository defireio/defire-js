import { Account } from "typings";
import { Operation } from "../Operation";
import { amountToString } from "../../utils/utils";
import JSBI from "JSBI";

export const load = (account: Account): Function => {
  class Custom extends Operation {
    constructor(params: any) {
      const amounts: string[] = params.amounts.map(
        (amount: string | number | JSBI) => {
          return amountToString(amount);
        }
      );
      const types: string[] = [];
      const values: any[] = [];
      for (const param of params.params) {
        types.push(param.type);
        values.push(amountToString(params.value));
      }
      super(account, params.operationAddress, amounts, types, values, false);
    }
  }
  return Custom;
};

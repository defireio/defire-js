import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import {
  validateObjectAmount,
  amountToString,
  hasField,
} from "../../utils/utils";

export const load = (
  config: Configuration,
  account: Account,
  inAsset: string,
  outAsset: string
): Function => {
  class Op_Uniswap extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amount" + inAsset);
      const contractName: string = "OP_UNISWAP_" + inAsset + "_TO_" + outAsset;
      let deadline;
      if (hasField(params, "deadline")) {
        deadline = params.deadline;
      } else {
        const secondsToToday = new Date().getTime() / 1000;
        deadline = Math.floor(secondsToToday + 300); // 5 minutes from now
      }
      let minAmount;
      if (hasField(params, "min" + outAsset)) {
        minAmount = amountToString(params["min" + outAsset]);
      } else {
        minAmount = "1";
      }
      super(
        account,
        // @ts-ignore
        config.contracts[contractName],
        [amountToString(params["amount" + inAsset])],
        ["uint256", "uint256"],
        [minAmount, deadline],
        false
      );
    }
  }

  return Op_Uniswap;
};

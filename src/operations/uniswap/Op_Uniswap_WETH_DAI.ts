import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import {
  validateObjectAmount,
  amountToString,
  hasField,
} from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Uniswap_WETH_DAI extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountWETH");
      let deadline;
      if (hasField(params, "deadline")) {
        deadline = params.deadline;
      } else {
        const secondsToToday = new Date().getTime() / 1000;
        deadline = Math.floor(secondsToToday + 300); // 5 minutes from now
      }
      let minDAI;
      if (hasField(params, "minDAI")) {
        minDAI = amountToString(params.minETH);
      } else {
        minDAI = "1";
      }
      super(
        account,
        config.contracts.OP_UNISWAP_WETH_TO_DAI,
        [amountToString(params.amountWETH)],
        ["uint256", "uint256"],
        [minDAI, deadline],
        false
      );
    }
  }

  return Uniswap_WETH_DAI;
};

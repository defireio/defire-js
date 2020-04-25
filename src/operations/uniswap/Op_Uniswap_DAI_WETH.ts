import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import {
  validateObjectAmount,
  amountToString,
  hasField,
} from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Uniswap_DAI_WETH extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountDAI");
      let deadline;
      if (hasField(params, "deadline")) {
        deadline = params.deadline;
      } else {
        const secondsToToday = new Date().getTime() / 1000;
        deadline = Math.floor(secondsToToday + 300); // 5 minutes from now
      }
      let minWETH;
      if (hasField(params, "minWETH")) {
        minWETH = amountToString(params.minETH);
      } else {
        minWETH = "1";
      }
      super(
        account,
        config.contracts.OP_UNISWAP_DAI_TO_WETH,
        [amountToString(params.amountDAI)],
        ["uint256", "uint256"],
        [minWETH, deadline],
        false
      );
    }
  }

  return Uniswap_DAI_WETH;
};

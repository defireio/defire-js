import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import {
  validateObjectAmount,
  amountToString,
  hasField,
} from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Uniswap_DAI_ETH extends Operation {
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
      let minETH;
      if (hasField(params, "minETH")) {
        minETH = amountToString(params.minETH);
      } else {
        minETH = "1";
      }
      super(
        account,
        config.contracts.OP_UNISWAP_DAI_TO_ETH,
        [amountToString(params.amountDAI)],
        ["uint256", "uint256"],
        [minETH, deadline],
        false
      );
    }
  }

  return Uniswap_DAI_ETH;
};

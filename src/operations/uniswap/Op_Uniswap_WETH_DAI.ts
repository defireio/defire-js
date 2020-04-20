import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Uniswap_WETH_DAI extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountWETH");
      super(
        account,
        config.contracts.OP_UNISWAP_WETH_DAI,
        [amountToString(params.amountWETH)],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Uniswap_WETH_DAI;
};

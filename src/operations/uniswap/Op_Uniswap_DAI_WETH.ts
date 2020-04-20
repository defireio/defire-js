import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Uniswap_DAI_WETH extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountDAI");
      super(
        account,
        config.contracts.OP_UNISWAP_DAI_WETH,
        [amountToString(params.amountDAI)],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Uniswap_DAI_WETH;
};

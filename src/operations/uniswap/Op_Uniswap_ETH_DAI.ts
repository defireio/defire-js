import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Uniswap_ETH_DAI extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountETH");
      super(
        account,
        config.contracts.OP_UNISWAP_ETH_DAI,
        [amountToString(params.amountETH)],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Uniswap_ETH_DAI;
};

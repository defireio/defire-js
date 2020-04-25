import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Compound_WBTC_CWBTC extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountWBTC");
      super(
        account,
        config.contracts.OP_COMPOUND_WBTC_TO_CWBTC,
        [amountToString(params.amountWBTC)],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Compound_WBTC_CWBTC;
};

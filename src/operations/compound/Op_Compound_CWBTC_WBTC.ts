import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Compound_CWBTC_WBTC extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountCWBTC");
      super(
        account,
        config.contracts.OP_COMPOUND_CWBTC_TO_WBTC,
        [amountToString(params.amountCWBTC)],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Compound_CWBTC_WBTC;
};

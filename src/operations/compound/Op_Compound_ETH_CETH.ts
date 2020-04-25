import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Compound_ETH_CETH extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountETH");
      super(
        account,
        config.contracts.OP_COMPOUND_ETH_TO_CETH,
        [amountToString(params.amountETH)],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Compound_ETH_CETH;
};

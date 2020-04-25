import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Compound_CETH_ETH extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountCETH");
      super(
        account,
        config.contracts.OP_COMPOUND_CETH_TO_ETH,
        [amountToString(params.amountCETH)],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Compound_CETH_ETH;
};

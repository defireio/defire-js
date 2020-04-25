import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Compound_USDC_CUSDC extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountUSDC");
      super(
        account,
        config.contracts.OP_COMPOUND_USDC_TO_CUSDC,
        [amountToString(params.amountUSDC)],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Compound_USDC_CUSDC;
};

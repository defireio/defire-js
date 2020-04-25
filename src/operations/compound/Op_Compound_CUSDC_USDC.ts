import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Compound_CUSDC_USDC extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountCUSDC");
      super(
        account,
        config.contracts.OP_COMPOUND_CUSDC_TO_USDC,
        [amountToString(params.amountCUSDC)],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Compound_CUSDC_USDC;
};

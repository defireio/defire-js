import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Compound_DAI_CDAI extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountDAI");
      super(
        account,
        config.contracts.OP_COMPOUND_DAI_CDAI,
        [amountToString(params.amountDAI)],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Compound_DAI_CDAI;
};

import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Compound_CDAI_DAI extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amountCDAI");
      super(
        account,
        config.contracts.OP_COMPOUND_CDAI_DAI,
        [amountToString(params.amountCDAI)],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Compound_CDAI_DAI;
};

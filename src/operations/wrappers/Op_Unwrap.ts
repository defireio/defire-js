import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (
  config: Configuration,
  account: Account,
  inAsset: string,
  outAsset: string
): Function => {
  class Op_Unwrap extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amount" + outAsset);
      const contractName: string = "OP_UNWRAP_" + inAsset;
      super(
        account,
        // @ts-ignore
        config.contracts[contractName],
        [amountToString(params["amount" + outAsset])],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Op_Unwrap;
};

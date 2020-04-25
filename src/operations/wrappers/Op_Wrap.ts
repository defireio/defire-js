import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (
  config: Configuration,
  account: Account,
  inAsset: string
): Function => {
  class Op_Wrap extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amount" + inAsset);
      const contractName: string = "OP_WRAP_" + inAsset;
      super(
        account,
        // @ts-ignore
        config.contracts[contractName],
        [amountToString(params["amount" + inAsset])],
        [], //No params types
        [], //No params
        false
      );
    }
  }

  return Op_Wrap;
};

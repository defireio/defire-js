import { Configuration, Account } from "typings";
import { Operation } from "../Operation";
import { validateObjectAmount, amountToString } from "../../utils/utils";

export const load = (
  config: Configuration,
  account: Account,
  inAsset: string,
  outAsset: string
): Function => {
  class Op_Compound extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAmount(params, "amount" + inAsset);
      const contractName: string = "OP_COMPOUND_" + inAsset + "_TO_" + outAsset;
      super(
        account,
        // @ts-ignore
        config.contracts[contractName],
        [amountToString(params["amount" + inAsset])],
        [], //No params types
        [], //No params
      );
    }
  }

  return Op_Compound;
};

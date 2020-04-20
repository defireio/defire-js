import { Configuration, Account, AssetAmount } from "typings";
import { Operation } from "../Operation";
import { validateObjectAddress, validateObjectAmount } from "../../utils/utils";

export const load = (account: Account): Function => {
  class Op_Fund_Withdraw extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAddress(params, "fundAddress");
      validateObjectAmount(params, "amount");
      super(
        account,
        params.fundAddress,
        [params.amount],
        ["bool"],
        [false],
        true
      );
    }
  }

  return Op_Fund_Withdraw;
};

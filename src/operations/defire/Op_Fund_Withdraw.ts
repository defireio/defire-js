import { Configuration, Account, AssetAmount } from "typings";
import { Operation } from "../Operation";
import { validateObjectAddress, validateObjectAmount } from "../../utils/utils";

export const load = (config: Configuration, account: Account): Function => {
  class Op_Fund_Withdraw extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAddress(params, "fundAddress");
      validateObjectAmount(params, "amount");
      super(
        account,
        // @ts-ignore
        config.contracts["OP_FUND_DEPOSIT_WITHDRAW"],
        [params.amount],
        ["address", "bool", "uint256"],
        [params.fundAddress, false, params.amount]
      );
    }
  }

  return Op_Fund_Withdraw;
};

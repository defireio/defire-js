import { Configuration, Account, AssetAmount } from "typings";
import { Operation } from "../Operation";
import {
  validateObjectAddress,
  validateObjectAmount,
  validateField,
  amountToString,
} from "../../utils/utils";
import { MissingField } from "../../utils/errors";

export const load = (config: Configuration, account: Account): Function => {
  class Op_Fund_Deposit extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAddress(params, "fundAddress");
      validateField(params, "amounts", new MissingField("Need to set amounts"));
      const inAssetAmounts = params.amounts.map((assetAmount: AssetAmount) => {
        validateObjectAmount(assetAmount, "amount");
        return amountToString(assetAmount.amount);
      });
      super(
        account,
        // @ts-ignore
        config.contracts["OP_FUND_DEPOSIT_WITHDRAW"],
        inAssetAmounts,
        ["address", "bool", "address[]", "uint256[]"],
        [
          params.fundAddress,
          true,
          params.amounts.map((assetAmount: AssetAmount) => {
            validateObjectAddress(assetAmount, "asset");
            return assetAmount.asset;
          }),
          inAssetAmounts,
        ]
      );
    }
  }

  return Op_Fund_Deposit;
};

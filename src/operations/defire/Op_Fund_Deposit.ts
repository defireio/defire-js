import { Configuration, Account, AssetAmount } from "typings";
import { Operation } from "../Operation";
import {
  validateObjectAddress,
  validateObjectAmount,
  validateField,
  amountToString,
} from "../../utils/utils";
import { MissingField } from "../../utils/errors";

export const load = (account: Account): Function => {
  class Op_Fund_Deposit extends Operation {
    constructor(params: any) {
      //Validate
      validateObjectAddress(params, "fundAddress");
      validateField(params, "amounts", new MissingField("Need to set amounts"));
      super(
        account,
        params.fundAddress,
        params.amounts.map((assetAmount: AssetAmount) => {
          validateObjectAmount(assetAmount, "amount");
          return amountToString(assetAmount.amount);
        }),
        ["bool", "address[]"],
        [
          true,
          params.amounts.map((assetAmount: AssetAmount) => {
            validateObjectAddress(assetAmount, "asset");
            return assetAmount.asset;
          }),
        ],
        true
      );
    }
  }

  return Op_Fund_Deposit;
};

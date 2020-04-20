import {
  Address,
  ActionOptions,
  AssetAmount,
  OperationParam,
  Account,
  Operation,
} from "typings";
import { Portfolio as PortfolioContract } from "../contracts/portfolio";
import { Action, executeAction } from "../common/action";
import { Actions as OperableActions } from "../common/operable";
import {
  validateAddress,
  validateArray,
  validateField,
  validateAmount,
  amountToString
} from "../utils/utils";
import { InvalidAddress, InvalidArray } from "../utils/errors";

export class Actions extends OperableActions {
  constructor(address: Address, account: Account) {
    super(address, account);
  }

  async addOwner(
    owner: Address,
    opts: ActionOptions = {}
  ): Promise<Address | Action> {
    validateAddress(owner, new InvalidAddress());
    const portfolio = new PortfolioContract(this.address);
    const data = portfolio.addOwner(owner);
    const action = new Action(this.account, this.address, data, opts);
    return await executeAction(
      action,
      Object.assign(opts, {
        parseResult: () => {
          return owner;
        },
      })
    );
  }

  async removeOwner(
    owner: Address,
    opts: ActionOptions = {}
  ): Promise<Address | Action> {
    validateAddress(owner, new InvalidAddress());
    const portfolio = new PortfolioContract(this.address);
    const data = portfolio.removeOwner(owner);
    const action = new Action(this.account, this.address, data, opts);
    return await executeAction(
      action,
      Object.assign(opts, {
        parseResult: () => {
          return owner;
        },
      })
    );
  }

  async withdraw(
    to: Address,
    amountAssets: AssetAmount[],
    opts: ActionOptions = {}
  ): Promise<boolean | Action> {
    this._validateWithdrawParams(to, amountAssets);
    const assets: Address[] = [];
    const amounts: string[] = [];
    amountAssets.forEach((amountAsset) => {
      assets.push(amountAsset.asset);
      amounts.push(amountToString(amountAsset.amount));
    });
    const portfolio = new PortfolioContract(this.address);
    const data = portfolio.withdraw(assets, amounts, to);
    const action = new Action(this.account, this.address, data, opts);
    return await executeAction(action, opts);
  }

  _validateWithdrawParams(to: Address, amountAssets: AssetAmount[]) {
    validateAddress(to, new InvalidAddress());
    validateArray(
      amountAssets,
      1,
      new InvalidArray("There must be at least one asset to withdraw.")
    );
    for (const amountAsset of amountAssets) {
      validateField(
        amountAsset,
        "asset",
        new InvalidArray("Asset item does not contain field asset")
      );
      validateAddress(
        amountAsset.asset,
        new InvalidArray("Invalid asset address format")
      );
      validateField(
        amountAsset,
        "amount",
        new InvalidArray("Asset item does not contain field amount")
      );
      validateAmount(
        amountAsset.amount,
        new InvalidArray("Invalid asset amount format, needs to be a string | number or JSBI") 
      );
    }
  }

  _validateOperationsParam(operations: Operation[]) {
    validateArray(
      operations,
      1,
      new InvalidArray("There must be at least one operation to exceute.")
    );
  }
}

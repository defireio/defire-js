import {
  Address,
  AssetAmount,
  OperationParam,
  Configuration,
  ActionOptions,
  Account,
  CreatePortfolioParams,
  CreateFundParams,
} from "typings";
import * as ethUtil from "ethereumjs-util";
import { Action, executeAction } from "./common/action";
import { Operation } from "./operations/Operation";
import { Fund } from "./fund/fund";
import { Portfolio } from "./portfolio/portfolio";
import { FundFactory } from "./contracts/FundFactory";
import { PortfolioFactory } from "./contracts/PortfolioFactory";
import { DefireAccount } from "./contracts/DefireAccount";
import { ERC20 } from "./contracts/ERC20";
import {
  validateAddress,
  validateArray,
  validateField,
  decodeParameters,
} from "./utils/utils";
import {
  InvalidAddress,
  InvalidArray,
  MissingField,
  InvalidParams,
} from "./utils/errors";
import { ETH_ADDRESS } from "./common/constants";
import JSBI from "jsbi";

export class Actions {
  config: Configuration;
  account: Account;

  constructor(config: Configuration, account: Account) {
    this.config = config;
    this.account = account;
  }

  async createFund(
    params: CreateFundParams,
    opts: ActionOptions = {}
  ): Promise<boolean> {
    validateField(
      params,
      "managers",
      new MissingField("Need to set fund managers")
    );
    validateArray(
      params.managers,
      1,
      new InvalidArray(
        "Managers must be an array with at least one manager address."
      )
    );
    for (const manager of params.managers) {
      validateAddress(manager, new InvalidAddress());
    }
    const operations = params.operations ? params.operations : [];
    for (const operation of operations) {
      validateAddress(operation, new InvalidAddress());
    }
    const assets = params.assets ? params.operations : [];
    for (const asset of assets) {
      validateAddress(asset, new InvalidAddress());
    }
    const fundFactory = new FundFactory(this.config.contracts.FUND_FACTORY);
    const data = fundFactory.createInstance(
      params.managers,
      operations,
      assets
    );
    const parseResult = (result: any) => {
      const data = result.logs[result.logs.length - 1].data;
      const address = decodeParameters(["address"], data);
      return new Fund(
        this.config,
        ethUtil.toChecksumAddress(address),
        this.account
      );
    };
    const action = new Action(
      this.account,
      fundFactory.address,
      data,
      Object.assign(opts, {
        parseResult: parseResult,
      })
    );
    return await executeAction(action, opts);
  }

  async createPortfolio(
    params: CreatePortfolioParams,
    opts: ActionOptions = {}
  ) {
    validateField(
      params,
      "owners",
      new MissingField("Need to set portfolio owners")
    );
    validateArray(
      params.owners,
      1,
      new InvalidArray(
        "Owners must be an array with at least one owner address."
      )
    );
    for (const owner of params.owners) {
      validateAddress(owner, new InvalidAddress());
    }
    validateField(
      params,
      "managers",
      new MissingField("Need to set portfolio managers")
    );
    validateArray(
      params.managers,
      1,
      new InvalidArray(
        "Managers must be an array with at least one manager address."
      )
    );
    for (const manager of params.managers) {
      validateAddress(manager, new InvalidAddress());
    }
    const operations = params.operations ? params.operations : [];
    for (const operation of operations) {
      validateAddress(operation, new InvalidAddress());
    }
    const assets = params.assets ? params.operations : [];
    for (const asset of assets) {
      validateAddress(asset, new InvalidAddress());
    }

    const portfolioFactory = new PortfolioFactory(
      this.config.contracts.PORTFOLIO_FACTORY
    );
    const data = portfolioFactory.createInstance(
      params.owners,
      params.managers,
      operations,
      assets
    );
    const parseResult = (result: any) => {
      const data = result.logs[result.logs.length - 1].data;
      const address = decodeParameters(["address"], data);
      return new Portfolio(
        this.config,
        ethUtil.toChecksumAddress(address),
        this.account
      );
    };
    const action = new Action(
      this.account,
      portfolioFactory.address,
      data,
      Object.assign(opts, {
        parseResult: parseResult,
      })
    );
    return await executeAction(action, opts);
  }

  async execute(
    param: Operation | Operation[],
    opts: ActionOptions = {}
  ): Promise<boolean | Action> {
    if (Object.prototype.toString.call(param) === "[object Array]") {
      return this._executeMultipleOperations(param as Operation[], opts, true);
    } else if (typeof param === "object") {
      return this._executeSingleOperation(param as Operation, opts, true);
    } else {
      throw new InvalidParams();
    }
  }

  async executeUnsafe(
    param: Operation | Operation[],
    opts: ActionOptions = {}
  ): Promise<boolean | Action> {
    if (Object.prototype.toString.call(param) === "[object Array]") {
      return this._executeMultipleOperations(param as Operation[], opts, false);
    } else if (typeof param === "object") {
      return this._executeSingleOperation(param as Operation, opts, false);
    } else {
      throw new InvalidParams();
    }
  }

  async _executeSingleOperation(
    operation: Operation,
    opts: ActionOptions = {},
    safe: boolean
  ): Promise<boolean | Action> {
    const encodedParams = operation.query.getEncodedParams();
    const operationData = {
      addr: operation.address,
      inAmounts: operation.query.inAssets,
      outAmounts: operation.query.outAssets,
      params: encodedParams,
    };
    //Allowance is always executed if autoAllowTokens
    const assets = await operation.query.getInAssets();
    const ethValue = await this._approveAssets(
      assets,
      operation.query.inAssets,
      Object.assign(JSON.parse(JSON.stringify(opts)), { execute: true })
    );
    const defireAccount = new DefireAccount(
      this.config.contracts.DEFIRE_ACCOUNT
    );
    const data = defireAccount.executeOperation(operationData, safe);
    const newOpts = Object.assign(opts, { value: ethValue });
    const action = new Action(
      this.account,
      defireAccount.address,
      data,
      newOpts
    );
    return await executeAction(action, newOpts);
  }

  async _executeMultipleOperations(
    operations: Operation[],
    opts: ActionOptions = {},
    safe: boolean
  ): Promise<boolean | Action> {
    validateArray(
      operations,
      1,
      new InvalidArray("There must be at least one operation to exceute.")
    );
    if (operations.length < 1) {
      throw "There must be at least one operation";
    }
    const operationsData: OperationParam[] = [];
    const assetsAmount: any = {};
    for (let index = 0; index < operations.length; index++) {
      const operation = operations[index];
      //Allowance is always executed if autoAllowTokens
      const assets = await operation.query.getInAssets();
      for (let j = 0; j < assets.length; j++) {
        const amount = JSBI.BigInt(operation.query.inAssets[j]);
        assetsAmount[assets[j]] = assetsAmount[assets[j]]
          ? JSBI.add(assetsAmount[assets[j]], amount)
          : amount;
      }
      const encodedParams = operation.query.getEncodedParams();
      operationsData.push({
        addr: operation.address,
        inAmounts: operation.query.inAssets,
        outAmounts: operation.query.outAssets,
        params: encodedParams,
      });
    }
    //Approve assets
    const assets: Address[] = [];
    const amounts: Address[] = [];
    for (let key in assetsAmount) {
      assets.push(key);
      amounts.push(assetsAmount[key].toString(10));
    }
    const ethValue = await this._approveAssets(
      assets,
      amounts,
      Object.assign(JSON.parse(JSON.stringify(opts)), { execute: true })
    );
    const defireAccount = new DefireAccount(
      this.config.contracts.DEFIRE_ACCOUNT
    );
    const data = defireAccount.executeOperations(operationsData, safe);

    const newOpts = Object.assign(opts, { value: ethValue });
    const action = new Action(
      this.account,
      defireAccount.address,
      data,
      newOpts
    );
    return await executeAction(action, opts);
  }

  async _approveAssets(
    assets: Address[],
    amounts: string[],
    opts: ActionOptions = {}
  ): Promise<JSBI> {
    //Calculate amounts
    let ethValue: string = "0";

    for (let index = 0; index < assets.length; index++) {
      const asset = assets[index];
      const total = amounts[index];
      if (asset == ETH_ADDRESS) {
        ethValue = total;
      } else {
        //Request allowance if needed
        if (!opts.hasOwnProperty("autoAllowTokens") || opts.autoAllowTokens) {
          const token = new ERC20(asset);
          const data = token.approve(
            this.config.contracts.DEFIRE_ACCOUNT,
            total
          );
          const action = new Action(this.account, asset, data, opts);
          await executeAction(action, opts);
        }
      }
    }
    return JSBI.BigInt(ethValue);
  }
}

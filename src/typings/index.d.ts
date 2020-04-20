declare module "typings" {
  import JSBI from "JSBI";

  type Address = string;

  export interface Configuration {
    network: string;
    provider: string;
    gasPrice: number;
    gasLimit: number;

    contracts: {
      FUND_REGISTRY: Address;
      OPERATION_REGISTRY: Address;
      ASSET_REGISTRY: Address;
      FUND_FACTORY: Address;
      PORTFOLIO_FACTORY: Address;
      DEFIRE_ACCOUNT: Address;
      ETH: Address;
      DAI: Address;
      CDAI: Address;
      WETH: Address;
      OP_COMPOUND_DAI_CDAI: Address;
      OP_COMPOUND_CDAI_DAI: Address;
      OP_UNISWAP_DAI_WETH: Address;
      OP_UNISWAP_WETH_DAI: Address;
      OP_UNISWAP_DAI_ETH: Address;
      OP_UNISWAP_ETH_DAI: Address;
    };
  }

  interface MainAccountParamPrivateKey {
    privateKey: string;
    provider: Provider;
  }
  interface MainAccountParamWeb3js {
    web3js: any;
    address: Address;
  }
  interface MainAccountParamEthersjs {
    ethersjs: any;
    address: Address;
  }
  interface MainAccountParamEthjs {
    ethjs: any;
    address: Address;
  }
  interface MainAccountParamConnector {
    connector: Connector;
    address: Address;
  }
  type MainAccountParam =
    | MainAccountParamPrivateKey
    | MainAccountParamWeb3js
    | MainAccountParamEthersjs
    | MainAccountParamEthjs
    | MainAccountParamConnector;

  export interface Transaction {
    gasPrice: string;
    gasLimit: string;
    to: Address;
    data: string;
    value: string;
    from?: Address;
    nonce?: string;
  }

  export interface Provider {
    send(
      request: any,
      callback: (err: string, response: any) => void
    ): Promise<any>;
  }

  export interface Signature {
    r: Buffer;
    s: Buffer;
    v: number;
  }

  export interface Connector {
    send(params: any): string;
    sign(message: string): Signature;
    httpProvider: Provider;
  }

  export interface CreatePortfolioParams {
    owners: Address[];
    managers: Address[];
    operations: Address[];
    assets: Address[];
  }

  export interface CreateFundParams {
    managers: Address[];
    operations: Address[];
    assets: Address[];
  }

  export interface OperationParam {
    addr: Address;
    inAmounts: string[];
    outAmounts: OutAssetAmount[];
    params: string;
  }

  export interface AssetAmount {
    asset: Address;
    amount: JSBI;
  }

  export interface OutAssetAmount {
    asset: string;
    amount: string;
    isPercentage: boolean;
    to: Address;
  }

  export interface ActionOptions {
    parseResult?: (result: any) => any;
    gasLimit?: JSBI;
    gasPrice?: JSBI;
    value?: JSBI;
    execute?: boolean;
    autoAllowTokens?: boolean;
  }

  export interface Account {
    config: Configuration;
    address: Address;
    signMessage: (message: string) => void;
    sendTransaction: (txParams: Transaction) => Promise<string>;
    makeRequest: (method: string, params: any) => any;
  }

  export interface Operation {
    isFundOperation: boolean;
    address: Address;
    query: OperationQuery;
  }

  export interface OperationQuery {
    address: Address;
    account: Account;
    inAssets: string[];
    outAssets: OutAssetAmount[];
    getInAssets: () => Promise<string[]>;
    getOutAssets: () => Promise<string[]>;
    getEncodedParams: () => string;
  }

  export interface Param {
    type: string;
    value: any;
  }
}

import { Address, Transaction, Configuration, Account } from "typings";

export class Web3jsAccount implements Account {
  config: Configuration;
  web3js: any;
  address: Address;
  signMessage: (message: string) => void;
  sendTransaction: (txParams: Transaction) => Promise<string>;
  makeRequest: (method: string, params: any) => any;

  constructor(config: Configuration, web3js: any, address: Address) {
    this.config = config;
    this.web3js = web3js;
    this.address = address;

    this.signMessage = (message: string): Promise<string> => {
      return new Promise(async (resolve, reject) => {
        const sign = this.web3js.personal
          ? this.web3js.personal.sign
          : this.web3js.eth.personal.sign;
        const toHex = this.web3js.utils
          ? this.web3js.utils.toHex
          : this.web3js.toHex;
        sign(toHex(message), address, (err: string, sig: string) => {
          if (err) return reject(err);
          return resolve(sig);
        });
      });
    };

    this.sendTransaction = async (txParams: Transaction): Promise<string> => {
      txParams.from = this.address;
      return new Promise((resolve, reject) => {
        this.web3js.eth.sendTransaction(txParams, function (
          err: string,
          result: string
        ) {
          if (err) return reject(err);
          return resolve(result);
        });
      });
    };

    const createRequest = (method: string, params: any) => {
      return {
        jsonrpc: "2.0",
        method: method,
        params: params,
        id: Date.now(),
      };
    };

    this.makeRequest = async (method: string, params: any): Promise<any> => {
      return new Promise((resolve, reject) => {
        this.web3js.currentProvider.send(createRequest(method, params), function (
          err: string,
          response: any
        ) {
          if (err) return reject(err);
          return resolve(response.result);
        });
      });
    };
  }
}

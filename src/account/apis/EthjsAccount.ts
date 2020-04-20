import { Address, Transaction, Configuration, Account } from "typings";

export class EthjsAccount implements Account {
  config: Configuration;
  ethjs: any;
  address: Address;
  signMessage: (message: string) => void;
  sendTransaction: (txParams: Transaction) => Promise<string>;
  makeRequest: (method: string, params: any) => any;

  constructor(config: Configuration, ethjs: any, address: Address) {
    this.config = config;
    this.ethjs = ethjs;
    this.address = address;

    this.signMessage = (message: string): Promise<string> => {
      const messageHex = "0x" + Buffer.from(message, "utf8").toString("hex");
      return this.ethjs.sign(this.address.toLowerCase(), messageHex);
    };

    this.sendTransaction = async (txParams: Transaction): Promise<string> => {
      txParams.from = this.address;
      return this.ethjs.sendTransaction(txParams);
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
        this.ethjs.currentProvider.send(
          createRequest(method, params),
          function (err: string, response: any) {
            if (err) return reject(err);
            return resolve(response.result);
          }
        );
      });
    };
  }
}

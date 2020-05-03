import { Address, Transaction, Configuration, Account } from "typings";

export class EthersjsAccount implements Account {
  config: Configuration;
  etherJs: any;
  address: Address;
  signMessage: (message: string) => void;
  sendTransaction: (txParams: Transaction) => Promise<string>;
  makeRequest: (method: string, params: any) => any;

  constructor(config: Configuration, etherJs: any, address: Address) {
    this.config = config;
    this.etherJs = etherJs;
    this.address = address;

    this.signMessage = (message: string): Promise<string> => {
      const signer = this.etherJs.getSigner(this.address);
      return signer.signMessage(message);
    };

    this.sendTransaction = async (txParams: Transaction): Promise<string> => {
      const signer = this.etherJs.getSigner(this.address);
      const result = await signer.sendTransaction(txParams);
      return result.hash;
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
        this.etherJs.provider.send(createRequest(method, params), function (
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

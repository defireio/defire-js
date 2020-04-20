import * as ethTx from "ethereumjs-tx";
import * as ethUtils from "ethereumjs-util";
import {
  Address,
  Transaction,
  Configuration,
  Account,
  Provider,
} from "typings";
import fetch from "isomorphic-fetch";

export class PrivateKeyAccount implements Account {
  config: Configuration;
  address: Address;
  provider?: Provider;
  signMessage: (message: string) => void;
  sendTransaction: (txParams: Transaction) => Promise<string>;
  makeRequest: (method: string, params: any) => any;

  constructor(config: Configuration, pk: string, provider?: Provider) {
    this.config = config;
    this.provider = provider;

    this.address = ethUtils.toChecksumAddress(
      "0x" + ethUtils.privateToAddress(Buffer.from(pk, "hex")).toString("hex")
    );

    this.signMessage = async (message: string): Promise<string> => {
      const hashedMessaged = ethUtils.hashPersonalMessage(
        Buffer.from(message, "utf8")
      );
      const sig = ethUtils.ecsign(hashedMessaged, Buffer.from(pk, "hex"));
      return (
        "0x" +
        sig.r.toString("hex") +
        sig.s.toString("hex") +
        sig.v.toString(16)
      );
    };

    const getTransactionCount = async (address: Address) => {
      return await this.makeRequest("eth_getTransactionCount", [
        address,
        "latest",
      ]);
    };

    this.sendTransaction = async (txParams: Transaction): Promise<string> => {
      txParams.from = this.address;
      txParams.nonce = await getTransactionCount(this.address);
      const tx = new ethTx.Transaction(txParams);
      tx.sign(Buffer.from(pk, "hex"));
      const serializedTx = "0x" + tx.serialize().toString("hex");
      return this.makeRequest("eth_sendRawTransaction", [serializedTx]);
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
      return new Promise(async (resolve, reject) => {
        if (this.provider) {
          this.provider.send(createRequest(method, params), function (
            err: string,
            response: any
          ) {
            if (err) return reject(err);
            return resolve(response.result);
          });
        } else {
          let response = await fetch(this.config.provider, {
            method: "POST",
            body: JSON.stringify(createRequest(method, params)),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          let data = await response.json();
          if (data.error) {
            throw reject(data.error.message);
          }
          return resolve(data.result);
        }
      });
    };
  }
}

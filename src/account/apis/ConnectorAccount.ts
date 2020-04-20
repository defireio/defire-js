import {
  Address,
  Transaction,
  Connector,
  Configuration,
  Account,
} from "typings";
import * as ethUtils from "ethereumjs-util";
import * as ethTx from "ethereumjs-tx";

export class ConnectorAccount implements Account {
  config: Configuration;
  address: Address;
  signMessage: (message: string) => void;
  sendTransaction: (txParams: Transaction) => Promise<string>;
  makeRequest: (method: string, params: any) => any;

  constructor(config: Configuration, connector: Connector, address: Address) {
    this.config = config;
    this.address = address;

    this.signMessage = async (message: string) => {
      const hashedMessaged = ethUtils.hashPersonalMessage(
        Buffer.from(message, "utf8")
      );
      const sig = await connector.sign("0x" + hashedMessaged.toString("hex"));
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
        "pending",
      ]);
    };

    this.sendTransaction = async (txParams: Transaction): Promise<string> => {
      txParams.from = this.address;
      txParams.nonce = await getTransactionCount(this.address);
      const tx = new ethTx.Transaction(txParams);
      const txHash = "0x" + tx.hash(false).toString("hex");
      const signature = await connector.sign(txHash);
      tx.s = signature.s;
      tx.r = signature.r;
      tx.v = Buffer.from((signature.v + tx.getChainId() * 2 + 8).toString(16), "hex");
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

    this.makeRequest = async (method: string, params: any) => {
      return connector.send(createRequest(method, params));
    };
  }
}

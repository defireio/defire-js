import * as ethUtils from "ethereumjs-util";
import { stripHexPrefix, hasField } from "../utils/utils";
import {
  Address,
  Connector,
  Configuration,
  Account,
  MainAccountParam,
  MainAccountParamPrivateKey,
  MainAccountParamWeb3js,
  MainAccountParamEthersjs,
  MainAccountParamEthjs,
  MainAccountParamConnector,
  Provider,
} from "typings";
import {
  InvalidPrivateKeyError,
  InvalidAddress,
  InvalidConnector,
} from "../utils/errors";
import { PrivateKeyAccount } from "./apis/PrivateKeyAccount";
import { Web3jsAccount } from "./apis/Web3jsAccount";
import { EthersjsAccount } from "./apis/EthersjsAccount";
import { EthjsAccount } from "./apis/EthjsAccount";
import { ConnectorAccount } from "./apis/ConnectorAccount";

const loadAccountFromPrivateKey = (
  config: Configuration,
  privateKey: string,
  provider: Provider
): Account => {
  const pk = stripHexPrefix(privateKey);
  if (ethUtils.isValidPrivate(Buffer.from(pk, "hex"))) {
    return new PrivateKeyAccount(config, pk, provider);
  } else {
    throw new InvalidPrivateKeyError();
  }
};

const loadAccountFromWeb3js = (
  config: Configuration,
  web3js: any,
  address: Address
): Account => {
  if (ethUtils.isValidAddress(address)) {
    return new Web3jsAccount(
      config,
      web3js,
      ethUtils.toChecksumAddress(address)
    );
  } else {
    throw new InvalidAddress();
  }
};

const loadAccountFromEthersjs = (
  config: Configuration,
  ethersjs: any,
  address: Address
): Account => {
  if (ethUtils.isValidAddress(address)) {
    return new EthersjsAccount(
      config,
      ethersjs,
      ethUtils.toChecksumAddress(address)
    );
  } else {
    throw new InvalidAddress();
  }
};

const loadAccountFromEthjs = (
  config: Configuration,
  ethjs: any,
  address: Address
): Account => {
  if (ethUtils.isValidAddress(address)) {
    return new EthjsAccount(config, ethjs, ethUtils.toChecksumAddress(address));
  } else {
    throw new InvalidAddress();
  }
};

export const loadAccountFromConnector = (
  config: Configuration,
  connector: Connector,
  address: Address
): Account => {
  if (
    typeof connector.sign === "function" &&
    typeof connector.send === "function"
  ) {
    if (ethUtils.isValidAddress(address)) {
      return new ConnectorAccount(
        config,
        connector,
        ethUtils.toChecksumAddress(address)
      );
    } else {
      throw new InvalidAddress();
    }
  } else {
    throw new InvalidConnector();
  }
};

export const loadAccount = (
  config: Configuration,
  mainAccount: MainAccountParam
): Account => {
  if (hasField(mainAccount, "privateKey")) {
    return loadAccountFromPrivateKey(
      config,
      (mainAccount as MainAccountParamPrivateKey).privateKey,
      (mainAccount as MainAccountParamPrivateKey).provider
    );
  } else if (hasField(mainAccount, "web3js")) {
    return loadAccountFromWeb3js(
      config,
      (mainAccount as MainAccountParamWeb3js).web3js,
      (mainAccount as MainAccountParamWeb3js).address
    );
  }
  if (hasField(mainAccount, "ethersjs")) {
    return loadAccountFromEthersjs(
      config,
      (mainAccount as MainAccountParamEthersjs).ethersjs,
      (mainAccount as MainAccountParamEthersjs).address
    );
  } else if (hasField(mainAccount, "ethjs")) {
    return loadAccountFromEthjs(
      config,
      (mainAccount as MainAccountParamEthjs).ethjs,
      (mainAccount as MainAccountParamEthjs).address
    );
  } else if (hasField(mainAccount, "connector")) {
    return loadAccountFromConnector(
      config,
      (mainAccount as MainAccountParamConnector).connector,
      (mainAccount as MainAccountParamConnector).address
    );
  } else {
    throw new Error("Invalid intialization params");
  }
};

import { Configuration, MainAccountParam } from "typings";
import { loadConfig } from "./utils/config";
import { loadAccount } from "./account";
import { loadAssets } from "./utils/assets";
import { loadOperations } from "./operations";
import { Query } from "./query";
import { Actions } from "./actions";
import JSBI from "jsbi";

export function Defire(mainAccount: MainAccountParam, config?: Configuration) {
  const finalConfig: Configuration = loadConfig(config);
  const account = loadAccount(finalConfig, mainAccount);
  return {
    Assets: loadAssets(finalConfig),
    Operations: loadOperations(finalConfig, account),
    query: new Query(finalConfig, account),
    actions: new Actions(finalConfig, account),
    account: account,
    address: account.address,
    JSBI: JSBI,
  };
}

module.exports = Defire;

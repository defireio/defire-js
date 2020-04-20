import { Configuration } from "typings";
import { config as rinkebyConfig } from "../rinkeby-config";
import { InvalidRinkebyConfigurationError } from "./errors";

export const loadConfig = (config?: Configuration): Configuration => {
  if (!config) {
    throw new InvalidRinkebyConfigurationError();
  }
  if (config && config.network) {
    if (config.network == "rinkeby") {
      return Object.assign(rinkebyConfig, config);
    } else if (config.network == "development") {
      return config;
    }
  }
  throw new InvalidRinkebyConfigurationError();
};

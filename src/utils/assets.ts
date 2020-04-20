import { Configuration } from "typings";

export const loadAssets = (config: Configuration) => {
  return {
    ETH: config.contracts.ETH,
    DAI: config.contracts.DAI,
    CDAI: config.contracts.CDAI,
    WETH: config.contracts.WETH,
  };
};

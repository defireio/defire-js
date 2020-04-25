import { Configuration } from "typings";

export const loadAssets = (config: Configuration) => {
  return {
    ETH: config.contracts.ETH,
    DAI: config.contracts.DAI,
    USDC: config.contracts.USDC,
    WBTC: config.contracts.WBTC,
    CDAI: config.contracts.CDAI,
    CUSDC: config.contracts.CUSDC,
    CWBTC: config.contracts.CWBTC,
    CETH: config.contracts.CETH,
    WETH: config.contracts.WETH,
  };
};

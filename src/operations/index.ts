import { Configuration, Account } from "typings";
import { load as load_Compound_DAI_CDAI } from "./compound/Op_Compound_DAI_CDAI";
import { load as load_Compound_CDAI_DAI } from "./compound/Op_Compound_CDAI_DAI";
import { load as load_Compound_ETH_CETH } from "./compound/Op_Compound_ETH_CETH";
import { load as load_Compound_CETH_ETH } from "./compound/Op_Compound_CETH_ETH";
import { load as load_Compound_WBTC_CWBTC } from "./compound/Op_Compound_WBTC_CWBTC";
import { load as load_Compound_CWBTC_WBTC } from "./compound/Op_Compound_CWBTC_WBTC";
import { load as load_Compound_USDC_CUSDC } from "./compound/Op_Compound_USDC_CUSDC";
import { load as load_Compound_CUSDC_USDC } from "./compound/Op_Compound_CUSDC_USDC";
import { load as load_Uniswap_DAI_WETH } from "./uniswap/Op_Uniswap_DAI_WETH";
import { load as load_Uniswap_WETH_DAI } from "./uniswap/Op_Uniswap_WETH_DAI";
import { load as load_Uniswap_DAI_ETH } from "./uniswap/Op_Uniswap_DAI_ETH";
import { load as load_Uniswap_ETH_DAI } from "./uniswap/Op_Uniswap_ETH_DAI";
import { load as load_Op_Fund_Deposit } from "./defire/Op_Fund_Deposit";
import { load as load_Op_Fund_Withdraw } from "./defire/Op_Fund_Withdraw";
import { load as load_Op_Custom } from "./custom/Op_Custom";

export const loadOperations = (config: Configuration, account: Account) => {
  return {
    Compound: {
      Lend: {
        DAI: load_Compound_DAI_CDAI(config, account),
        ETH: load_Compound_ETH_CETH(config, account),
        WBTC: load_Compound_WBTC_CWBTC(config, account),
        USDC: load_Compound_USDC_CUSDC(config, account),
      },
      Redeem: {
        DAI: load_Compound_CDAI_DAI(config, account),
        ETH: load_Compound_CETH_ETH(config, account),
        WBTC: load_Compound_CWBTC_WBTC(config, account),
        USDC: load_Compound_CUSDC_USDC(config, account),
      },
    },
    Uniswap: {
      Trade: {
        DAI: {
          For: {
            ETH: load_Uniswap_DAI_ETH(config, account),
            WETH: load_Uniswap_DAI_WETH(config, account),
          },
        },
        ETH: {
          For: {
            DAI: load_Uniswap_ETH_DAI(config, account),
          },
        },
        WETH: {
          For: {
            DAI: load_Uniswap_WETH_DAI(config, account),
          },
        },
      },
    },
    Defire: {
      Fund: {
        Deposit: load_Op_Fund_Deposit(account),
        Withdraw: load_Op_Fund_Withdraw(account),
      },
    },
    Custom: load_Op_Custom(account),
  };
};

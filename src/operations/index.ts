import { Configuration, Account } from "typings";
import { load as load_Compound } from "./compound/Op_Compound";
import { load as load_Uniswap } from "./uniswap/Op_Uniswap";
import { load as load_Op_Wrap } from "./wrappers/Op_Wrap";
import { load as load_Op_Unwrap } from "./wrappers/Op_Unwrap";
import { load as load_Op_Fund_Deposit } from "./defire/Op_Fund_Deposit";
import { load as load_Op_Fund_Withdraw } from "./defire/Op_Fund_Withdraw";
import { load as load_Op_Custom } from "./custom/Op_Custom";

export const loadOperations = (config: Configuration, account: Account) => {
  return {
    Compound: {
      Lend: {
        DAI: load_Compound(config, account, "DAI", "CDAI"),
        ETH: load_Compound(config, account, "ETH", "CETH"),
        WBTC: load_Compound(config, account, "WBTC", "CWBTC"),
        USDC: load_Compound(config, account, "USDC", "CUSDC"),
      },
      Redeem: {
        DAI: load_Compound(config, account, "CDAI", "DAI"),
        ETH: load_Compound(config, account, "CETH", "ETH"),
        WBTC: load_Compound(config, account, "CWBTC", "WBTC"),
        USDC: load_Compound(config, account, "CUSDC", "USDC"),
      },
    },
    Uniswap: {
      Trade: {
        DAI: {
          For: {
            ETH: load_Uniswap(config, account, "DAI", "ETH"),
          },
        },
        USDC: {
          For: {
            ETH: load_Uniswap(config, account, "USDC", "ETH"),
          },
        },
        WBTC: {
          For: {
            ETH: load_Uniswap(config, account, "WBTC", "ETH"),
          },
        },
        ETH: {
          For: {
            DAI: load_Uniswap(config, account, "ETH", "DAI"),
            USDC: load_Uniswap(config, account, "ETH", "USDC"),
            WBTC: load_Uniswap(config, account, "ETH", "WBTC"),
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
    Wrappers: {
      Wrap: {
        ETH: load_Op_Wrap(config, account, "ETH"),
      },
      Unwrap: {
        ETH: load_Op_Unwrap(config, account, "ETH", "WETH"),
      },
    },
    Custom: load_Op_Custom(account),
  };
};

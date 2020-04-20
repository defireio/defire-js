import { Address, OperationParam } from "typings";
import { encodeFunctionCall, encodeFunctionCallWithABI } from "../utils/utils";

const executeOperationABI = {
  constant: false,
  inputs: [
    {
      components: [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
        {
          internalType: "uint256[]",
          name: "inAmounts",
          type: "uint256[]",
        },
        {
          components: [
            {
              internalType: "address",
              name: "asset",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isPercentage",
              type: "bool",
            },
            {
              internalType: "address payable",
              name: "to",
              type: "address",
            },
          ],
          internalType: "struct Operable.OutAmount[]",
          name: "outAmounts",
          type: "tuple[]",
        },
        {
          internalType: "bytes",
          name: "params",
          type: "bytes",
        },
      ],
      internalType: "struct Operable.Operation",
      name: "_operation",
      type: "tuple",
    },
  ],
  name: "executeOperation",
  outputs: [],
  payable: false,
  stateMutability: "nonpayable",
  type: "function",
};

const executeOperationsABI = {
  constant: false,
  inputs: [
    {
      components: [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
        {
          internalType: "uint256[]",
          name: "inAmounts",
          type: "uint256[]",
        },
        {
          components: [
            {
              internalType: "address",
              name: "asset",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isPercentage",
              type: "bool",
            },
            {
              internalType: "address payable",
              name: "to",
              type: "address",
            },
          ],
          internalType: "struct Operable.OutAmount[]",
          name: "outAmounts",
          type: "tuple[]",
        },
        {
          internalType: "bytes",
          name: "params",
          type: "bytes",
        },
      ],
      internalType: "struct Operable.Operation[]",
      name: "_operations",
      type: "tuple[]",
    },
  ],
  name: "executeOperations",
  outputs: [],
  payable: false,
  stateMutability: "nonpayable",
  type: "function",
};

export class Operable {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  isManager(manager: Address) {
    return encodeFunctionCall("isManager(address)", manager);
  }

  isMainManager(manager: Address) {
    return encodeFunctionCall("isMainManager(address)", manager);
  }

  addManager(manager: Address) {
    return encodeFunctionCall("addManager(address)", manager);
  }

  removeManager(manager: Address) {
    return encodeFunctionCall("removeManager(address)", manager);
  }

  hasAsset(asset: Address) {
    return encodeFunctionCall("hasAsset(address)", asset);
  }

  getAssets() {
    return encodeFunctionCall("getAssets()");
  }

  executeOperations(operations: OperationParam[]) {
    return encodeFunctionCallWithABI(executeOperationsABI, operations);
  }

  executeOperation(operation: OperationParam) {
    return encodeFunctionCallWithABI(executeOperationABI, operation);
  }
}

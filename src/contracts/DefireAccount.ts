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
    {
      internalType: "bool",
      name: "_checkSafe",
      type: "bool",
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
    {
      internalType: "bool",
      name: "_checkSafe",
      type: "bool",
    },
  ],
  name: "executeOperations",
  outputs: [],
  payable: false,
  stateMutability: "nonpayable",
  type: "function",
};

export class DefireAccount {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  executeOperations(operations: OperationParam[], checkSafe: boolean) {
    return encodeFunctionCallWithABI(
      executeOperationsABI,
      operations,
      checkSafe
    );
  }

  executeOperation(operation: OperationParam, checkSafe: boolean) {
    return encodeFunctionCallWithABI(executeOperationABI, operation, checkSafe);
  }
}

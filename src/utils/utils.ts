import { Address } from "typings";
import JSBI from "jsbi";
import ABICoder from "web3-eth-abi";
import { MissingField, InvalidFormat, InvalidAddress } from "./errors";
import * as ethUtils from "ethereumjs-util";

export const amountToString = (obj: number | string | JSBI): string => {
  if (typeof obj === "string") {
    return obj;
  } else if (typeof obj === "number") {
    return obj.toString();
  } else if (typeof obj === "object") {
    return obj.toString(10);
  } else {
    throw new Error("Invalid amount type.");
  }
};

export const stripHexPrefix = (str: string): string => {
  if (typeof str !== "string") {
    throw new Error("Invalid string.");
  }
  return isHexPrefixed(str) ? str.slice(2) : str;
};

export const isHexPrefixed = (str: string): boolean => {
  if (typeof str !== "string") {
    throw new Error("Invalid string.");
  }

  return str.slice(0, 2) === "0x";
};

export const validateAddress = (address: Address, error: Error): void => {
  if (!ethUtils.isValidAddress(address)) {
    throw error;
  }
};

export const validateArray = (
  array: Array<any>,
  minItems: number,
  error: Error
): void => {
  if (!Array.isArray(array) || array.length < minItems) {
    throw error;
  }
};

export const validateField = (
  obj: any,
  fieldName: string,
  error: Error
): void => {
  if (!obj.hasOwnProperty(fieldName)) {
    throw error;
  }
};

export const validateAmount = (item: any, error: Error): void => {
  if (
    typeof item !== "string" &&
    typeof item !== "number" &&
    typeof item !== "object"
  ) {
    throw error;
  }
};

export const validateObjectAmount = (obj: any, fieldName: string) => {
  validateField(obj, fieldName, new MissingField("Need to set " + fieldName));
  validateAmount(
    obj[fieldName],
    new InvalidFormat("Amount must be a number string or JSBI instance")
  );
};

export const validateObjectAddress = (obj: any, fieldName: string) => {
  validateField(obj, fieldName, new MissingField("Need to set " + fieldName));
  validateAddress(obj[fieldName], new InvalidAddress());
};

export const hasField = (obj: any, fieldName: string): boolean => {
  return obj.hasOwnProperty(fieldName);
};

export const encodeParameters = (
  typesArray: string[],
  params: any[]
): string => {
  if (typesArray.length > 1) {
    //@ts-ignore
    return ABICoder.encodeParameters(typesArray, params);
  } else if (typesArray.length === 1) {
    //@ts-ignore
    return ABICoder.encodeParameter(typesArray[0], params[0]);
  }
  throw new Error("Wrong params to encode");
};

export const encodeFunctionCall = (
  method: string,
  ...params: any[]
): string => {
  var regExp = /\(([^)]+)\)/;
  const paramsArray = regExp.exec(method);
  if (paramsArray == null) {
    //@ts-ignore
    return ABICoder.encodeFunctionSignature(method);
  } else {
    const typesArray: string[] = paramsArray![1].split(",");
    return (
      //@ts-ignore
      ABICoder.encodeFunctionSignature(method) +
      //@ts-ignore
      encodeParameters(typesArray, params).replace("0x", "")
    );
  }
};

export const encodeFunctionCallWithABI = (abi: any, ...params: any[]): any => {
  //@ts-ignore
  return ABICoder.encodeFunctionCall(abi, params);
};

export const decodeParameters = (
  typesArray: string[],
  hexString: string
): any => {
  if (typesArray.length > 1) {
    //@ts-ignore
    return ABICoder.decodeParameters(typesArray, hexString);
  } else if (typesArray.length === 1) {
    //@ts-ignore
    return ABICoder.decodeParameter(typesArray[0], hexString);
  }
  throw new Error("Wrong params to decode");
};

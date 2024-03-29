'use strict';
import { NextFunction, Request, Response } from "express";

/* jshint latedef: nofunc */
/* NOTE: this is because of the recursive nature of the functions here
    we must be able to call parseObject from inside parseValue,
    if the value is an object
*/

/**
 * Convert string to boolean.
 * @param  {String}  string  - String to convert
 * @return {?}  Returns the results of the conversion.
*/
function parseBoolFromString(string: string) {
  if (string === 'true') {
    return true;
  }
  else if (string === 'false') {
    return false;
  }
  else {
    return string;
  }
}

/**
 * Recursively test values for conversion.
 * @param  {?}  value  - String to convert
 * @return {?}  Returns the results of the conversion.
*/
function parseValue(value: string | object) {
  if (typeof value === 'string') {
    return parseBoolFromString(value);
  }
  else if (value.constructor === Object) {
    return parseObject(value);
  }
  else if (Array.isArray(value)) {
    var array: any = [];
    value.forEach(function(item, itemKey) {
      array[itemKey] = parseValue(item);
    });
    return array;
  }
  else {
    return value;
  }
}

/**
 * Recursively convert object strings to boolean.
 * @param  {Object}  obj  - Object to iterate over
 * @return {Object}  Returns new object (shallow copy).
*/
function parseObject(obj: any) {
  var result: any = {},
      key,
      value;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      value = obj[key];
      result[key] = parseValue(value);
    }
  }

  return result;
}

export default function(req: Request, _res: Response, next: NextFunction) {
    req.query = parseObject(req.query);
    next();
};
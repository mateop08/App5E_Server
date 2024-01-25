import { NextFunction, Request, Response } from "express";

/**
 * Trim string.
 * @param  {String}  string  - String to convert
 * @return {?}  Returns the results of the conversion.
*/

function trimString(string: string) {
    return string.trim()
  }
  
  /**
   * Recursively test values for conversion.
   * @param  {?}  value  - String to convert
   * @return {?}  Returns the results of the conversion.
  */
  function parseValue(value: string | object) {
    if (value === undefined) {
      return undefined
    }
    if (value === null) {
      return null
    }
    if (typeof value === 'string') {
      return trimString(value);
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



export const trimResponses = (_request: Request, response: Response, next: NextFunction) => {

    try {
      const oldJSON = response.json;
      response.json = (data) => {
          //console.log(data)
          const parseData = parseValue(data)
          response.json = oldJSON;
          return response.json(parseData)
      }
      next()
    } catch (error) {
      console.log(error)
      next(error);
    }
}

export default trimResponses
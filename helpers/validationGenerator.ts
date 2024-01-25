import { checkExact } from "express-validator";
import validateResult from "../helpers/validateHelper";
import { NextFunction } from "express";
import { Request, Response } from "express";
import { Middleware } from "express-validator/src/base";

export interface validation {
    field: string
    validation: Middleware
}

const validationEnd = [

    checkExact([],{ message: 'Se ha enviado un parametro inválido.' }),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next)
    }
]

const validationGenerator= (fields: string[], validations: validation[]) => {
    var validationList: any[] = []
    validations.map((val) => {
        if (fields.includes(val.field)) {
            validationList.push(val.validation)
        }
    })
    
    validationList = validationList.concat(validationEnd)
    return validationList
}

export default validationGenerator

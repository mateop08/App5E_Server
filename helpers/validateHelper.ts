import { NextFunction } from "express";
import { validationResult } from "express-validator";
import { Request, Response } from "express";

const validateResult = (req: Request, res: Response, next: NextFunction) => {
    
    const result = validationResult(req)
    if (!result.isEmpty()) {
        res.status(403).send({errors: result.array()})
    } else {
        return next()
    }
    
}

export default validateResult
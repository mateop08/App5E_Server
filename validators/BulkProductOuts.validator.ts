import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type BulkProductOutsFields = 'OutId' | 'ProductCode' | 'OpeningId' | 'InitialNumber' | 'FinalNumber' | 'Amount' | 'WithDigitalDispenser' | 
    'ForServiceOrder' | 'OrderProductId' | 'User'

const validations: validation[] = [
    {
        field: 'ProductCode',
        validation: 
        check('ProductCode').exists().withMessage('No se especificó el parametro "ProductCode" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (ProductCode) no puede ir vacío en la petición.')
            .isLength({min: 1, max:20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    },
    {
        field: 'OutId',
        validation:
        check('OutId')
            .exists().withMessage('No se especificó el parametro (OutId) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (OutId) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (OutId) debe ser de tipo número.')
    },
    {
        field: 'OpeningId',
        validation:
        check('OpeningId')
            .exists().withMessage('No se especificó el parametro (OpeningId) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (OpeningId) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (OpeningId) debe ser de tipo número.')
    },
    {
        field: 'InitialNumber',
        validation:
        check('InitialNumber')
            .exists({checkNull: false}).withMessage('No se especificó el parametro (InitialNumber) en la petición.')
            .not()
            .isString().withMessage('El parametro (InitialNumber) no puede ser de tipo string en la petición.')
            .isNumeric().withMessage('El parametro (InitialNumber) debe ser de tipo número en la petición.')
            .optional({values: 'null'})
    },
    {
        field: 'FinalNumber',
        validation:
        check('FinalNumber')
            .exists({checkNull: false}).withMessage('No se especificó el parametro (FinalNumber) en la petición.')
            .not()
            .isString().withMessage('El parametro (FinalNumber) no puede ser de tipo string en la petición.')
            .isNumeric().withMessage('El parametro (FinalNumber) no puede ser de tipo número en la petición.')
            .optional({values: 'null'})
    },
    {
        field: 'Amount',
        validation:
        check('Amount')
            .exists().withMessage('No se especificó el parametro (Amount) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Amount) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (Amount) debe ser de tipo número.')
    },
    {
        field: 'WithDigitalDispenser',
        validation:
        check('WithDigitalDispenser')
            .exists().withMessage('No se especificó el parametro (WithDigitalDispenser) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (WithDigitalDispenser) no puede ir vacío en la petición.')
            .isBoolean()
            .not()
            .isString().withMessage('El parametro (WithDigitalDispenser) no puede ser de tipo string en la petición.')
            .not()
            .isNumeric().withMessage('El parametro (WithDigitalDispenser) no puede ser de tipo número en la petición.')
    },
    {
        field: 'ForServiceOrder',
        validation:
        check('ForServiceOrder')
            .exists().withMessage('No se especificó el parametro (ForServiceOrder) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (ForServiceOrder) no puede ir vacío en la petición.')
            .isBoolean()
            .not()
            .isString().withMessage('El parametro (ForServiceOrder) no puede ser de tipo string en la petición.')
            .not()
            .isNumeric().withMessage('El parametro (ForServiceOrder) no puede ser de tipo número en la petición.')
    },
    {
        field: 'OrderProductId',
        validation:
        check('OrderProductId')
            .exists({checkNull: false}).withMessage('No se especificó el parametro (OrderProductId) en la petición.')
            .isNumeric().withMessage('El parametro (OrderProductId) debe ser de tipo número en la petición.')
            .optional({values: 'null'})
    },
    {
        field: 'User',
        validation:
        check('User')
            .exists().withMessage('No se especificó el parametro (User) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (User) no puede ir vacío en la petición.')
            .isLength({min:1, max: 20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    }
]
 


const generateValidationToBulkProductOut = (fields: BulkProductOutsFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToBulkProductOut
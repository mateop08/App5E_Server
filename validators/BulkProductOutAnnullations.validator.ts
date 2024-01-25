import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type BulkProductOutAnnullationsFields = 'OutId' | 'ProductCode' | 'AnnullationId' | 'Amount' | 'User' | 'AnnulledReason'

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
        field: 'Amount',
        validation:
        check('Amount')
            .exists().withMessage('No se especificó el parametro (Amount) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Amount) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (Amount) debe ser de tipo número.')
    },
    {
        field: 'AnnullationId',
        validation:
        check('AnnullationId')
            .exists().withMessage('No se especificó el parametro (AnnullationId) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (AnnullationId) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (AnnullationId) debe ser de tipo número.')
    },
    {
        field: 'User',
        validation:
        check('User')
            .exists().withMessage('No se especificó el parametro (User) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (User) no puede ir vacío en la petición.')
            .isLength({min:1, max: 20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    },
    {
        field: 'AnnulledReason',
        validation:
        check('AnnulledReason').exists().withMessage('No se especificó el parametro "AnnulledReason" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (AnnulledReason) no puede ir vacío en la petición.')
            .isLength({min: 1, max:250}).withMessage('El tamaño del string debe ser de 1 a 250 caracteres.')
    }
]
 


const generateValidationToBulkProductOutAnnullation = (fields: BulkProductOutAnnullationsFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToBulkProductOutAnnullation
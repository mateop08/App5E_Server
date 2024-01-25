import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type BulkProductOpeningsFields = 'ProductCode' | 'OpeningId' | 'LeftOverAmount' | 'User'

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
        field: 'OpeningId',
        validation:
        check('OpeningId')
            .exists().withMessage('No se especificó el parametro (OpeningId) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (OpeningId) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (OpeningId) debe ser de tipo número.')
    },
    {
        field: 'LeftOverAmount',
        validation:
        check('LeftOverAmount')
            .exists().withMessage('No se especificó el parametro (LeftOverAmount) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (LeftOverAmount) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (LeftOverAmount) debe ser de tipo número.')
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
 


const generateValidationToBulkProductOpening = (fields: BulkProductOpeningsFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToBulkProductOpening
import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type AnotationTypesFields = 'Code' | 'Description' | 'Consecutive' | 'PriceCode' | 'Store' | 'InventoryType' | 'ServicesLine'

const validations: validation[] = [
    {
        field: 'Code',
        validation: 
        check('Code').exists().withMessage('No se especificó el parametro "Code" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Code) no puede ir vacío en la petición.')
            .isLength({min: 1, max:5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'Description',
        validation:
        check('Description')
            .exists().withMessage('No se especificó el parametro (Description) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Description) no puede ir vacío en la petición.')
            .isLength({min:1, max: 100}).withMessage('El tamaño del string debe ser de 1 a 100 caracteres.')
    },
    {
        field: 'Consecutive',
        validation:
        check('Consecutive')
            .exists().withMessage('No se especificó el parametro (Consecutive) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Consecutive) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (Consecutive) debe ser un número.')

    },
    {
        field: 'Store',
        validation:
        check('Store')
            .exists().withMessage('No se especificó el parametro (Store) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Store) no puede ir vacío en la petición.')
            .isLength({min:1, max: 20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    },
    {
        field: 'PriceCode',
        validation:
        check('PriceCode')
            .exists().withMessage('No se especificó el parametro (PriceCode) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (PriceCode) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'InventoryType',
        validation:
        check('InventoryType')
            .exists().withMessage('No se especificó el parametro (InventoryType) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (InventoryType) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'ServicesLine',
        validation:
        check('ServicesLine')
            .exists().withMessage('No se especificó el parametro (ServicesLine) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (ServicesLine) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    }
]
 


const generateValidationToAppDocument = (fields: AnotationTypesFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToAppDocument
import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type OrderProductsFields = 'OrderDocument' | 'OrderNumber' | 'Code' | 'Amount' | 'User' | 'Id'

const validations: validation[] = [
    {
        field: 'OrderDocument',
        validation: 
        check('OrderDocument').exists().withMessage('No se especificó el parametro "OrderDocument" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (OrderDocument) no puede ir vacío en la petición.')
            .isLength({min: 1, max:5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'OrderNumber',
        validation: 
        check('OrderNumber').exists().withMessage('No se especificó el parametro "OrderNumber" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (OrderNumber) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (OrderNumber) debe ser de tipo número.')
    },
    {
        field: 'Code',
        validation:
        check('Code')
            .exists().withMessage('No se especificó el parametro (Code) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Code) no puede ir vacío en la petición.')
            .isLength({min:1, max: 20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    },
    {
        field: 'Amount',
        validation: 
        check('Amount').exists().withMessage('No se especificó el parametro "Amount" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Amount) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (Amount) debe ser de tipo número.')
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
        field: 'Id',
        validation: 
        check('Id').exists().withMessage('No se especificó el parametro "Id" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Id) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (Id) debe ser de tipo número.')
    }
]
 


const generateValidationToOrderProduct = (fields: OrderProductsFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToOrderProduct
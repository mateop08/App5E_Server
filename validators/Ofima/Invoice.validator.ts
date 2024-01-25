import { check } from "express-validator";
import validationGenerator from "../../helpers/validationGenerator";
import { validation } from "../../helpers/validationGenerator"
type InvoicesFields = 'OrderDocument' | 'OrderNumber' | 'ConsecutiveCode' | 'CustomerId' |
    'Store' | 'CashRegisterCode' | 'CostCenterCode' | 'Seller' | 'User' | 
    'PaymentMethodsList' 
    | 'PaymentMethodsList.PaymentMethod'
    | 'PaymentMethodsList.PaymentMethod.Code' 
    | 'PaymentMethodsList.PaymentMethod.Description' 
    | 'PaymentMethodsList.PaymentMethod.Account' 
    | 'PaymentMethodsList.PaymentMethod.Concept' 
    | 'PaymentMethodsList.Value' 
    | 'PaymentMethodsList.Note'

const validations: validation[] = [
    {
        field: 'OrderDocument',
        validation:
        check('OrderDocument')
            .exists().withMessage('No se especificó el parametro (OrderDocument) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (OrderDocument) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'OrderNumber',
        validation:
        check('OrderNumber')
            .exists().withMessage('No se especificó el parametro (OrderNumber) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (OrderNumber) no puede ir vacío en la petición.')
            .isNumeric()
    },
    {
        field: 'ConsecutiveCode',
        validation:
        check('ConsecutiveCode')
            .exists().withMessage('No se especificó el parametro (ConsecutiveCode) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (ConsecutiveCode) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 2 caracteres.')
    },
    {
        field: 'CustomerId',
        validation:
        check('CustomerId')
            .exists().withMessage('No se especificó el parametro (CustomerId) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (CustomerId) no puede ir vacío en la petición.')
            .isLength({min:1, max: 15}).withMessage('El tamaño del string debe ser de 1 a 15 caracteres.')
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
        field: 'CashRegisterCode',
        validation:
        check('CashRegisterCode')
            .exists().withMessage('No se especificó el parametro (CashRegisterCode) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (CashRegisterCode) no puede ir vacío en la petición.')
            .isLength({min:1, max: 10}).withMessage('El tamaño del string debe ser de 1 a 10 caracteres.')
    },
    {
        field: 'CostCenterCode',
        validation:
        check('CostCenterCode')
            .exists().withMessage('No se especificó el parametro (CostCenterCode) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (CostCenterCode) no puede ir vacío en la petición.')
            .isLength({min:1, max: 10}).withMessage('El tamaño del string debe ser de 1 a 10 caracteres.')
    },
    {
        field: 'Seller',
        validation:
        check('Seller')
            .exists().withMessage('No se especificó el parametro (Seller) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Seller) no puede ir vacío en la petición.')
            .isLength({min:1, max: 15}).withMessage('El tamaño del string debe ser de 1 a 15 caracteres.')
    },
    {
        field: 'User',
        validation: 
        check('User').exists().withMessage('No se especificó el parametro "User" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (User) no puede ir vacío en la petición.')
            .isLength({min: 1, max:20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    },
    {
        field: 'PaymentMethodsList',
        validation:
        check('PaymentMethodsList')
            .exists().withMessage('No se especificó el parametro (PaymentMethodsList) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (PaymentMethodsList) no puede ir vacío en la petición.')
            .isArray().withMessage('El parametro (PaymentMethodsList) debe ser una lista.')
    },
    {
        field: 'PaymentMethodsList.PaymentMethod',
        validation:
        check('PaymentMethodsList.*.PaymentMethod')
            .exists().withMessage('No se especificó el parametro (PaymentMethod), dentro del array de PaymentMethodsList en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (PaymentMethod) no puede ir vacío en la petición.')
            .isObject().withMessage('El parametro (PaymentMethod) debe ser un objeto.')
    },
    {
        field: 'PaymentMethodsList.PaymentMethod.Code',
        validation:
        check('PaymentMethodsList.*.PaymentMethod.Code')
            .exists().withMessage('No se especificó el parametro (Code), dentro del objeto PaymentMethod, dentro del array de PaymentMethodsList en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Code) no puede ir vacío en la petición.')
            .isLength({min: 1, max:5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'PaymentMethodsList.PaymentMethod.Description',
        validation:
        check('PaymentMethodsList.*.PaymentMethod.Description')
            .exists().withMessage('No se especificó el parametro (Description), dentro del objeto PaymentMethod, dentro del objeto PaymentMethod, dentro del array de PaymentMethodsList en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Description) no puede ir vacío en la petición.')
            .isLength({min: 1, max:60}).withMessage('El tamaño del string debe ser de 1 a 60 caracteres.')
    },
    {
        field: 'PaymentMethodsList.PaymentMethod.Account',
        validation:
        check('PaymentMethodsList.*.PaymentMethod.Account')
            .exists().withMessage('No se especificó el parametro (Account) dentro del objeto PaymentMethod, dentro del objeto PaymentMethod, dentro del array de PaymentMethodsList en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Account) no puede ir vacío en la petición.')
            .isLength({min: 1, max:20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    },
    {
        field: 'PaymentMethodsList.PaymentMethod.Concept',
        validation:
        check('PaymentMethodsList.*.PaymentMethod.Concept')
            .exists().withMessage('No se especificó el parametro (Concept) dentro del objeto PaymentMethod, dentro del objeto PaymentMethod, dentro del array de PaymentMethodsList en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Concept) no puede ir vacío en la petición.')
            .isLength({min: 1, max:5}).withMessage('El tamaño del string debe ser de 1 a 2 caracteres.')
    },
    {
        field: 'PaymentMethodsList.Value',
        validation:
        check('PaymentMethodsList.*.Value')
            .exists().withMessage('No se especificó el parametro (Value) dentro del array de PaymentMethodsList en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Value) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (Value) debe ser de tipo número.')
    },
    {
        field: 'PaymentMethodsList.Note',
        validation:
        check('PaymentMethodsList.*.Note')
            .exists().withMessage('No se especificó el parametro (Note) dentro del objeto PaymentMethod, dentro del array de PaymentMethodsList en la petición.')
            .not()
            //.isLength({min: 0, max:250}).withMessage('El tamaño del string debe ser de 1 a 250 caracteres.')
    }
]
 


const generateValidationToInvoice = (fields: InvoicesFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToInvoice
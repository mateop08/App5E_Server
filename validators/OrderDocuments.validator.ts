import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
import { getMulterParserValidation } from "../helpers/multerParserValidation";

type OrderDocumentsFields = 'OrderDocument' | 'OrderNumber' | 'DocumentCode' | 'User' | 'Id' | 'File'

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
        field: 'DocumentCode',
        validation:
        check('DocumentCode')
            .exists().withMessage('No se especificó el parametro (DocumentCode) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (DocumentCode) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
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
    },
    {
        field: 'File',
        validation: 
        check('File').exists().withMessage('No se especificó el parametro "File" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (File) no puede ir vacío en la petición.')
    }
]

export const generateFormDataMulterToOrderDocument = (fields: OrderDocumentsFields[]) => {

    return getMulterParserValidation(fields)
}

const generateValidationToOrderDocument = (fields: OrderDocumentsFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToOrderDocument
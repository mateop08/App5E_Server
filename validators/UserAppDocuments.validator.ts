import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type VehiclesFields = 'UserCode' | 'DocumentCode' | 'AppDocumentsList' | 'AppDocumentsList.AppDocumentCode'

const validations: validation[] = [
    {
        field: 'UserCode',
        validation:
        check('UserCode')
            .exists().withMessage('No se especificó el parametro (UserCode) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (UserCode) no puede ir vacío en la petición.')
            .isLength({min:1, max: 20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
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
        field: 'AppDocumentsList',
        validation:
        check('AppDocumentsList')
            .exists().withMessage('No se especificó el parametro (AppDocumentsList) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (AppDocumentsList) no puede ir vacío en la petición.')
            .isArray().withMessage('El parametro (AppDocumentsList) debe ser una lista.')
    },
    {
        field: 'AppDocumentsList.AppDocumentCode',
        validation:
        check('AppDocumentsList.*.AppDocumentCode')
            .exists().withMessage('No se especificó el parametro (AppDocumentCode) dentro del array de AppDocumentsList en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (AppDocumentCode) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    }
]
 


const generateValidationToVehicle = (fields: VehiclesFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToVehicle
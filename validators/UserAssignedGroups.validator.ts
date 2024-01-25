import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type VehiclesFields = 'UserCode' | 'GroupCode' | 'GroupsList' | 'GroupsList.GroupCode'

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
        field: 'GroupCode',
        validation:
        check('GroupCode')
            .exists().withMessage('No se especificó el parametro (GroupCode) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (GroupCode) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'GroupsList',
        validation:
        check('GroupsList')
            .exists().withMessage('No se especificó el parametro (GroupsList) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (GroupsList) no puede ir vacío en la petición.')
            .isArray().withMessage('El parametro (GroupsList) debe ser una lista.')
    },
    {
        field: 'GroupsList.GroupCode',
        validation:
        check('GroupsList.*.GroupCode')
            .exists().withMessage('No se especificó el parametro (GroupCode) dentro del array de GroupsList en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (GroupCode) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    }
]
 


const generateValidationToVehicle = (fields: VehiclesFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToVehicle
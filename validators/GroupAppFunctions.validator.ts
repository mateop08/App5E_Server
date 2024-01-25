import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator" 
type GroupAppFunctionFields = 'AppFunctionCode' | 'GroupCode' | 'AppFunctionList' |'AppFunctionList.AppFunctionCode'

const validations: validation[] = [
    {
        field: 'AppFunctionCode',
        validation:
        check('AppFunctionCode')
            .exists().withMessage('No se especificó el parametro (AppFunctionCode) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (AppFunctionCode) no puede ir vacío en la petición.')
            .isLength({min:1, max: 70}).withMessage('El tamaño del string debe ser de 1 a 70 caracteres.')
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
        field: 'AppFunctionList',
        validation:
        check('AppFunctionList')
            .exists().withMessage('No se especificó el parametro (AppFunctionList) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (AppFunctionList) no puede ir vacío en la petición.')
            .isArray().withMessage('El parametro (AppFunctionList) debe ser una lista.')
    },
    {
        field: 'AppFunctionList.AppFunctionCode',
        validation:
        check('AppFunctionList.*.AppFunctionCode')
            .exists().withMessage('No se especificó el parametro (AppFunctionCode) dentro del array de AppFunctionList en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (AppFunctionCode) no puede ir vacío en la petición.')
            .isLength({min:1, max: 70}).withMessage('El tamaño del string debe ser de 1 a 70 caracteres.')
    }
]
 


const generateValidationToVehicle = (fields: GroupAppFunctionFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToVehicle
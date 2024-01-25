import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type AppFunctionsFields = 'Code' | 'Description' | 'Method' | 'Route' | 'RequiresAuth'

const validations: validation[] = [
    {
        field: 'Code',
        validation: 
        check('Code').exists().withMessage('No se especificó el parametro "Code" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Code) no puede ir vacío en la petición.')
            .isLength({min: 1, max:70}).withMessage('El tamaño del string debe ser de 1 a 70 caracteres.')
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
        field: 'Method',
        validation:
        check('Method')
            .exists().withMessage('No se especificó el parametro (Method) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Method) no puede ir vacío en la petición.')
            .isLength({min:1, max: 10}).withMessage('El tamaño del string debe ser de 1 a 10 caracteres.')
            .isIn(['GET','POST','PUT','DELETE'])
    },
    {
        field: 'Route',
        validation:
        check('Route')
            .exists().withMessage('No se especificó el parametro (Route) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Route) no puede ir vacío en la petición.')
            .isLength({min:1, max: 100}).withMessage('El tamaño del string debe ser de 1 a 100 caracteres.')
    },
    {
        field: 'RequiresAuth',
        validation:
        check('RequiresAuth')
            .exists().withMessage('No se especificó el parametro (RequiresAuth) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (RequiresAuth) no puede ir vacío en la petición.')
            .isBoolean().withMessage('El parametro (RequiresAuth) debe de ser de tipo boolean')
    }
]
 


const generateValidationToAppFunction = (fields: AppFunctionsFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToAppFunction
import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type UsersFields = 'UserCode' | 'Name' | 'Password'

const validations: validation[] = [
    {
        field: 'UserCode',
        validation: 
        check('UserCode').exists().withMessage('No se especificó el parametro (UserCode) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (UserCode) no puede ir vacío en la petición.')
            .isLength({min: 1, max:20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    },
    {
        field: 'Name',
        validation:
        check('Name')
            .exists().withMessage('No se especificó el parametro (Name) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Name) no puede ir vacío en la petición.')
            .isLength({min:1, max: 100}).withMessage('El tamaño del string debe ser de 1 a 100 caracteres.')
    },
    {
        field: 'Password',
        validation:
        check('Password')
            .exists().withMessage('No se especificó el parametro (Password) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Password) no puede ir vacío en la petición.')
            .isLength({min:1, max: 20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    }
]
 


const generateValidationToUser = (fields: UsersFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToUser
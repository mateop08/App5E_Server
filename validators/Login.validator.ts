import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type LoginFields = 'User' | 'Password'

const validations: validation[] = [
    {
        field: 'User',
        validation: 
        check('User').exists().withMessage('No se especificó el parametro "User" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (User) no puede ir vacío en la petición.')
            .isLength({min: 1, max:20}).withMessage('El tamaño del parametro (User) debe ser de 1 a 20 caracteres.')
    },
    {
        field: 'Password',
        validation:
        check('Password')
            .exists().withMessage('No se especificó el parametro (Password) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Password) no puede ir vacío en la petición.')
            .isLength({min:1, max: 20}).withMessage('El tamaño del parametro (Password) debe ser de 1 a 20 caracteres.')
    }
]
 


const generateValidationToLogin = (fields: LoginFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToLogin
import { check } from "express-validator";
import validationGenerator from "../../helpers/validationGenerator";
import { validation } from "../../helpers/validationGenerator"
type CostCentersFields = 'User'

const validations: validation[] = [
    {
        field: 'User',
        validation: 
        check('User').exists().withMessage('No se especificó el parametro "User" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (User) no puede ir vacío en la petición.')
            .isLength({min: 1, max:20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    }
]
 


const generateValidationToCostCenter = (fields: CostCentersFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToCostCenter
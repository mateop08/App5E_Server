import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type AnotationTypesFields = 'Code' | 'Description'

const validations: validation[] = [
    {
        field: 'Code',
        validation: 
        check('Code').exists().withMessage('No se especificó el parametro "Code" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Code) no puede ir vacío en la petición.')
            .isLength({min: 1, max:5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'Description',
        validation:
        check('Description')
            .exists().withMessage('No se especificó el parametro (Description) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Description) no puede ir vacío en la petición.')
            .isLength({min:1, max: 100}).withMessage('El tamaño del string debe ser de 1 a 100 caracteres.')
    }
]
 


const generateValidationToAnnotationType = (fields: AnotationTypesFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToAnnotationType
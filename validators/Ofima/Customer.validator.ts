import { check } from "express-validator";
import validationGenerator from "../../helpers/validationGenerator";
import { validation } from "../../helpers/validationGenerator"
type CustomersFields = 'FullName' | 'Identification' | 'SearchText'

const validations: validation[] = [
    {
        field: 'FullName',
        validation: 
        check('FullName').exists().withMessage('No se especificó el parametro "FullName" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (FullName) no puede ir vacío en la petición.')
            .isLength({min: 1, max:250}).withMessage('El tamaño del string debe ser de 1 a 250 caracteres.')
    },
    {
        field: 'Identification',
        validation: 
        check('Identification').exists().withMessage('No se especificó el parametro "Identification" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Identification) no puede ir vacío en la petición.')
            .isLength({min: 1, max:15}).withMessage('El tamaño del string debe ser de 1 a 15 caracteres.')
    },
    {
        field: 'SearchText',
        validation: 
        check('SearchText').exists().withMessage('No se especificó el parametro "SearchText" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (SearchText) no puede ir vacío en la petición.')
            .isLength({min: 1, max:250}).withMessage('El tamaño del string debe ser de 1 a 15 caracteres.')
    }
]
 


const generateValidationToCustomer = (fields: CustomersFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToCustomer
import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type AnotationTypesFields = 'Identification' | 'FullName' | 'ContactNumber' | 'Email' | 'Address'

const validations: validation[] = [
    {
        field: 'Identification',
        validation: 
        check('Identification').exists().withMessage('No se especificó el parametro "Identification" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Identification) no puede ir vacío en la petición.')
            .isLength({min: 1, max:20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    },
    {
        field: 'FullName',
        validation:
        check('FullName')
            .exists().withMessage('No se especificó el parametro (FullName) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (FullName) no puede ir vacío en la petición.')
            .isLength({min:1, max: 250}).withMessage('El tamaño del string debe ser de 1 a 250 caracteres.')
    },
    {
        field: 'ContactNumber',
        validation:
        check('ContactNumber')
            .exists().withMessage('No se especificó el parametro (ContactNumber) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (ContactNumber) no puede ir vacío en la petición.')
            .isLength({min:1, max: 250}).withMessage('El tamaño del string debe ser de 1 a 250 caracteres.')

    },
    {
        field: 'Email',
        validation:
        check('Email')
            .exists().withMessage('No se especificó el parametro (Email) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Email) no puede ir vacío en la petición.')
            .isLength({min:1, max: 250}).withMessage('El tamaño del string debe ser de 1 a 250 caracteres.')

    },
    {
        field: 'Address',
        validation:
        check('Address')
            .exists().withMessage('No se especificó el parametro (Address) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Address) no puede ir vacío en la petición.')
            .isLength({min:1, max: 250}).withMessage('El tamaño del string debe ser de 1 a 250 caracteres.')

    }
]
 


const generateValidationToContact = (fields: AnotationTypesFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToContact
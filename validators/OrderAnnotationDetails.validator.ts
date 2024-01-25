import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"

type OrderAnnotationDetailsFields = 'OrderDocument' | 'OrderNumber' | 'EvidenceId' | 'AnnotationId' 
    | 'Note' | 'User' | 'File'

const validations: validation[] = [
    {
        field: 'OrderDocument',
        validation: 
        check('OrderDocument').exists().withMessage('No se especificó el parametro "OrderDocument" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (OrderDocument) no puede ir vacío en la petición.')
            .isLength({min: 1, max:5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'OrderNumber',
        validation: 
        check('OrderNumber').exists().withMessage('No se especificó el parametro "OrderNumber" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (OrderNumber) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (OrderNumber) debe ser de tipo número.')
    },
    {
        field: 'EvidenceId',
        validation: 
        check('EvidenceId').exists().withMessage('No se especificó el parametro "EvidenceId" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (EvidenceId) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (EvidenceId) debe ser de tipo número.')
    },
    {
        field: 'AnnotationId',
        validation: 
        check('AnnotationId').exists().withMessage('No se especificó el parametro "AnnotationId" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (AnnotationId) no puede ir vacío en la petición.')
            .isNumeric().withMessage('El parametro (AnnotationId) debe ser de tipo número.')
    },
    {
        field: 'Note',
        validation: 
        check('Note').exists().withMessage('No se especificó el parametro "Note" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Note) no puede ir vacío en la petición.')
            .isLength({min:1, max: 250}).withMessage('El tamaño del string debe ser de 1 a 250 caracteres.')
    },
    {
        field: 'User',
        validation:
        check('User')
            .exists().withMessage('No se especificó el parametro (User) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (User) no puede ir vacío en la petición.')
            .isLength({min:1, max: 20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    },
    {
        field: 'File',
        validation: 
        check('File').exists().withMessage('No se especificó el parametro "File" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (File) no puede ir vacío en la petición.')
    }
]


const generateValidationToOrderAnnotationDetail = (fields: OrderAnnotationDetailsFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToOrderAnnotationDetail
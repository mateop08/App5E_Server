import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type OrdersFields = 'Plate' | 'Mileage' | 'Quote' | 'Diagnosis' | 
'Warranty' | 'Lubrication' | 'Mechanics' | 'Powertrain' | 'User' | 'ContactId' |
'State' | 'OrderDocument' | 'OrderNumber' | 'CardNumber' | "Open" | 'AnnulledReason' | 'ReceptionNote' |
'PlateSearch' | 'InitialDate' | 'FinalDate' | 'OpenSearch' | 'StateSearch'

const validations: validation[] = [
    {
        field: 'Plate',
        validation: 
        check('Plate').exists().withMessage('No se especificó el parametro "Plate" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Plate) no puede ir vacío en la petición.')
            .isLength({min: 6, max:6}).withMessage('El tamaño del string debe ser de exactamente 6 caracteres.')
            .matches(/[A-Z]{3}[0-9]{3}/).withMessage('Ingrese una placa válida')
    },
    {
        field: 'PlateSearch',
        validation: 
        check('PlateSearch').exists().withMessage('No se especificó el parametro "Plate" en la petición.')
            .isString().withMessage('El parametro (PlateSearch) debe ser de tipo string.')
    },
    {
        field: 'Mileage',
        validation: 
        check('Mileage').exists().withMessage('No se especificó el parametro "Mileage" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Mileage) no puede ir vacío en la petición.')
            .isNumeric()
            .not()
            .isString().withMessage('El parametro (Mileage) no puede ser de tipo string en la petición.')
    },
    {
        field: 'Quote',
        validation: 
        check('Quote').exists().withMessage('No se especificó el parametro "Quote" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Quote) no puede ir vacío en la petición.')
            .isBoolean()
            .not()
            .isString().withMessage('El parametro (Quote) no puede ser de tipo string en la petición.')
            .not()
            .isNumeric().withMessage('El parametro (Quote) no puede ser de tipo número en la petición.')
    },
    {
        field: 'Diagnosis',
        validation: 
        check('Diagnosis').exists().withMessage('No se especificó el parametro "Diagnosis" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Diagnosis) no puede ir vacío en la petición.')
            .isBoolean()
            .not()
            .isString().withMessage('El parametro (Diagnosis) no puede ser de tipo string en la petición.')
            .not()
            .isNumeric().withMessage('El parametro (Diagnosis) no puede ser de tipo número en la petición.')
    },
    {
        field: 'Warranty',
        validation: 
        check('Warranty').exists().withMessage('No se especificó el parametro "Warranty" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Warranty) no puede ir vacío en la petición.')
            .isBoolean()
            .not()
            .isString().withMessage('El parametro (Warranty) no puede ser de tipo string en la petición.')
            .not()
            .isNumeric().withMessage('El parametro (Warranty) no puede ser de tipo número en la petición.')
    },
    {
        field: 'Lubrication',
        validation: 
        check('Lubrication').exists().withMessage('No se especificó el parametro "Lubrication" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Lubrication) no puede ir vacío en la petición.')
            .isBoolean()
            .not()
            .isString().withMessage('El parametro (Lubrication) no puede ser de tipo string en la petición.')
            .not()
            .isNumeric().withMessage('El parametro (Lubrication) no puede ser de tipo número en la petición.')
    },
    {
        field: 'Mechanics',
        validation: 
        check('Mechanics').exists().withMessage('No se especificó el parametro "Mechanics" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Mechanics) no puede ir vacío en la petición.')
            .isBoolean()
            .not()
            .isString().withMessage('El parametro (Mechanics) no puede ser de tipo string en la petición.')
            .not()
            .isNumeric().withMessage('El parametro (Mechanics) no puede ser de tipo número en la petición.')
    },
    {
        field: 'Powertrain',
        validation: 
        check('Powertrain').exists().withMessage('No se especificó el parametro "Powertrain" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Powertrain) no puede ir vacío en la petición.')
            .isBoolean()
            .not()
            .isString().withMessage('El parametro (Powertrain) no puede ser de tipo string en la petición.')
            .not()
            .isNumeric().withMessage('El parametro (Powertrain) no puede ser de tipo número en la petición.')
    },
    {
        field: 'Open',
        validation: 
        check('Open').exists().withMessage('No se especificó el parametro "Open" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Open) no puede ir vacío en la petición.')
            .isBoolean()
            .not()
            .isString().withMessage('El parametro (Open) no puede ser de tipo string en la petición.')
            .not()
            .isNumeric().withMessage('El parametro (Open) no puede ser de tipo número en la petición.')
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
        field: 'ContactId',
        validation:
        check('ContactId')
            .exists().withMessage('No se especificó el parametro (ContactId) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (ContactId) no puede ir vacío en la petición.')
            .isLength({min:1, max: 20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    },
    {
        field: 'State',
        validation:
        check('State')
            .exists().withMessage('No se especificó el parametro (State) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (State) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'OrderDocument',
        validation:
        check('OrderDocument')
            .exists().withMessage('No se especificó el parametro (OrderDocument) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (OrderDocument) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'OrderNumber',
        validation:
        check('OrderNumber')
            .exists().withMessage('No se especificó el parametro (OrderNumber) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (OrderNumber) no puede ir vacío en la petición.')
            .isNumeric()
    },
    {
        field: 'CardNumber',
        validation:
        check('CardNumber')
            .exists().withMessage('No se especificó el parametro (CardNumber) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (CardNumber) no puede ir vacío en la petición.')
            .isNumeric()
    },
    {
        field: 'AnnulledReason',
        validation: 
        check('AnnulledReason').exists().withMessage('No se especificó el parametro "AnnulledReason" en la petición.')
            .exists().withMessage('No se especificó el parametro (AnnulledReason) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (AnnulledReason) no puede ir vacío en la petición.')
            .isLength({min:1, max: 250}).withMessage('El tamaño del string debe ser de 1 a 250 caracteres.')
    },
    {
        field: 'ReceptionNote',
        validation: 
        check('ReceptionNote')
            .exists().withMessage('No se especificó el parametro (ReceptionNote) en la petición.')
            .isLength({min:0, max: 250}).withMessage('El tamaño del string (ReceptionNote) debe ser de 1 a 250 caracteres.')
    },
    {
        field: 'InitialDate',
        validation:
        check('InitialDate')
            .exists({checkNull: false}).withMessage('No se especificó el parametro (InitialDate) en la petición.')
            .isISO8601().toDate().withMessage("El parametro (InitialDate) fecha debe cumplir el formato ISO8601")
            .optional({values: 'null'})
    },
    {
        field: 'FinalDate',
        validation:
        check('FinalDate')
            .exists({checkNull: false}).withMessage('No se especificó el parametro (FinalDate) en la petición.')
            .isISO8601().toDate().withMessage("El parametro (FinalDate) fecha debe cumplir el formato ISO8601")
            .optional({values: 'null'})
    },
    {
        field: 'OpenSearch',
        validation: 
        check('OpenSearch')
            .exists({checkNull: false}).withMessage('No se especificó el parametro (OpenSearch) en la petición.')
            .not()
            .isString().withMessage('El parametro (OpenSearch) no puede ser de tipo string en la petición.')
            .not()
            .isNumeric().withMessage('El parametro (OpenSearch) no puede ser de tipo número en la petición.')
            .isBoolean()
            .optional({values: 'null'})
    },
    {
        field: 'StateSearch',
        validation:
        check('StateSearch')
            .exists({checkNull: false}).withMessage('No se especificó el parametro (StateSearch) en la petición.')
            .not()
            .isNumeric().withMessage('El parametro (StateSearch) no puede ser de tipo número en la petición.')
            .isString().withMessage('El parametro (StateSearch) debe ser de tipo string en la petición.')
            .optional({values: 'null'})
    }
]
 


const generateValidationToOrder = (fields: OrdersFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToOrder
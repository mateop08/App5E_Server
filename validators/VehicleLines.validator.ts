import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type VehicleLinesFields = 'LineId' | 'ManufacterId' | 'Description'

const validations: validation[] = [
    {
        field: 'LineId',
        validation: 
        check('LineId').exists().withMessage('No se especificó el parametro (LineId) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (LineId) no puede ir vacío en la petición.')
            .isNumeric()
    },
    {
        field: 'ManufacterId',
        validation:
        check('ManufacterId')
            .not()
            .isEmpty().withMessage('El parametro (ManufacterId) no puede ir vacío en la petición.')
            .isNumeric()
    },
    {
        field: 'Description',
        validation:
        check('Description')
            .exists().withMessage('No se especificó el parametro (Description) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Description) no puede ir vacío en la petición.')
            .isLength({min:1, max: 200}).withMessage('El tamaño del string debe ser de 1 a 200 caracteres.')
    }
]
 


const generateValidationToVehicleLine = (fields: VehicleLinesFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToVehicleLine
import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type VehiclesFields = 'Plate' | 'PlateType' | 'Description' | 'ManufacterId' | 'LineId' | 'YearId' | 'EngineId' | 'FuelType'

const validations: validation[] = [
    {
        field: 'Plate',
        validation:
        check('Plate')
            .exists().withMessage('No se especificó el parametro (Plate) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Plate) no puede ir vacío en la petición.')
            .isLength({min:6, max: 6}).withMessage('El tamaño del string debe ser exactamente de 6 caracteres.')
    },
    {
        field: 'PlateType',
        validation:
        check('PlateType')
            .exists().withMessage('No se especificó el parametro (PlateType) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (PlateType) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'Description',
        validation:
        check('Description')
            .exists().withMessage('No se especificó el parametro (Description) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Description) no puede ir vacío en la petición.')
            .isLength({min:1, max: 250}).withMessage('El tamaño del string debe ser de 1 a 250 caracteres.')
    },
    {
        field: 'LineId',
        validation:
        check('LineId')
            .not()
            .isEmpty().withMessage('El parametro (LineId) no puede ir vacío en la petición.')
            .isNumeric()
    },
    {
        field: 'YearId',
        validation:
        check('YearId')
            .not()
            .isEmpty().withMessage('El parametro (YearId) no puede ir vacío en la petición.')
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
        field: 'EngineId',
        validation:
        check('EngineId')
            .not()
            .isEmpty().withMessage('El parametro (EngineId) no puede ir vacío en la petición.')
            .isNumeric()
    },
    {
        field: 'FuelType',
        validation:
        check('FuelType')
            .exists().withMessage('No se especificó el parametro (FuelType) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (FuelType) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    }
]
 


const generateValidationToVehicle = (fields: VehiclesFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToVehicle
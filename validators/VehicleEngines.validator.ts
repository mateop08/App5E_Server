import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type VehicleYearsFields = 'EngineId' | 'YearId' | 'Description'

const validations: validation[] = [
    {
        field: 'EngineId',
        validation: 
        check('EngineId').exists().withMessage('No se especificó el parametro (EngineId) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (EngineId) no puede ir vacío en la petición.')
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
        field: 'Description',
        validation:
        check('Description')
            .exists().withMessage('No se especificó el parametro (Description) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Description) no puede ir vacío en la petición.')
            .matches(/([0-9]{1,2}\.[0-9]{1}$)/).withMessage('El motor creado debe cumplir con el formato 99.9')
            .custom((value) => {
                if (value > 20) {
                    throw("El cilindraje no debe ser mayor a 20")
                }
                return true
            })
    }
]
 


const generateValidationToVehicleYear = (fields: VehicleYearsFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToVehicleYear
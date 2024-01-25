import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
import { DateTime } from "luxon";
type VehicleYearsFields = 'LineId' | 'YearId' | 'Year'

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
        field: 'YearId',
        validation:
        check('YearId')
            .not()
            .isEmpty().withMessage('El parametro (YearId) no puede ir vacío en la petición.')
            .isNumeric()
    },
    {
        field: 'Year',
        validation:
        check('Year')
            .exists().withMessage('No se especificó el parametro (Year) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Year) no puede ir vacío en la petición.')
            .isNumeric().withMessage('Debe de ingresar un año valido')
            .isLength({min:4, max: 4}).withMessage('El año del vehículo debe contener exactamente 4 números.')
            .custom((value) => { 
                const nextYear = DateTime.local().year + 1
                if(value <= 1960) {
                    throw("El año debe ser mayor o igual 1900")
                }
                if(value >= nextYear + 1) {
                    throw(`El año debe ser menor o igual a ${nextYear}`)
                }
                return true
             })
    }
]
 


const generateValidationToVehicleYear = (fields: VehicleYearsFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToVehicleYear
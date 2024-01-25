import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type VehiclesFields = 'VehiclePlate' | 'ContactId'

const validations: validation[] = [
    {
        field: 'VehiclePlate',
        validation:
        check('VehiclePlate')
            .exists().withMessage('No se especificó el parametro (VehiclePlate) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (VehiclePlate) no puede ir vacío en la petición.')
            .isLength({min:6, max: 6}).withMessage('El tamaño del string debe ser exactamente de 6 caracteres.')
    },
    {
        field: 'ContactId',
        validation:
        check('ContactId')
            .exists().withMessage('No se especificó el parametro (ContactId) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (ContactId) no puede ir vacío en la petición.')
            .isLength({min:1, max: 20}).withMessage('El tamaño del string debe ser de 1 a 20 caracteres.')
    }
]
 


const generateValidationToVehicle = (fields: VehiclesFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToVehicle
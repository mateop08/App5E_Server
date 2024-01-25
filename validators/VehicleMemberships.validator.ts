import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator"
type VehicleMembershipsFields = 'Plate' | 'ContactId' | 'MembershipTypeCode' | 'CardNumber' | 'Active' | 'ContactId'

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
        field: 'MembershipTypeCode',
        validation:
        check('MembershipTypeCode')
            .exists().withMessage('No se especificó el parametro (MembershipTypeCode) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (MembershipTypeCode) no puede ir vacío en la petición.')
            .isLength({min:1, max: 5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'CardNumber',
        validation:
        check('CardNumber')
            .exists().withMessage('No se especificó el parametro (CardNumber) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (CardNumber) no puede ir vacío en la petición.')
            .isLength({min:1, max: 12}).withMessage('El tamaño del string debe ser exactamente de 12 caracteres.')
    },
    {
        field: 'Active',
        validation:
        check('Active')
            .exists().withMessage('No se especificó el parametro (Active) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Active) no puede ir vacío en la petición.')
            .isBoolean()
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
 


const generateValidationToVehicleMembership = (fields: VehicleMembershipsFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToVehicleMembership
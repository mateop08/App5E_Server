import { check } from "express-validator";
import validationGenerator from "../helpers/validationGenerator";
import { validation } from "../helpers/validationGenerator" 
type OrderStatesFields = 'Code' | 'Description' | 'Default' | 'Final'

const validations: validation[] = [
    {
        field: 'Code',
        validation: 
        check('Code').exists().withMessage('No se especificó el parametro "Code" en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Code) no puede ir vacío en la petición.')
            .isLength({min: 1, max:5}).withMessage('El tamaño del string debe ser de 1 a 5 caracteres.')
    },
    {
        field: 'Description',
        validation:
        check('Description')
            .exists().withMessage('No se especificó el parametro (Description) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Description) no puede ir vacío en la petición.')
            .isLength({min:1, max: 100}).withMessage('El tamaño del string debe ser de 1 a 100 caracteres.')
    },
    {
        field: 'Default',
        validation:
        check('Default')
            .exists().withMessage('No se especificó el parametro (Default) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Default) no puede ir vacío en la petición.')
            .isBoolean().withMessage('El parametro (Default) debe ser de tipo booleano.')
            .not()
            .isString().withMessage('El parametro (Default) no puede ser de tipo string.')
            .not()
            .isNumeric().withMessage('El parametro (Default) no puede ser de tipo numerico')
    },
    {
        field: 'Final',
        validation:
        check('Final')
            .exists().withMessage('No se especificó el parametro (Final) en la petición.')
            .not()
            .isEmpty().withMessage('El parametro (Final) no puede ir vacío en la petición.')
            .isBoolean().withMessage('El parametro (Final) debe ser de tipo booleano.')
            .not()
            .isString().withMessage('El parametro (Final) no puede ser de tipo string.')
            .not()
            .isNumeric().withMessage('El parametro (Final) no puede ser de tipo numerico')
    }
]
 


const generateValidationToOrderState = (fields: OrderStatesFields[]) => {
    return validationGenerator(fields, validations)
}

export default generateValidationToOrderState
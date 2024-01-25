import { Router } from "express";
import { ListCustomersBySearchText, GetCustomerByIdentification } from '../../controllers/Ofima/Customer.controller'
import generateValidation from "../../validators/Ofima/Customer.validator";

const router = Router()

router.get('/customer/search/', generateValidation(['SearchText']), ListCustomersBySearchText)
router.get('/customer/byIdentification/', generateValidation(['Identification']), GetCustomerByIdentification)

export default router

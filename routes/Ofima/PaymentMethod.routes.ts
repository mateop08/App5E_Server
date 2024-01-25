import { Router } from "express";
import { ListPaymentMethodsByUser } from '../../controllers/Ofima/PaymentMethod.controller'
import generateValidation from "../../validators/Ofima/PaymentMethod.validator";

const router = Router()

router.get('/paymentmethods/', generateValidation(['User']), ListPaymentMethodsByUser)

export default router

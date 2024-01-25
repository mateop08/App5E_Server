import { Router } from "express";
import { ListCashRegistersByUser } from '../../controllers/Ofima/CashRegister.controller'
import generateValidation from "../../validators/Ofima/CashRegister.validator";

const router = Router()

router.get('/cashregister/', generateValidation(['User']), ListCashRegistersByUser)

export default router

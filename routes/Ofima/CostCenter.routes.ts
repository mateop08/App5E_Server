import { Router } from "express";
import { ListCostCentersByUser } from '../../controllers/Ofima/CostCenter.controller'
import generateValidation from "../../validators/Ofima/CostCenter.validator";

const router = Router()

router.get('/costcenter/', generateValidation(['User']), ListCostCentersByUser)

export default router

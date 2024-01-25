import { Router } from "express";
import { ListStoresByUser } from '../../controllers/Ofima/Store.controller'
import generateValidation from "../../validators/Ofima/Store.validator";

const router = Router()

router.get('/store/', generateValidation(['User']), ListStoresByUser)

export default router

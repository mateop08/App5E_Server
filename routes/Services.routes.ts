import { Router } from "express";
import { ListServicesByDescription } from "../controllers/Services.controller";
import generateValidation from "../validators/Services.validator";


const router = Router()

router.get('/services/', generateValidation(['OrderDocument','Description']), ListServicesByDescription)

export default router

import { Router } from "express";
import { login, loginWithToken } from "../controllers/Login.controller";
import generateValidationToLogin from "../validators/Login.validator";
const router = Router()

router.post('/login/', generateValidationToLogin(['User','Password']), login)
router.post('/login/token/', loginWithToken)
export default router
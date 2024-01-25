import { Router } from "express";
import { CreateAppFunction,  ListAppFunctionsByDescription, EditAppFunction, DeleteAppFunction, ListAllAppFunctions } from "../controllers/AppFunctions.controller"
import generateValidation from "../validators/AppFunctions.validator";


const router = Router()

router.get('/appfunctions/', generateValidation([]), ListAllAppFunctions)
router.get('/appfunctions/byDescription/', generateValidation(['Description']), ListAppFunctionsByDescription)
router.post('/appfunctions/', generateValidation(['Code','Description','Method','Route','RequiresAuth']), CreateAppFunction)
router.put('/appfunctions/', generateValidation(['Code','Description','Method','Route','RequiresAuth']), EditAppFunction)
router.delete('/appfunctions/', generateValidation(['Code']), DeleteAppFunction)

export default router

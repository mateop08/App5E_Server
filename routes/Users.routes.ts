import { Router } from "express";
import { CreateUser, GetUserByUserCode, ListUsersByName, EditUser, DeleteUser, ListAllUsers } from "../controllers/Users.controller"
import generateValidation from "../validators/Users.validator";


const router = Router()

router.get('/users/', generateValidation([]), ListAllUsers)
router.get('/users/byName/', generateValidation(['Name']), ListUsersByName)
router.get('/users/byUserCode/', generateValidation(['UserCode']), GetUserByUserCode)
router.post('/users/', generateValidation(['UserCode','Password','Name']), CreateUser)
router.put('/users/', generateValidation(['UserCode','Password','Name']), EditUser)
router.delete('/users/', generateValidation(['UserCode']), DeleteUser)

export default router

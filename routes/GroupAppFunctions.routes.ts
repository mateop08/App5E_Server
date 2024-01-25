import { Router } from "express";
import { CreateGroupAppFunction,  ListFunctionsByGroupCode, ListGroupsByAppFunctionCode, DeleteGroupAppFunction, SetByAppFunctionListAndGroupCode } from "../controllers/GroupAppFunctions.controller"
import generateValidation from "../validators/GroupAppFunctions.validator";


const router = Router()

router.get('/groupappfunctions/byAppfunctioncode/', generateValidation(['AppFunctionCode']), ListGroupsByAppFunctionCode)
router.get('/groupappfunctions/byGroupcode/', generateValidation(['GroupCode']), ListFunctionsByGroupCode)
router.post('/groupappfunctions/', generateValidation(['AppFunctionCode', 'GroupCode']), CreateGroupAppFunction)
router.post('/groupappfunctions/byAppfunctionlistandgroupcode/', generateValidation(['GroupCode', 'AppFunctionList', 'AppFunctionList.AppFunctionCode']), SetByAppFunctionListAndGroupCode)
router.delete('/groupappfunctions/', generateValidation(['AppFunctionCode', 'GroupCode']), DeleteGroupAppFunction)

export default router

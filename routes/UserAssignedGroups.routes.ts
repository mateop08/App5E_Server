import { Router } from "express";
import { CreateUserAssignedGroup,  CreateByGroupsListAndUserCode, ListUsersByGroupCode, ListGroupsByUserCode, DeleteUserAssignedGroup } from "../controllers/UserAssignedGroups.controller"
import generateValidation from "../validators/UserAssignedGroups.validator";


const router = Router()

router.get('/userassignedgroups/byUsercode/', generateValidation(['UserCode']), ListGroupsByUserCode)
router.get('/userassignedgroups/byGroupcode/', generateValidation(['GroupCode']), ListUsersByGroupCode)
router.post('/userassignedgroups/', generateValidation(['UserCode', 'GroupCode']), CreateUserAssignedGroup)
router.post('/userassignedgroups/byGroupslistandusercode/', generateValidation(['UserCode', 'GroupsList', 'GroupsList.GroupCode']), CreateByGroupsListAndUserCode)
router.delete('/userassignedgroups/', generateValidation(['UserCode', 'GroupCode']), DeleteUserAssignedGroup)

export default router

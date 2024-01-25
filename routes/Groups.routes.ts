import { Router } from "express";
import { CreateGroup,  ListGroupsByDescription, EditGroup, DeleteGroup, ListAllGroups, GetGroupByCode } from "../controllers/Groups.controller"
import generateValidation from "../validators/Groups.validator";


const router = Router()

router.get('/groups/', generateValidation([]), ListAllGroups)
router.get('/groups/byDescription/', generateValidation(['Description']), ListGroupsByDescription)
router.get('/groups/byCode/', generateValidation(['Code']), GetGroupByCode)
router.post('/groups/', generateValidation(['Code','Description']), CreateGroup)
router.put('/groups/', generateValidation(['Code','Description']), EditGroup)
router.delete('/groups/', generateValidation(['Code']), DeleteGroup)

export default router

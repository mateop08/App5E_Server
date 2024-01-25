import { Router } from "express";
import { CreateVehicleMembershipType,  ListVehicleMembershipTypesByDescription, EditVehicleMembershipType, DeleteVehicleMembershipType, ListAllVehicleMembershipTypes } from "../controllers/VehicleMembershipTypes.controller"
import generateValidation from "../validators/VehicleMembershipTypes.validator";


const router = Router()

router.get('/vehiclemembershiptypes/', generateValidation([]), ListAllVehicleMembershipTypes)
router.get('/vehiclemembershiptypes/byDescription/', generateValidation(['Description']), ListVehicleMembershipTypesByDescription)
router.post('/vehiclemembershiptypes/', generateValidation(['Code','Description']), CreateVehicleMembershipType)
router.put('/vehiclemembershiptypes/', generateValidation(['Code','Description']), EditVehicleMembershipType)
router.delete('/vehiclemembershiptypes/', generateValidation(['Code']), DeleteVehicleMembershipType)

export default router

import { Router } from "express";
import { CreateVehicleMembership,  ListVehicleMembershipsByPlate, ListVehicleMembershipByContactId, DeleteVehicleMembership, ActivateVehicleMembership, DeactivateVehicleMembership, GetVehicleMembershipsByCardNumber } from "../controllers/VehicleMemberships.controller"
import generateValidation from "../validators/VehicleMemberships.validator";


const router = Router()

router.get('/vehiclememberships/byPlate/', generateValidation(['Plate']), ListVehicleMembershipsByPlate)
router.get('/vehiclememberships/byContactid/', generateValidation(['ContactId']), ListVehicleMembershipByContactId)
router.get('/vehiclememberships/byCardnumber/', generateValidation(['CardNumber']), GetVehicleMembershipsByCardNumber)
router.post('/vehiclememberships/', generateValidation(['Plate', 'ContactId', 'MembershipTypeCode']), CreateVehicleMembership)
router.put('/vehiclememberships/activate/', generateValidation(['CardNumber']), ActivateVehicleMembership)
router.put('/vehiclememberships/deactivate/', generateValidation(['CardNumber']), DeactivateVehicleMembership)
router.delete('/vehiclememberships/', generateValidation(['CardNumber']), DeleteVehicleMembership)

export default router

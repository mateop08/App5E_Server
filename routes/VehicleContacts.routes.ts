import { Router } from "express";
import { CreateVehicleContact,  ListContactsByPlate, ListVehiclesByContactId, DeleteVehicleContact, ExistsVehicleContact } from "../controllers/VehicleContacts.controller"
import generateValidation from "../validators/VehicleContacts.validator";


const router = Router()

router.get('/vehiclecontacts/byVehicleplate/', generateValidation(['VehiclePlate']), ListContactsByPlate)
router.get('/vehiclecontacts/byContactid/', generateValidation(['ContactId']), ListVehiclesByContactId)
router.post('/vehiclecontacts/', generateValidation(['VehiclePlate', 'ContactId']), CreateVehicleContact)
router.post('/vehiclecontacts/exists/', generateValidation(['VehiclePlate', 'ContactId']), ExistsVehicleContact)
router.delete('/vehiclecontacts/', generateValidation(['VehiclePlate', 'ContactId']), DeleteVehicleContact)

export default router

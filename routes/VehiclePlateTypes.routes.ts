import { Router } from "express";
import { CreateVehiclePlateType,  ListVehiclePlateTypesByDescription, EditVehiclePlateType, DeleteVehiclePlateType, ListAllVehiclePlateTypes } from "../controllers/VehiclePlateTypes.controller"
import generateValidation from "../validators/VehiclePlateTypes.validator";


const router = Router()

router.get('/vehicleplatetypes/', generateValidation([]), ListAllVehiclePlateTypes)
router.get('/vehicleplatetypes/byDescription/', generateValidation(['Description']), ListVehiclePlateTypesByDescription)
router.post('/vehicleplatetypes/', generateValidation(['Code','Description']), CreateVehiclePlateType)
router.put('/vehicleplatetypes/', generateValidation(['Code','Description']), EditVehiclePlateType)
router.delete('/vehicleplatetypes/', generateValidation(['Code']), DeleteVehiclePlateType)

export default router

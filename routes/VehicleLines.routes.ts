import { Router } from "express";
import { CreateVehicleLine,  ListVehicleLinesByManufacterId, EditVehicleLine, DeleteVehicleLine, ListAllVehicleLines } from "../controllers/VehicleLines.controller"
import generateValidation from "../validators/VehicleLines.validator";


const router = Router()

router.get('/vehiclelines/', generateValidation([]), ListAllVehicleLines)
router.get('/vehiclelines/byManufacterid/', generateValidation(['ManufacterId']), ListVehicleLinesByManufacterId)
router.post('/vehiclelines/', generateValidation(['ManufacterId','Description']), CreateVehicleLine)
router.put('/vehiclelines/', generateValidation(['LineId','ManufacterId','Description']), EditVehicleLine)
router.delete('/vehiclelines/', generateValidation(['LineId']), DeleteVehicleLine)

export default router

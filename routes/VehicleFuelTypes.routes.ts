import { Router } from "express";
import { CreateVehicleFuelType,  ListVehicleFuelTypesByDescription, EditVehicleFuelType, DeleteVehicleFuelType, ListAllVehicleFuelTypes } from "../controllers/VehicleFuelTypes.controller"
import generateValidation from "../validators/VehicleFuelTypes.validator";


const router = Router()

router.get('/vehiclefueltypes/', generateValidation([]), ListAllVehicleFuelTypes)
router.get('/vehiclefueltypes/byDescription/', generateValidation(['Description']), ListVehicleFuelTypesByDescription)
router.post('/vehiclefueltypes/', generateValidation(['Code','Description']), CreateVehicleFuelType)
router.put('/vehiclefueltypes/', generateValidation(['Code','Description']), EditVehicleFuelType)
router.delete('/vehiclefueltypes/', generateValidation(['Code']), DeleteVehicleFuelType)

export default router

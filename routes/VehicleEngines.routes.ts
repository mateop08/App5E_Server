import { Router } from "express";
import { CreateVehicleEngine,  ListVehicleEnginesByYearId, EditVehicleEngine, DeleteVehicleEngine, ListAllVehicleEngines } from "../controllers/VehicleEngines.controller"
import generateValidation from "../validators/VehicleEngines.validator";


const router = Router()

router.get('/vehicleengines/', generateValidation([]), ListAllVehicleEngines)
router.get('/vehicleengines/byYearid/', generateValidation(['YearId']), ListVehicleEnginesByYearId)
router.post('/vehicleengines/', generateValidation(['YearId','Description']), CreateVehicleEngine)
router.put('/vehicleengines/', generateValidation(['EngineId','YearId','Description']), EditVehicleEngine)
router.delete('/vehicleengines/', generateValidation(['EngineId']), DeleteVehicleEngine)

export default router

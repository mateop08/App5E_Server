import { Router } from "express";
import { CreateVehicle,  ListVehiclesByDescription, EditVehicle, DeleteVehicle, ListAllVehicles, GetVehicleByPlate } from "../controllers/Vehicles.controller"
import generateValidation from "../validators/Vehicles.validator";


const router = Router()

router.get('/vehicles/', generateValidation([]), ListAllVehicles)
router.get('/vehicles/byDescription/', generateValidation(['Description']), ListVehiclesByDescription)
router.get('/vehicles/byPlate/', generateValidation(['Plate']), GetVehicleByPlate)
router.post('/vehicles/', generateValidation(['Plate', 'PlateType', 'ManufacterId', 'LineId', 'YearId', 'EngineId', 'FuelType']), CreateVehicle)
router.put('/vehicles/', generateValidation(['Plate', 'PlateType', 'ManufacterId', 'LineId', 'YearId', 'EngineId', 'FuelType']), EditVehicle)
router.delete('/vehicles/', generateValidation(['Plate']), DeleteVehicle)

export default router

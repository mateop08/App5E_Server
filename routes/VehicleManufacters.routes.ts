import { Router } from "express";
import { CreateVehicleManufacter,  ListVehicleManufactersByDescription, EditVehicleManufacter, DeleteVehicleManufacter, ListAllVehicleManufacters } from "../controllers/VehicleManufacters.controller"
import generateValidation from "../validators/VehicleManufacters.validator";


const router = Router()

router.get('/vehiclemanufacters/', generateValidation([]), ListAllVehicleManufacters)
router.get('/vehiclemanufacters/byDescription/', generateValidation(['Description']), ListVehicleManufactersByDescription)
router.post('/vehiclemanufacters/', generateValidation(['Description']), CreateVehicleManufacter)
router.put('/vehiclemanufacters/', generateValidation(['ManufacterId','Description']), EditVehicleManufacter)
router.delete('/vehiclemanufacters/', generateValidation(['ManufacterId']), DeleteVehicleManufacter)

export default router

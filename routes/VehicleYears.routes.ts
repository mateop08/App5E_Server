import { Router } from "express";
import { CreateVehicleYear,  ListVehicleYearsByLineId, EditVehicleYear, DeleteVehicleYear, ListAllVehicleYears } from "../controllers/VehicleYears.controller"
import generateValidation from "../validators/VehicleYears.validator";


const router = Router()

router.get('/vehicleyears/', generateValidation([]), ListAllVehicleYears)
router.get('/vehicleyears/byLineid/', generateValidation(['LineId']), ListVehicleYearsByLineId)
router.post('/vehicleyears/', generateValidation(['LineId','Year']), CreateVehicleYear)
router.put('/vehicleyears/', generateValidation(['LineId','YearId','Year']), EditVehicleYear)
router.delete('/vehicleyears/', generateValidation(['YearId']), DeleteVehicleYear)

export default router

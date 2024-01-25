import { Router } from "express";
import { CreateTechnician,  ListTechniciansByDescription, EditTechnician, DeleteTechnician, ListAllTechnicians } from "../controllers/Technicians.controller"
import generateValidation from "../validators/Technicians.validator";


const router = Router()

router.get('/technicians/', generateValidation([]), ListAllTechnicians)
router.get('/technicians/byDescription/', generateValidation(['Description']), ListTechniciansByDescription)
router.post('/technicians/', generateValidation(['Code','Description']), CreateTechnician)
router.put('/technicians/', generateValidation(['Code','Description']), EditTechnician)
router.delete('/technicians/', generateValidation(['Code']), DeleteTechnician)

export default router

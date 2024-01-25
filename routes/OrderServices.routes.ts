import { Router } from "express";
import { CreateOrderService,  ListByOrder, EditOrderService, DeleteOrderService } from "../controllers/OrderServices.controller"
import generateValidation from "../validators/OrderServices.validator";


const router = Router()

router.get('/orderservices/', generateValidation(['OrderDocument', 'OrderNumber']), ListByOrder)
router.post('/orderservices/', generateValidation(['OrderDocument','OrderNumber','Code', 'Amount', 'TechnicianCode', 'Note','User']), CreateOrderService)
router.put('/orderservices/', generateValidation(['Id','Code', 'Amount', 'TechnicianCode', 'Note', 'User']), EditOrderService)
router.delete('/orderservices/', generateValidation(['Id']), DeleteOrderService)

export default router

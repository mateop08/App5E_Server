import { Router } from "express";
import { CreateOrderState,  ListOrderStatesByDescription, EditOrderState, DeleteOrderState, ListAllOrderStates } from "../controllers/OrderStates.controller"
import generateValidation from "../validators/OrderStates.validator";


const router = Router()

router.get('/orderstates/', generateValidation([]), ListAllOrderStates)
router.get('/orderstates/byDescription/', generateValidation(['Description']), ListOrderStatesByDescription)
router.post('/orderstates/', generateValidation(['Code','Description','Default','Final']), CreateOrderState)
router.put('/orderstates/', generateValidation(['Code','Description','Default','Final']), EditOrderState)
router.delete('/orderstates/', generateValidation(['Code']), DeleteOrderState)

export default router

import { Router } from "express";
import { CreateOrderProduct,  ListByOrder, EditOrderProduct, DeleteOrderProduct } from "../controllers/OrderProducts.controller"
import generateValidation from "../validators/OrderProducts.validator";


const router = Router()

router.get('/orderproducts/', generateValidation(['OrderDocument', 'OrderNumber']), ListByOrder)
router.post('/orderproducts/', generateValidation(['OrderDocument','OrderNumber','Code', 'Amount', 'User']), CreateOrderProduct)
router.put('/orderproducts/', generateValidation(['Id','Code', 'Amount', 'User']), EditOrderProduct)
router.delete('/orderproducts/', generateValidation(['Id']), DeleteOrderProduct)

export default router

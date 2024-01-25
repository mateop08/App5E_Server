import { Router } from "express";
import { ListProductsByDescription, ListBulkProducts } from "../controllers/Products.controller";
import generateValidation from "../validators/Products.validator";


const router = Router()

router.get('/products/', generateValidation(['OrderDocument','Description']), ListProductsByDescription)
router.get('/products/bulk/', generateValidation(['OrderDocument']), ListBulkProducts)

export default router

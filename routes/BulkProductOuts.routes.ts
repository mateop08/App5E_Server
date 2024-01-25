import { Router } from "express";
import { CreateBulkProductOut, GetBulkProductOutByOutId, ListBulkProductOutsByOpeningId, ListBulkProductOutsByOrderProductId } from "../controllers/BulkProductOuts.controller"
import generateValidation from "../validators/BulkProductOuts.validator";

const router = Router()

router.get('/bulkproductouts/byOutId/', generateValidation(['OutId']), GetBulkProductOutByOutId)
router.get('/bulkproductouts/byOpeningId/', generateValidation(['OpeningId']), ListBulkProductOutsByOpeningId)
router.get('/bulkproductouts/byOrderProductId/', generateValidation(['OrderProductId']), ListBulkProductOutsByOrderProductId)
router.post('/bulkproductouts/', 
    generateValidation(['ProductCode', 'InitialNumber', 'FinalNumber', 'Amount', 'WithDigitalDispenser', 
        'ForServiceOrder', 'OrderProductId', 'User']), CreateBulkProductOut)

export default router
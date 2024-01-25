import { Router } from "express";
import { CreateBulkProductOutAnnullation, GetBulkProductOutAnnullationByAnnullationId, ListBulkProductOutAnnullationsByOutId } from "../controllers/BulkProductOutAnnullations.controller"
import generateValidation from "../validators/BulkProductOutAnnullations.validator";

const router = Router()

router.get('/bulkproductoutannullations/byAnnullationId/', generateValidation(['AnnullationId']), GetBulkProductOutAnnullationByAnnullationId)
router.get('/bulkproductoutannullations/byOutId/', generateValidation(['OutId']), ListBulkProductOutAnnullationsByOutId)
router.post('/bulkproductoutannullations/', generateValidation(['ProductCode', 'Amount', 'OutId', 'AnnulledReason', 'User']), CreateBulkProductOutAnnullation)

export default router   